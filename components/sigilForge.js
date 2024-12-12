'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProcessText } from './useProcessText'
import { AnimatedLetter } from './animatedLetter'

export default function Sigilforge() {
  const [intention, setIntention] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const { processedText, removedIndices } = useProcessText(intention)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedIntention = intention.trim()
    setIntention(trimmedIntention)
    setIsAnimating(true)
    setShowOutput(true)
    setTimeout(() => setIsAnimating(false), trimmedIntention.length * 100 + 1000)
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Enter your intention"
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Prepare
        </button>
      </form>
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-4xl min-h-[100px] flex items-center justify-center text-black"
          >
            {isAnimating ? (
              intention.split('').map((letter, index) => (
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
        )}
      </AnimatePresence>
    </div>
  )
}

