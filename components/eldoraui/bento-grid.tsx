'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  gradient?: string
}

export function BentoCard({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  gradient,
}: BentoCardProps) {
  const colSpanClass = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }

  const rowSpanClass = {
    1: 'md:row-span-1',
    2: 'md:row-span-2',
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-[var(--bg-card)] border border-[var(--border)]
        ${colSpanClass[colSpan]} ${rowSpanClass[rowSpan]}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {gradient && (
        <div
          className={`absolute inset-0 opacity-20 ${gradient}`}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Feature card variant for bento grid
interface BentoFeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  gradient?: string
}

export function BentoFeatureCard({
  icon,
  title,
  description,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  gradient = 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20',
}: BentoFeatureCardProps) {
  return (
    <BentoCard
      colSpan={colSpan}
      rowSpan={rowSpan}
      gradient={gradient}
      className={className}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-3xl">{icon}</div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </BentoCard>
  )
}

// Demo grid
export function BentoGridDemo() {
  return (
    <BentoGrid>
      <BentoFeatureCard
        icon="🚀"
        title="Lightning Fast"
        description="Built for performance with optimized rendering"
        colSpan={2}
        gradient="bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
      />
      <BentoFeatureCard
        icon="🎨"
        title="Beautiful Design"
        description="Pixel-perfect components"
        gradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
      />
      <BentoFeatureCard
        icon="⚡"
        title="Real-time Updates"
        description="Live data synchronization"
        gradient="bg-gradient-to-br from-orange-500/20 to-red-500/20"
      />
      <BentoFeatureCard
        icon="🔒"
        title="Secure by Default"
        description="Enterprise-grade security with end-to-end encryption"
        colSpan={2}
        gradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
      />
    </BentoGrid>
  )
}
