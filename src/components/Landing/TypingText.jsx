import { useState, useEffect } from 'react'

const TypingText = ({ text, speed = 120, highlightWords = [], start = true }) => {
  const [revealedCount, setRevealedCount] = useState(0)
  const isTypingComplete = revealedCount >= text.length

  useEffect(() => {
    if (!start) {
      setRevealedCount(0)
      return
    }
    if (revealedCount < text.length) {
      const timeout = setTimeout(() => {
        setRevealedCount(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [revealedCount, text.length, speed, start])

  // Check if character is part of a highlighted word
  const isHighlighted = (index) => {
    return highlightWords.some(word => {
      const wordIndex = text.indexOf(word)
      return index >= wordIndex && index < wordIndex + word.length
    })
  }

  return (
    <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'keep-all' }}>
      {text.split('').map((char, index) => {
        const isRevealed = index < revealedCount
        const highlighted = isHighlighted(index)
        
        return (
          <span
            key={index}
            className={`transition-all duration-700 ${highlighted && isRevealed ? 'font-semibold text-blue-400' : ''}`}
            style={{
              display: 'inline',
              opacity: isRevealed ? 1 : 0.1,
              color: 'inherit'
            }}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}

export default TypingText
