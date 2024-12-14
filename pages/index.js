import { useEffect, useState } from "react";
import Head from "next/head";
import Canvas from "components/canvas";
import Output from "components/output";
import Error from "components/error";
import uploadFile from "lib/upload";
import pkg from "../package.json";
import sleep from "lib/sleep";
import IntentionForm from "components/intention-form";

const HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const States = {
  INTENTION: "INTENTION",
  CANVAS: "CANVAS",
  OUTPUT: "OUTPUT",
  ERROR: "ERROR",
};

const debug = true;

export default function Home() {
  const [currentState, setCurrentState] = useState(States.INTENTION);
  const [intention, setIntention] = useState("");
  const [processedIntention, setProcessedIntention] = useState("");
  const [drawing, setDrawing] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    if (debug) {
      setIntention("I am focused and productive");
    }
  }, []);

  const handleIntentionComplete = () => {
    transitionTo(States.CANVAS);
  };

  const handleCanvasComplete = async (e) => {
    e.preventDefault();
    transitionTo(States.OUTPUT);

    let prompt = `A glowing, mystical sigil with intricate patterns, radiating magical energy, symbolizing the intention: "${intention}". The sigil is surrounded by an aura of light, with ethereal and otherworldly effects, evoking a sense of immense power and focus.`;

    try {
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
        transitionTo(States.ERROR);
        return;
      }

      while (prediction.status !== "succeeded" && prediction.status !== "failed") {
        await sleep(500);
        const response = await fetch("/api/predictions/" + prediction.id);
        prediction = await response.json();
        setOutput(prediction);
        if (response.status !== 200) {
          setError(prediction.detail);
          transitionTo(States.ERROR);
          return;
        }
      }
    } catch (err) {
      setError(err.message);
      transitionTo(States.ERROR);
    }
  };

  const restart = () => {
    transitionTo(States.INTENTION);
    setDrawing(null);
    setOutput(null);
    setError(null);
  };

  const transitionTo = (state) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentState(state);
      setIsTransitioning(false);
    }, 300);
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

      <div className={`min-h-screen bg-white dark:bg-black text-black dark:text-white relative transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <div className="w-full mx-auto flex items-center justify-center min-h-screen">
          <main className="container mx-auto p-5 flex flex-col items-center justify-center">
            {currentState === States.INTENTION && <IntentionForm intention={intention} setIntention={setIntention} onIntentionProcessed={handleIntentionComplete} />}
            {currentState === States.CANVAS && <Canvas onDrawing={setDrawing} onSubmit={handleCanvasComplete} />}
            {currentState === States.OUTPUT && <Output prediction={output} onReset={restart} />}
            {currentState === States.ERROR && <Error error={error} onReset={restart} />}
          </main>
        </div>
      </div>
    </>
  );
}
