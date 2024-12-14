import { useState, useEffect } from 'react'

export function useProcessText(text) {
  const [processedText, setProcessedText] = useState('')
  const [removedIndices, setRemovedIndices] = useState([])

  useEffect(() => {

    setProcessedText(newProcessedText.join(''))
    setRemovedIndices(newRemovedIndices)
  }, [text])

  return { processedText, removedIndices }
}

