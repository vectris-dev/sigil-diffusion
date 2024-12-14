import { useEffect, useState } from "react";
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
          {prediction.status === "succeeded" && prediction.output?.length ? (
            <img 
              src={prediction.output[prediction.output.length - 1]} 
              alt="output image" 
              className="w-full h-full aspect-square object-contain rounded-lg" 
            />
          ) : (
            <div className="w-full h-full aspect-square rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-300" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true" 
                fill="currentColor" 
                viewBox="0 0 640 512"
              >
                <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
              </svg>
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
