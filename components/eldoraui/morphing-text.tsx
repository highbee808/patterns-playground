'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface MorphingTextProps {
  texts: string[]
  className?: string
  duration?: number
}

export function MorphingText({
  texts,
  className = '',
  duration = 3000,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, duration)

    return () => clearInterval(interval)
  }, [texts.length, duration])

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// Alternative: Character-by-character morphing
export function MorphingTextAdvanced({
  texts,
  className = '',
  duration = 3000,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, duration)

    return () => clearInterval(interval)
  }, [texts.length, duration])

  const currentText = texts[index]

  return (
    <div className={`relative inline-flex ${className}`}>
      <AnimatePresence mode="popLayout">
        {currentText.split('').map((char, i) => (
          <motion.span
            key={`${index}-${i}`}
            initial={{ opacity: 0, y: 10, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, rotateX: -90 }}
            transition={{
              duration: 0.3,
              delay: i * 0.03,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
