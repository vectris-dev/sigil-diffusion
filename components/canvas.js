import * as React from "react";
import { useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import PrimaryButton from "./primary-button";
import { Undo as UndoIcon, Trash as TrashIcon } from "lucide-react";

export default function Canvas({ onDrawing, onSubmit }) {
  const canvasRef = React.useRef(null);
  const [drawingExists, setDrawingExists] = useState(false);

  useEffect(() => {
    // Hack to work around Firfox bug in react-sketch-canvas
    // https://github.com/vinothpandian/react-sketch-canvas/issues/54
    document.querySelector("#react-sketch-canvas__stroke-group-0")?.removeAttribute("mask");

    // loadStartingPaths();
  }, []);

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
    onDrawing(data);
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

      <PrimaryButton disabled={!drawingExists} onClick={onSubmit}>
        Charge
      </PrimaryButton>
    </div>
  );
}
