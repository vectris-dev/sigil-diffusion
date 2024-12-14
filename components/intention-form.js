"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProcessText } from "./useProcessText";
import { AnimatedLetter } from "./animated-letter";
import PrimaryButton from "./primary-button";

export default function IntentionForm({ intention, setIntention, onIntentionProcessed }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const { processedText, removedIndices } = useProcessText(intention);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedIntention = intention.trim();
    setIntention(trimmedIntention);
    setIsAnimating(true);
    setShowOutput(true);
    setTimeout(() => {
      onIntentionProcessed(true);
      setIsAnimating(false);
    }, trimmedIntention.length * 100 + 1000);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="text-center text-xl mb-6">Write your intention</div>
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Enter your intention"
          className="w-full px-4 py-2 text-lg rounded-md focus:outline-none focus:ring-2"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <PrimaryButton type="submit">Prepare</PrimaryButton>
      </form>
      <AnimatePresence>
        {showOutput && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-4xl min-h-[100px] flex items-center justify-center">
            {isAnimating ? (
              intention.split("").map((letter, index) => <AnimatedLetter key={index} letter={letter} isRemoved={removedIndices.includes(index)} delay={index * 0.1} />)
            ) : (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {processedText}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
