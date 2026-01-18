'use client'

import { useRef, useEffect, useState } from 'react'
import { Star } from 'lucide-react'

// ============================================
// TYPES
// ============================================
export interface Testimonial {
  quote: string
  author: string
  role: string
}

export interface TestimonialMarqueeProps {
  items: Testimonial[]
  direction?: 'left' | 'right'
  className?: string
}

export interface MiniTestimonialCardProps {
  quote: string
  author: string
  role: string
}

// ============================================
// MINI TESTIMONIAL CARD
// Ultra-optimized for smooth marquee - themed colors
// ============================================
export function MiniTestimonialCard({
  quote,
  author,
  role,
}: MiniTestimonialCardProps) {
  return (
    <div className="testimonial-card flex-shrink-0 w-[280px] sm:w-[300px] p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
      {/* Star Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5"
            style={{ fill: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
          style={{ background: 'linear-gradient(to bottom right, var(--accent-cyan), var(--accent-purple))' }}
        >
          {author.split(' ').slice(0, 2).map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)] text-sm">{author}</p>
          <p className="text-xs text-[var(--text-muted)]">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TESTIMONIAL MARQUEE
// Pure CSS infinite scroll - maximum GPU optimization
// Pauses when off-screen for performance
// ============================================
export function TestimonialMarquee({
  items,
  direction = 'left',
  className = '',
}: TestimonialMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '100px' } // Start animating slightly before visible
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Duplicate items for seamless loop
  const duplicated = [...items, ...items]

  return (
    <div
      ref={containerRef}
      className={`testimonial-marquee-container overflow-hidden ${className}`}
    >
      <div
        className={`testimonial-marquee flex gap-4 ${
          direction === 'left' ? 'testimonial-marquee-left' : 'testimonial-marquee-right'
        }`}
        style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      >
        {duplicated.map((item, idx) => (
          <MiniTestimonialCard
            key={idx}
            quote={item.quote}
            author={item.author}
            role={item.role}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// TESTIMONIAL MARQUEE CONTAINER
// Two-row container with opposite scroll directions
// ============================================
export function TestimonialMarqueeContainer({
  row1,
  row2,
  className = '',
}: {
  row1: Testimonial[]
  row2: Testimonial[]
  className?: string
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <TestimonialMarquee items={row1} direction="left" />
      <TestimonialMarquee items={row2} direction="right" />
    </div>
  )
}
