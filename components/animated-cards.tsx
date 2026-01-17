'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'

interface Testimonial {
  quote: string
  name: string
  role: string
}

interface AnimatedCardsProps {
  items: Testimonial[]
  direction?: 'left' | 'right'
  speed?: 'slow' | 'normal' | 'fast'
  pauseOnHover?: boolean
  className?: string
}

export function AnimatedCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = '',
}: AnimatedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const speedMap = {
    slow: 35,
    normal: 25,
    fast: 15,
  }

  // Duplicate items immediately (no useEffect needed)
  const duplicatedItems = [...items, ...items]

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 5%, white 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, white 5%, white 95%, transparent)',
      }}
    >
      <motion.div
        className="flex gap-5"
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        animate={{
          x: direction === 'left' ? '-50%' : '0%',
        }}
        transition={{
          x: {
            duration: speedMap[speed],
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          },
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-[380px] p-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-colors duration-300"
            whileHover={pauseOnHover ? { scale: 1.02 } : undefined}
          >
            <p className="text-base text-slate-300 mb-5 leading-relaxed">"{item.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
