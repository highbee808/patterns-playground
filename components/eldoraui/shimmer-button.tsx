'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  onClick?: () => void
}

export function ShimmerButton({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.2)',
  shimmerSize = '0.1em',
  borderRadius = '9999px',
  shimmerDuration = '2s',
  background = 'linear-gradient(110deg, #0ea5e9, #8b5cf6)',
  onClick,
}: ShimmerButtonProps) {
  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center overflow-hidden
        px-6 py-3 font-medium text-white
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        ${className}
      `}
      style={{
        borderRadius,
        background,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Shimmer effect */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <span
          className="absolute inset-0 -translate-x-full animate-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            animationDuration: shimmerDuration,
          }}
        />
      </span>

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Variant: Shimmer border button
export function ShimmerBorderButton({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        px-6 py-3 font-medium
        bg-[var(--bg-card)] text-[var(--text-primary)]
        rounded-full overflow-hidden
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Animated border */}
      <span className="absolute inset-0 rounded-full">
        <span
          className="absolute inset-[-2px] rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9)',
          }}
        />
        <span className="absolute inset-[2px] rounded-full bg-[var(--bg-card)]" />
      </span>

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Variant: Pulse glow button
export function PulseGlowButton({
  children,
  className = '',
  glowColor = 'rgba(14, 165, 233, 0.5)',
  onClick,
}: {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        px-6 py-3 font-medium text-white
        bg-gradient-to-r from-cyan-500 to-purple-600
        rounded-full overflow-hidden
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Pulse glow */}
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 20px 0px ${glowColor}`,
            `0 0 40px 10px ${glowColor}`,
            `0 0 20px 0px ${glowColor}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
