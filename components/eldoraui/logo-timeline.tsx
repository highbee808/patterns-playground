'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiFramer,
  SiVercel,
  SiGithub,
  SiDiscord,
  SiFigma,
  SiNotion,
  SiSlack,
  SiLinear,
  SiStripe,
  SiPrisma,
  SiSupabase,
  SiNodedotjs,
} from '@icons-pack/react-simple-icons'
import type { IconType } from '@icons-pack/react-simple-icons'

// Icon mapping - using react-simple-icons for brand logos
const Icons: Record<string, IconType> = {
  react: SiReact,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  nextjs: SiNextdotjs,
  framer: SiFramer,
  vercel: SiVercel,
  github: SiGithub,
  discord: SiDiscord,
  figma: SiFigma,
  notion: SiNotion,
  slack: SiSlack,
  linear: SiLinear,
  stripe: SiStripe,
  prisma: SiPrisma,
  supabase: SiSupabase,
  nodejs: SiNodedotjs,
}

export interface LogoItem {
  label: string
  icon: keyof typeof Icons
  animationDelay: number
  animationDuration: number
  row: number
}

export interface LogoTimelineProps {
  items: LogoItem[]
  title?: string
  height?: string
  className?: string
  iconSize?: number
  showRowSeparator?: boolean
  animateOnHover?: boolean
}

export function LogoTimeline({
  items,
  title,
  height = 'h-[400px] sm:h-[600px]',
  className = '',
  iconSize = 16,
  showRowSeparator = true,
  animateOnHover = false,
}: LogoTimelineProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Group items by row
  const rowsMap = new Map<number, LogoItem[]>()
  items.forEach((item) => {
    if (!rowsMap.has(item.row)) {
      rowsMap.set(item.row, [])
    }
    rowsMap.get(item.row)?.push(item)
  })

  // Convert map to sorted array
  const rows = Array.from(rowsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, rowItems]) => rowItems)

  // Determine animation play state
  const animationPlayState = animateOnHover
    ? isHovered
      ? 'running'
      : 'paused'
    : 'running'

  const getIconComponent = (iconName: keyof typeof Icons) => {
    const Icon = Icons[iconName]
    if (!Icon) return null
    return (
      <Icon
        className="shrink-0"
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      />
    )
  }

  return (
    <section className={`w-full ${height} ${className}`}>
      <motion.div
        aria-hidden="true"
        className="relative h-full w-full overflow-hidden py-24 sm:py-32 bg-[var(--bg-primary)] rounded-2xl"
        onMouseEnter={() => animateOnHover && setIsHovered(true)}
        onMouseLeave={() => animateOnHover && setIsHovered(false)}
      >
        {title && (
          <div className="absolute top-1/2 left-1/2 mx-auto w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="relative z-10">
              <p className="mx-auto mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl text-[var(--text-primary)]/10">
                {title}
              </p>
            </div>
          </div>
        )}
        <div
          className="[container-type:inline-size] absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
        >
          {rows.map((rowItems, index) => (
            <div className="group relative flex items-center" key={index}>
              {/* Row center line */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-[var(--text-primary)]/15 from-[2px] to-[2px] bg-[length:12px_100%]" />
              {/* Row separator */}
              {showRowSeparator && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[var(--text-primary)]/5 from-[2px] to-[2px] bg-[length:12px_100%] group-last:hidden" />
              )}
              {rowItems.map((logo) => {
                const IconComponent = getIconComponent(logo.icon)
                if (!IconComponent) return null
                return (
                  <div
                    key={`${logo.row}-${logo.label}`}
                    className="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 px-3 py-1.5 whitespace-nowrap rounded-full bg-gradient-to-t from-[var(--bg-secondary)]/80 to-[var(--bg-card)]/80 ring-1 ring-inset ring-[var(--border)] backdrop-blur-sm shadow-sm logo-timeline-item"
                    style={{
                      animationDelay: `${logo.animationDelay}s`,
                      animationDuration: `${logo.animationDuration}s`,
                      animationPlayState: animationPlayState,
                    }}
                  >
                    {IconComponent}
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {logo.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// Pre-configured demo with sample logos
export function LogoTimelineDemo() {
  const items: LogoItem[] = [
    // Row 1
    { label: 'React', icon: 'react', animationDelay: -25, animationDuration: 40, row: 1 },
    { label: 'Next.js', icon: 'nextjs', animationDelay: -10, animationDuration: 40, row: 1 },
    { label: 'TypeScript', icon: 'typescript', animationDelay: -5, animationDuration: 40, row: 1 },

    // Row 2
    { label: 'Tailwind', icon: 'tailwind', animationDelay: -18, animationDuration: 45, row: 2 },
    { label: 'Framer Motion', icon: 'framer', animationDelay: -8, animationDuration: 45, row: 2 },
    { label: 'Vercel', icon: 'vercel', animationDelay: -30, animationDuration: 45, row: 2 },

    // Row 3
    { label: 'GitHub', icon: 'github', animationDelay: -12, animationDuration: 50, row: 3 },
    { label: 'Figma', icon: 'figma', animationDelay: -22, animationDuration: 50, row: 3 },
    { label: 'Discord', icon: 'discord', animationDelay: -35, animationDuration: 50, row: 3 },

    // Row 4
    { label: 'Prisma', icon: 'prisma', animationDelay: -15, animationDuration: 55, row: 4 },
    { label: 'Supabase', icon: 'supabase', animationDelay: -28, animationDuration: 55, row: 4 },
    { label: 'Stripe', icon: 'stripe', animationDelay: -5, animationDuration: 55, row: 4 },
  ]

  return (
    <LogoTimeline
      items={items}
      title="Tech Stack"
      iconSize={18}
      showRowSeparator={true}
    />
  )
}
