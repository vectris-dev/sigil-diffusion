import { useState } from "react";
import Head from "next/head";
import Canvas from "components/canvas";
import Predictions from "components/predictions";
import Error from "components/error";
import uploadFile from "lib/upload";
import Script from "next/script";
import seeds from "lib/seeds";
import pkg from "../package.json";
import sleep from "lib/sleep";
import SigilForge from "components/sigilForge";

const HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export default function Home() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const [predictions, setPredictions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [sigilExists, setSigilExists] = useState(false);
  const [seed] = useState(seeds[Math.floor(Math.random() * seeds.length)]);
  const [sigil, setSigil] = useState(null);
  const [intention, setIntention] = useState('I am focused and productive');
  const [intentionReady, setIntentionReady] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmissionCount(submissionCount + 1);

    let prompt = `A glowing, mystical sigil with intricate patterns, radiating magical energy, symbolizing the intention: "${intention}". The sigil is surrounded by an aura of light, with ethereal and otherworldly effects, evoking a sense of immense power and focus.`;

    setError(null);
    setIsProcessing(true);

    const fileUrl = await uploadFile(sigil);

    const body = {
      prompt,
      image: fileUrl,
      structure: "scribble",
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();

    setPredictions((predictions) => ({
      ...predictions,
      [prediction.id]: prediction,
    }));

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      setPredictions((predictions) => ({
        ...predictions,
        [prediction.id]: prediction,
      }));
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
    }

    setIsProcessing(false);
  };

  return (
    <>
      <Head>
        <title>{pkg.appName}</title>
        <meta name="description" content={pkg.appMetaDescription} />
        <meta property="og:title" content={pkg.appName} />
        <meta property="og:description" content={pkg.appMetaDescription} />
        <meta property="og:image" content={`${HOST}/opengraph.jpg`} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className="container max-w-[1024px] mx-auto p-5 ">
        <div className="container max-w-[512px] mx-auto">

          <SigilForge intention={intention} setIntention={setIntention} onIntentionReady={setIntentionReady} />

          {intentionReady && (
            <div className="animate-in fade-in duration-700">
              <Canvas startingPaths={seed.paths} onSigil={setSigil} sigilExists={sigilExists} setSigilExists={setSigilExists} />

              <button 
                className={`
                  bg-black text-white rounded-md text-small px-5 py-3
                  mx-auto block
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-opacity duration-200 mt-6
                `} 
                disabled={!sigilExists} 
                onClick={handleSubmit}
              >
                Charge
              </button>
            </div>
          )}

          <Error error={error} />
        </div>

        <Predictions predictions={predictions} isProcessing={isProcessing} submissionCount={submissionCount} />
      </main>

      <Script src="https://js.bytescale.com/upload-js-full/v1" />
    </>
  );
}
