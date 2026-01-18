'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Check if we're on a touch device - use native scroll on mobile
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches

    const lenis = new Lenis({
      duration: 1.5, // Slower = smoother
      easing: (t) => 1 - Math.pow(1 - t, 3), // Simpler cubic ease (less CPU)
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5, // Less aggressive than 2
      syncTouch: false, // Disable touch sync - let native handle it
      syncTouchLerp: 0.1, // Slower interpolation if syncTouch is ever enabled
      wheelMultiplier: isTouchDevice ? 0 : 1, // Disable on touch devices
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
