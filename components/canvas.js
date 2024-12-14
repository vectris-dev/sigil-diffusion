import * as React from "react";
import { useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import PrimaryButton from "./primary-button";
import { Undo as UndoIcon, Trash as TrashIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedLetter } from "./animated-letter";

export default function Canvas({ intention, setProcessedIntention, setDrawing, onSubmit }) {
  const canvasRef = React.useRef(null);
  const [drawingExists, setDrawingExists] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [processedText, setProcessedText] = useState("");
  const [removedIndices, setRemovedIndices] = useState([]);

  useEffect(() => {
    // Process the intention text
    const processText = () => {
      const text = intention.toUpperCase();
      const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
      const seen = new Set();
      const removed = [];
      
      const processed = text.split('').filter((char, index) => {
        if (vowels.has(char) || seen.has(char)) {
          removed.push(index);
          return false;
        }
        seen.add(char);
        return true;
      }).join('');

      setProcessedText(processed);
      setProcessedIntention(processed);
      setRemovedIndices(removed);
    };

    // Animation sequence
    const animationSequence = async () => {
      // Show initial intention
      setIsAnimating(true);
      
      // Wait before starting removal animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process text and animate removals
      processText();
      
      // Wait for removal animation to complete
      await new Promise(resolve => setTimeout(resolve, intention.length * 100 + 500));
      
      setIsAnimating(false);
      
      // Wait before showing canvas
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowCanvas(true);
    };

    animationSequence();

    // Firefox bug fix
    document.querySelector("#react-sketch-canvas__stroke-group-0")?.removeAttribute("mask");
  }, [intention, setProcessedIntention]);

  async function loadStartingPaths() {
    await canvasRef.current.loadPaths(startingPaths);
    setDrawingExists(true);
    onChange();
  }

  const onChange = async () => {
    const paths = await canvasRef.current.exportPaths();
    localStorage.setItem("paths", JSON.stringify(paths, null, 2));

    if (!paths.length) return;

    setDrawingExists(true);

    const data = await canvasRef.current.exportImage("png");
    setDrawing(data);
  };

  const undo = () => {
    canvasRef.current.undo();
  };

  const reset = () => {
    setDrawingExists(false);
    canvasRef.current.resetCanvas();
  };

  // const exportPaths = async () => {
  //   const paths = await canvasRef.current.exportPaths();
  //   console.log(JSON.stringify(paths, null, 2));
  // };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 1, y: showCanvas ? -20 : 0 }}
        className="text-4xl min-h-[100px] flex items-center justify-center"
      >
        {isAnimating ? (
          intention.split("").map((letter, index) => (
            <AnimatedLetter
              key={index}
              letter={letter}
              isRemoved={removedIndices.includes(index)}
              delay={index * 0.1}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {processedText}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showCanvas && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <div className="relative">
              {drawingExists || (
                <div>
                  <div className="absolute grid w-full h-full p-3 place-items-center pointer-events-none text-xl">
                    <span className="opacity-40 text-background-dark">Now, draw your sigil using the letters above</span>
                  </div>
                </div>
              )}

              <ReactSketchCanvas ref={canvasRef} className="w-full aspect-square border-none cursor-crosshair" strokeWidth={4} strokeColor="black" onChange={onChange} withTimestamp={true} />

              {drawingExists && (
                <div className="animate-in fade-in duration-700 text-left">
                  <button className="lil-button" onClick={undo}>
                    <UndoIcon className="icon" />
                    Undo
                  </button>
                  <button className="lil-button" onClick={reset}>
                    <TrashIcon className="icon" />
                    Clear
                  </button>
                  {/* <button className="lil-button" onClick={exportPaths}>
                    Export
                  </button> */}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCanvas && (
        <PrimaryButton disabled={!drawingExists} onClick={onSubmit}>
          Charge
        </PrimaryButton>
      )}
    </div>
  );
}
