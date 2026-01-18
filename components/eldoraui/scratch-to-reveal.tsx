'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'

interface ScratchToRevealProps {
  children: React.ReactNode
  width?: number
  height?: number
  minScratchPercentage?: number
  className?: string
  gradientColors?: [string, string]
  onComplete?: () => void
}

export function ScratchToReveal({
  children,
  width = 300,
  height = 200,
  minScratchPercentage = 50,
  className = '',
  gradientColors = ['#6366f1', '#8b5cf6'],
  onComplete,
}: ScratchToRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  // Initialize canvas with gradient
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(1, gradientColors[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add some texture/pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 3 + 1
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add text hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = 'bold 16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Scratch to reveal', width / 2, height / 2)
  }, [width, height, gradientColors])

  // Calculate scratch percentage
  const getScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext('2d')
    if (!ctx) return 0

    const imageData = ctx.getImageData(0, 0, width, height)
    const pixels = imageData.data
    let transparentPixels = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++
    }

    return (transparentPixels / (width * height)) * 100
  }, [width, height])

  // Scratch function
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 25, 0, Math.PI * 2)
    ctx.fill()

    // Draw line from last point for smooth scratching
    if (lastPoint.current) {
      ctx.lineWidth = 50
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    lastPoint.current = { x, y }

    // Check completion
    const percentage = getScratchPercentage()
    if (percentage >= minScratchPercentage && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [getScratchPercentage, minScratchPercentage, isComplete, onComplete])

  // Event handlers
  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsScratching(true)
    const pos = getPosition(e)
    scratch(pos.x, pos.y)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return
    const pos = getPosition(e)
    scratch(pos.x, pos.y)
  }

  const handleEnd = () => {
    setIsScratching(false)
    lastPoint.current = null
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ width, height }}
    >
      {/* Hidden content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Scratch canvas */}
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-pointer touch-none"
        style={{ opacity: isComplete ? 0 : 1 }}
        animate={{ opacity: isComplete ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Celebration effect */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
        </motion.div>
      )}
    </div>
  )
}
