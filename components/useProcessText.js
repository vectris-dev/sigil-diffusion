import { useState, useEffect } from 'react'

export function useProcessText(text) {
  const [processedText, setProcessedText] = useState('')
  const [removedIndices, setRemovedIndices] = useState([])

  useEffect(() => {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u'])
    const seen = new Set()
    const newProcessedText = []
    const newRemovedIndices = []

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase()
      if (char !== ' ') {  // Skip spaces
        if (!vowels.has(char) && !seen.has(char)) {
          newProcessedText.push(char)  // Always use lowercase
          seen.add(char)
        } else {
          newRemovedIndices.push(i)
        }
      } else {
        newRemovedIndices.push(i)  // Mark spaces for removal
      }
    }

    setProcessedText(newProcessedText.join(''))
    setRemovedIndices(newRemovedIndices)
  }, [text])

  return { processedText, removedIndices }
}

