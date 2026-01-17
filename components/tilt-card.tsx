'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glareEnabled?: boolean
  tiltAmount?: number
  perspective?: number
  scale?: number
}

export function TiltCard({
  children,
  className = '',
  glareEnabled = true,
  tiltAmount = 15,
  perspective = 1000,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for smooth animation
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring config for smooth movement
  const springConfig = { stiffness: 300, damping: 30 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Transform rotation based on mouse position
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  // Glare position
  const glareX = useTransform(xSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(ySpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = (e.clientX - centerX) / rect.width
    const mouseY = (e.clientY - centerY) / rect.height
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ scale: isHovered ? scale : 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-full"
      >
        {/* Card content */}
        {children}

        {/* Glare effect */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
            style={{ opacity: isHovered ? 0.15 : 0 }}
          >
            <motion.div
              className="absolute w-[200%] h-[200%] bg-gradient-radial from-white via-white/50 to-transparent"
              style={{
                left: glareX,
                top: glareY,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// PARALLAX LAYERS INSIDE CARD
// ============================================
interface ParallaxCardProps {
  children?: React.ReactNode
  className?: string
  backgroundContent?: React.ReactNode
  foregroundContent?: React.ReactNode
  midContent?: React.ReactNode
}

export function ParallaxCard({
  className = '',
  backgroundContent,
  midContent,
  foregroundContent,
}: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 400, damping: 30 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Different parallax depths
  const bgX = useTransform(xSpring, [-0.5, 0.5], ['-3%', '3%'])
  const bgY = useTransform(ySpring, [-0.5, 0.5], ['-3%', '3%'])

  const midX = useTransform(xSpring, [-0.5, 0.5], ['-6%', '6%'])
  const midY = useTransform(ySpring, [-0.5, 0.5], ['-6%', '6%'])

  const fgX = useTransform(xSpring, [-0.5, 0.5], ['-12%', '12%'])
  const fgY = useTransform(ySpring, [-0.5, 0.5], ['-12%', '12%'])

  // 3D rotation
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background layer - moves least */}
        <motion.div
          className="absolute inset-0"
          style={{ x: bgX, y: bgY, z: -20 }}
        >
          {backgroundContent}
        </motion.div>

        {/* Middle layer */}
        <motion.div
          className="absolute inset-0"
          style={{ x: midX, y: midY, z: 0 }}
        >
          {midContent}
        </motion.div>

        {/* Foreground layer - moves most */}
        <motion.div
          className="relative"
          style={{ x: fgX, y: fgY, z: 20 }}
        >
          {foregroundContent}
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50}% ${50}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

// ============================================
// SPOTLIGHT CARD - Light follows cursor
// ============================================
interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor,
}: SpotlightCardProps) {
  // Use CSS variable for default spotlight color
  const defaultSpotlight = 'var(--accent-cyan-light)'
  const finalSpotlightColor = spotlightColor || defaultSpotlight
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${finalSpotlightColor}, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, var(--border-accent), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
