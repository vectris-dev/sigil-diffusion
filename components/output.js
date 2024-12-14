import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "components/loader";
import { extractIntention } from "lib/intention";
import copy from "copy-to-clipboard";
import { Copy as CopyIcon, PlusCircle as PlusCircleIcon } from "lucide-react";

export default function Output({ prediction, onReset }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = () => {
    const url = window.location.origin + "/sigils/" + (prediction.uuid || prediction.id);
    copy(url);
    setLinkCopied(true);
  };

  const downloadSigil = async () => {
    if (prediction.output?.length) {
      try {
        const response = await fetch(prediction.output[prediction.output.length - 1]);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `sigil-${extractIntention(prediction.input.prompt)}-${prediction.uuid || prediction.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };

  // Clear the "Copied!" message after 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLinkCopied(false);
    }, 4 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!prediction) return null;

  return (
    <div className="mt-6 mb-12">
      <div className="my-5 p-5 flex justify-center">
        <div className="aspect-square relative w-full max-w-[512px]">
          {prediction.output?.length ? (
            <img src={prediction.output[prediction.output.length - 1]} alt="output image" className="w-full aspect-square object-contain" />
          ) : (
            <div className="grid h-full place-items-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
      <div className="text-center px-4 opacity-60 text-xl">&ldquo;{extractIntention(prediction.input.prompt)}&rdquo;</div>
      <div className="text-center py-2">
        <button className="lil-button" onClick={copyLink}>
          <CopyIcon className="icon" />
          {linkCopied ? "Copied!" : "Copy link"}
        </button>

        <button className="lil-button" onClick={downloadSigil}>
          <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download
        </button>

        <button className="lil-button" onClick={onReset}>
          <PlusCircleIcon className="icon" />
          Create a new sigil
        </button>
      </div>
    </div>
  );
}
