'use client'

import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import { useSpring } from '@react-spring/web'

interface CobeGlobeProps {
  className?: string
  markers?: { location: [number, number]; size: number }[]
}

export function CobeGlobe({
  className = '',
  markers = [
    { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
    { location: [40.7128, -74.006], size: 0.05 },   // New York
    { location: [51.5074, -0.1278], size: 0.05 },   // London
    { location: [35.6762, 139.6503], size: 0.05 },  // Tokyo
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
    { location: [1.3521, 103.8198], size: 0.05 },   // Singapore
    { location: [48.8566, 2.3522], size: 0.05 },    // Paris
    { location: [55.7558, 37.6173], size: 0.05 },   // Moscow
    { location: [19.4326, -99.1332], size: 0.05 },  // Mexico City
    { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
  ],
}: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const [isDark, setIsDark] = useState(true)

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Spring for smooth physics-based rotation - NO React re-renders!
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))

  useEffect(() => {
    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener('resize', onResize)
    onResize()

    // Destroy previous globe if it exists
    if (globeRef.current) {
      globeRef.current.destroy()
    }

    // Theme-aware colors for better visibility
    const globeConfig = isDark ? {
      // Dark mode - brighter, more visible globe
      dark: 1,
      baseColor: [0.4, 0.4, 0.5] as [number, number, number],      // Lighter base
      markerColor: [0.1, 0.9, 1] as [number, number, number],      // Bright cyan markers
      glowColor: [0.15, 0.2, 0.25] as [number, number, number],    // Subtle blue glow
      mapBrightness: 2.5,
      diffuse: 1.5,
    } : {
      // Light mode - visible on light background
      dark: 0,
      baseColor: [0.95, 0.95, 0.98] as [number, number, number],   // Slight blue tint
      markerColor: [0.1, 0.6, 0.9] as [number, number, number],    // Blue markers
      glowColor: [0.9, 0.92, 0.95] as [number, number, number],    // Soft glow
      mapBrightness: 8,
      diffuse: 2,
    }

    globeRef.current = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: globeConfig.dark,
      diffuse: globeConfig.diffuse,
      mapSamples: 16000,
      mapBrightness: globeConfig.mapBrightness,
      baseColor: globeConfig.baseColor,
      markerColor: globeConfig.markerColor,
      glowColor: globeConfig.glowColor,
      markers,
      onRender: (state) => {
        // Auto-rotate when not interacting
        if (!pointerInteracting.current) {
          phi += 0.005
        }
        // Use spring value directly - no React state!
        state.phi = phi + r.get()
        state.width = width * 2
        state.height = width * 2
      },
    })

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1'
      }
    }, 100)

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy()
      }
      window.removeEventListener('resize', onResize)
    }
  }, [isDark]) // Recreate globe when theme changes

  return (
    <div className={`relative aspect-square w-full max-w-[600px] mx-auto ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500 cursor-grab"
        style={{ contain: 'layout paint size' }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current
          canvasRef.current!.style.cursor = 'grabbing'
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          canvasRef.current!.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
          canvasRef.current!.style.cursor = 'grab'
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            // Spring animation - no re-render!
            api.start({ r: delta / 200 })
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({ r: delta / 100 })
          }
        }}
      />
    </div>
  )
}
