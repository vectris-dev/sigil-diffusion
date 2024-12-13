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
import IntentionForm from "components/intention-form";
import { PrimaryButton } from "components/PrimaryButton";
import { Popover } from "@headlessui/react";

const HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export default function Home() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const [predictions, setPredictions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [sigilExists, setSigilExists] = useState(false);
  const [seed] = useState(seeds[Math.floor(Math.random() * seeds.length)]);
  const [sigil, setSigil] = useState(null);
  const [intention, setIntention] = useState("I am focused and productive");
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
        <meta property="og:image" content={`${HOST}/cover.jpg`} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className="container max-w-[1024px] mx-auto p-5 min-h-screen">
        <div className={`container max-w-[512px] mx-auto transition-all duration-700 ${intentionReady ? "mt-0" : "mt-[30vh]"}`}>
          <IntentionForm intention={intention} setIntention={setIntention} onIntentionReady={setIntentionReady} />

          {intentionReady && (
            <div className="animate-in fade-in duration-700">
              <div className="text-center text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Popover className="relative">
                  <Popover.Button className="focus:outline-none text-blue-600 hover:text-blue-800 text-lg font-normal">
                    What is a sigil?
                  </Popover.Button>
                  <Popover.Panel className="absolute z-10 w-80 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg left-1/2 transform -translate-x-1/2">
                    <p className="text-sm text-gray-600">
                      A sigil is a visual distillation of your intention. Begin with the letters provided, stripped of repetition and vowels, and let their
                      shapes guide you. Combine, intertwine, and transform them into a design that resonates with your intention. There are no rules—only the flow of your creativity and the focus of
                      your will. As you craft, infuse the symbol with meaning, allowing it to embody your purpose and energy. Your sigil is complete when it feels alive, charged with the essence of
                      your intention.
                    </p>
                  </Popover.Panel>
                </Popover>
              </div>

              <Canvas startingPaths={seed.paths} onSigil={setSigil} sigilExists={sigilExists} setSigilExists={setSigilExists} />

              <PrimaryButton disabled={!sigilExists} onClick={handleSubmit}>
                Charge
              </PrimaryButton>
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
