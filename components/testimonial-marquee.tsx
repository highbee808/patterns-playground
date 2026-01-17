'use client'

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
    <div className="testimonial-card flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
      {/* Star Rating */}
      <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            style={{ fill: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-3 sm:mb-4 line-clamp-3">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom right, var(--accent-cyan), var(--accent-purple))' }}
        >
          {author.split(' ').slice(0, 2).map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--text-primary)] text-xs sm:text-sm truncate">{author}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TESTIMONIAL MARQUEE
// Pure CSS infinite scroll - maximum GPU optimization
// ============================================
export function TestimonialMarquee({
  items,
  direction = 'left',
  className = '',
}: TestimonialMarqueeProps) {
  // Duplicate items for seamless loop
  const duplicated = [...items, ...items]

  return (
    <div
      className={`testimonial-marquee-container overflow-hidden ${className}`}
    >
      <div
        className={`testimonial-marquee flex gap-3 sm:gap-4 gpu-accelerate ${
          direction === 'left' ? 'testimonial-marquee-left' : 'testimonial-marquee-right'
        }`}
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
