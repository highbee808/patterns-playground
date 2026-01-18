'use client'

import { motion } from 'motion/react'

interface OrbitingCirclesProps {
  children?: React.ReactNode
  className?: string
  radius?: number
  duration?: number
  reverse?: boolean
  delay?: number
  path?: boolean
}

export function OrbitingCircles({
  children,
  className = '',
  radius = 100,
  duration = 20,
  reverse = false,
  delay = 0,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Orbit path */}
      {path && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] opacity-20"
          style={{
            width: radius * 2,
            height: radius * 2,
          }}
        />
      )}

      {/* Orbiting element */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        animate={{
          rotate: reverse ? -360 : 360,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
        style={{
          width: radius * 2,
          height: radius * 2,
          marginLeft: -radius,
          marginTop: -radius,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            rotate: reverse ? 360 : -360,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
            delay,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Container with multiple orbiting elements
interface OrbitingCirclesContainerProps {
  className?: string
  children?: React.ReactNode
  centerContent?: React.ReactNode
}

export function OrbitingCirclesContainer({
  className = '',
  children,
  centerContent,
}: OrbitingCirclesContainerProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Center content */}
      {centerContent && (
        <div className="absolute z-10">{centerContent}</div>
      )}
      {children}
    </div>
  )
}

// Preset icons for demo
export function OrbitingCirclesDemo() {
  const icons = [
    { icon: '⚛️', radius: 80, duration: 15, delay: 0 },
    { icon: '▲', radius: 80, duration: 15, delay: 5 },
    { icon: '📦', radius: 80, duration: 15, delay: 10 },
    { icon: '🎨', radius: 140, duration: 25, delay: 0, reverse: true },
    { icon: '⚡', radius: 140, duration: 25, delay: 8, reverse: true },
    { icon: '🔷', radius: 140, duration: 25, delay: 16, reverse: true },
  ]

  return (
    <OrbitingCirclesContainer
      className="h-[400px] w-full"
      centerContent={
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-xl shadow-lg">
          UI
        </div>
      }
    >
      {icons.map((item, index) => (
        <OrbitingCircles
          key={index}
          radius={item.radius}
          duration={item.duration}
          delay={item.delay}
          reverse={item.reverse}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] shadow-lg text-2xl">
            {item.icon}
          </div>
        </OrbitingCircles>
      ))}
    </OrbitingCirclesContainer>
  )
}
