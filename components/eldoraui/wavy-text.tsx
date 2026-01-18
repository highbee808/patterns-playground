'use client'

import { motion } from 'motion/react'

interface WavyTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  replay?: boolean
}

export function WavyText({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  replay = true,
}: WavyTextProps) {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !replay }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Continuous wave animation
export function WavyTextLoop({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <span className={`inline-flex ${className}`}>
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.05,
            ease: 'easeInOut',
          }}
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  )
}
