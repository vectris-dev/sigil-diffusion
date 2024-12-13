import { useEffect, useState } from "react";
import Head from "next/head";
import Canvas from "components/canvas";
import Output from "components/output";
import Error from "components/error";
import uploadFile from "lib/upload";
import pkg from "../package.json";
import sleep from "lib/sleep";
import IntentionForm from "components/intention-form";
import { PrimaryButton } from "components/PrimaryButton";

const HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const debug = true;

export default function Home() {
  const [intention, setIntention] = useState("");
  const [processedIntention, setProcessedIntention] = useState("");
  const [drawing, setDrawing] = useState(null);
  const [drawingExists, setDrawingExists] = useState(false);
  const [output, setOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (debug) {
      setIntention("I am focused and productive");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let prompt = `A glowing, mystical sigil with intricate patterns, radiating magical energy, symbolizing the intention: "${intention}". The sigil is surrounded by an aura of light, with ethereal and otherworldly effects, evoking a sense of immense power and focus.`;

    setError(null);
    setIsProcessing(true);

    const fileUrl = await uploadFile(drawing);

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
    setOutput(prediction);
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      setOutput(prediction);
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
        <div className={`container max-w-[512px] mx-auto transition-all duration-700 ${processedIntention ? "mt-0" : "mt-[30vh]"}`}>
          <IntentionForm intention={intention} setIntention={setIntention} onIntentionProcessed={setProcessedIntention} />

          {processedIntention && (
            <div className="animate-in fade-in duration-700">
              <Canvas onDrawing={setDrawing} drawingExists={drawingExists} setDrawingExists={setDrawingExists} />

              <PrimaryButton disabled={!drawingExists} onClick={handleSubmit}>
                Charge
              </PrimaryButton>
            </div>
          )}

          <Error error={error} />
        </div>

        {output && <Output output={output} />}
      </main>
    </>
  );
}
