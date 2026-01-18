'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'motion/react'
import { Sparkles, Zap, ArrowRight, Code2, Palette, MousePointer2, Github, ExternalLink, Check, Crown, ChevronDown, Star, Calendar, MessageSquare, FileText, User, Mail, Phone, Shield } from 'lucide-react'
import Link from 'next/link'
import { SmoothScrollProvider } from '@/components/smooth-scroll'
import { AnimatedCards } from '@/components/animated-cards'
import { SpotlightCard, TiltCard } from '@/components/tilt-card'
import { TestimonialMarquee } from '@/components/testimonial-marquee'
import { ThemeToggle } from '@/components/theme-toggle'

// Eldora UI Components
import { CobeGlobe } from '@/components/eldoraui/cobe-globe'
import { MorphingText } from '@/components/eldoraui/morphing-text'
import { ShimmerButton } from '@/components/eldoraui/shimmer-button'

// ============================================
// PARALLAX WRAPPER
// ============================================
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

// ============================================
// CUSTOM CURSOR - Premium feel (RAF throttled)
// ============================================
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  // Refs for RAF throttling
  const rafRef = useRef<number | null>(null)
  const posRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const move = (e: MouseEvent) => {
      // Store position in ref (no re-render)
      posRef.current = { x: e.clientX, y: e.clientY }

      // Only update state once per animation frame (throttle to ~60fps max)
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPos(posRef.current)
          setVisible(true)
          rafRef.current = null
        })
      }
    }

    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    // Detect hoverable elements
    const setupHovers = () => {
      const hovers = document.querySelectorAll('button, a, [data-hover]')
      hovers.forEach(el => {
        el.addEventListener('mouseenter', () => setHovering(true))
        el.addEventListener('mouseleave', () => setHovering(false))
      })
    }

    setupHovers()
    // Re-setup on DOM changes
    const observer = new MutationObserver(setupHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      observer.disconnect()
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <motion.div
      className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ backgroundColor: 'var(--accent-cyan)' }}
      animate={{
        x: pos.x - 8,
        y: pos.y - 8,
        scale: hovering ? 2.5 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  )
}

// ============================================
// ANIMATED SECTION - Fade up on scroll
// ============================================
function AnimatedSection({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px', amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGERED CHILDREN
// ============================================
function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px', amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    }
  },
}

// ============================================
// VISIBILITY HOOK - For pausing off-screen animations
// ============================================
function useIsVisible(rootMargin = '100px') {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, isVisible }
}

// ============================================
// COUNT UP HOOK
// ============================================
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return
    hasStarted.current = true

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration, isInView])

  return { count, ref }
}

// ============================================
// SCROLL PROGRESS
// ============================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  )
}

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({
  children,
  className = '',
  onClick
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.15
    const y = (clientY - top - height / 2) * 0.15
    setPosition({ x, y })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// HERO
// ============================================
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const words = "Framer-Quality Sites In Pure Code".split(' ')

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs - Pure CSS animations (no Framer Motion) */}
      <div className="absolute inset-0 overflow-hidden contain-paint">
        <div
          className="hero-orb hero-orb-1 absolute top-[15%] left-[10%] w-[250px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[400px] md:h-[600px] bg-cyan-500/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]"
        />
        <div
          className="hero-orb hero-orb-2 absolute bottom-[15%] right-[10%] w-[200px] sm:w-[350px] md:w-[500px] h-[200px] sm:h-[350px] md:h-[500px] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]"
        />
        <div
          className="hero-orb hero-orb-3 absolute top-[40%] left-[40%] w-[150px] sm:w-[280px] md:w-[400px] h-[150px] sm:h-[280px] md:h-[400px] bg-pink-500/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
        />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating tech badges */}
      <motion.div
        className="absolute top-[20%] left-[8%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-sm"
        animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="text-sm text-[var(--text-secondary)]">React 19</span>
      </motion.div>
      <motion.div
        className="absolute top-[35%] right-[5%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-sm"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-sm text-[var(--text-secondary)]">TypeScript</span>
      </motion.div>
      <motion.div
        className="absolute bottom-[30%] left-[5%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-sm"
        animate={{ y: [0, 12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <span className="w-2 h-2 rounded-full bg-purple-400" />
        <span className="text-sm text-[var(--text-secondary)]">Framer Motion</span>
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] right-[12%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-sm"
        animate={{ y: [0, -18, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-sm text-[var(--text-secondary)]">Tailwind v4</span>
      </motion.div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
          <span className="text-sm text-[var(--text-primary)] font-medium">Framer-Quality Animations</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.08,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              className={`inline-block mr-[0.2em] sm:mr-[0.25em] ${
                word === 'Stunning'
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14 leading-relaxed font-light px-2"
        >
          Same premium animations. Full source code ownership.
          <span className="text-[var(--text-primary)]"> No platform lock-in.</span>
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[var(--text-inverted)] font-semibold text-base sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow touch-target">
            <span className="whitespace-nowrap">Let's Work Together</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <MagneticButton className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-white/15 text-[var(--text-primary)] font-semibold text-base sm:text-lg hover:bg-[var(--bg-card)] hover:border-[var(--border-hover)] transition-all inline-flex items-center gap-2 sm:gap-3 touch-target">
            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">See More Work</span>
          </MagneticButton>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          {[
            { name: 'Next.js 16', color: 'bg-white/80' },
            { name: 'Framer Motion', color: 'bg-purple-400' },
            { name: 'Tailwind', color: 'bg-cyan-400' },
            { name: 'Lenis', color: 'bg-green-400' },
          ].map((tech) => (
            <span
              key={tech.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-[var(--border)] text-[var(--text-secondary)]"
            >
              <span className={`w-2 h-2 rounded-full ${tech.color}`} />
              {tech.name}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-7 h-11 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// LOGO MARQUEE - Pure CSS for smooth animation
// ============================================
function LogoMarquee() {
  const logos = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'Discord', 'GitHub']
  const { ref, isVisible } = useIsVisible()

  return (
    <section ref={ref} className="py-20 border-y border-[var(--border)] overflow-hidden">
      <AnimatedSection>
        <p className="text-center text-xs text-[var(--text-muted)] uppercase tracking-[0.25em] mb-12 font-medium">
          Built for modern teams
        </p>
      </AnimatedSection>

      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
        }}
      >
        {/* Pure CSS animation - runs on compositor thread for 60fps */}
        <div
          className={`flex gap-16 whitespace-nowrap logo-marquee-left ${!isVisible ? 'marquee-paused' : ''}`}
        >
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="text-3xl font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300 cursor-default select-none"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// STATS
// ============================================
function Stats() {
  const stats = [
    { value: 150, suffix: '+', label: 'Components' },
    { value: 50, suffix: 'K', label: 'Downloads' },
    { value: 99, suffix: '%', label: 'Satisfaction' },
    { value: 49, suffix: '', label: 'Rating', display: '4.9' },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Trusted by Developers
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Battle-tested components powering thousands of projects
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const { count, ref } = useCountUp(stat.value)
            return (
              <motion.div
                key={i}
                variants={staggerChild}
                className="text-center py-10 px-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border)] transition-colors"
              >
                <div className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 tabular-nums">
                  <span ref={ref}>{stat.display || count}</span>
                  <span className="text-[var(--accent-cyan)]">{stat.suffix}</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ============================================
// FEATURES
// ============================================
function Features() {
  const features = [
    {
      icon: Zap,
      title: '60fps Animations',
      description: 'GPU-accelerated with will-change and transform3d. Buttery smooth on all devices.',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Code2,
      title: 'Copy & Paste',
      description: 'No complex setup. Copy the code, paste it in your project, customize to your needs.',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      icon: Palette,
      title: 'Fully Customizable',
      description: 'Built with Tailwind CSS. Every color, size, and timing curve is yours to control.',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      icon: MousePointer2,
      title: 'Micro-interactions',
      description: 'Hover states, scroll triggers, magnetic buttons, and smooth page transitions.',
      gradient: 'from-green-400 to-emerald-500',
    },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[var(--bg-secondary)]/50">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Why This Stack
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]">
            Built for Production
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.15}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] } }}
              className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-5 sm:mb-6 md:mb-8`}>
                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-[var(--bg-card-hover)] transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[var(--text-primary)]" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-2 sm:mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base md:text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ============================================
// PREMIUM CARDS SHOWCASE
// ============================================
function PremiumCards() {
  const showcaseItems = [
    {
      title: 'Spotlight Effect',
      description: 'Light follows your cursor creating depth and focus. Perfect for feature highlights.',
      icon: '✨',
      gradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      title: '3D Tilt Motion',
      description: 'Perspective transforms with smooth spring physics. Makes any card feel premium.',
      icon: '🎯',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      title: 'Parallax Layers',
      description: 'Multiple depth layers moving at different speeds. Creates that Apple-like depth.',
      icon: '🔮',
      gradient: 'from-orange-500/20 to-red-500/20',
    },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[var(--bg-secondary)]/50">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Premium Effects
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Cards With Motion
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            Hover over each card to experience the internal motion effects
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
          {showcaseItems.map((item, i) => (
            <motion.div key={i} variants={staggerChild}>
              <SpotlightCard
                className="h-full rounded-3xl bg-[var(--bg-card)] border border-[var(--border)]"
                spotlightColor={i === 0 ? 'rgba(34, 211, 238, 0.15)' : i === 1 ? 'rgba(168, 85, 247, 0.15)' : 'rgba(249, 115, 22, 0.15)'}
              >
                <TiltCard className="h-full" tiltAmount={10} scale={1.0}>
                  <div className="p-5 sm:p-6 md:p-8 h-full flex flex-col">
                    {/* Floating icon with parallax feel */}
                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 md:mb-6`}
                      whileHover={{
                        y: -5,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {item.icon}
                    </motion.div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed flex-grow">
                      {item.description}
                    </p>

                    {/* Animated line */}
                    <motion.div
                      className="mt-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </TiltCard>
              </SpotlightCard>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Interactive demo hint */}
        <motion.p
          className="text-center text-[var(--text-muted)] text-sm mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          👆 Move your cursor over the cards to see the magic
        </motion.p>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS WITH ANIMATED CARDS
// ============================================
// Full-width testimonial marquee (edge-to-edge)
function TestimonialsFullWidth() {
  const testimonialsRow1 = [
    { quote: "These components saved me weeks of work. The animations are incredibly polished and the code is clean.", author: "Sarah Chen", role: "Frontend Lead @ Vercel" },
    { quote: "Finally, Framer-quality animations without the platform lock-in. This is exactly what I needed.", author: "Marcus Johnson", role: "Indie Hacker" },
    { quote: "My clients are blown away by the results. The attention to detail is incredible.", author: "Emily Rodriguez", role: "Freelance Designer" },
    { quote: "The magnetic buttons alone are worth it. Such a small detail that makes everything feel premium.", author: "James Wilson", role: "Product Designer @ Linear" },
  ]

  const testimonialsRow2 = [
    { quote: "Copy, paste, ship. It's that simple. These components are now in every project I build.", author: "David Kim", role: "Startup Founder" },
    { quote: "The TypeScript support is excellent. Finally, a component library that respects developer experience.", author: "Alex Thompson", role: "Senior Engineer @ Stripe" },
    { quote: "Lenis + Framer Motion is the secret sauce. This stack just feels different.", author: "Nina Patel", role: "Creative Developer" },
    { quote: "I've tried every animation library. This is the one that actually delivers on the Framer promise.", author: "Chris Anderson", role: "Tech Lead @ Notion" },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <AnimatedSection className="text-center">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Full-Width Marquee
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
            Edge-to-Edge Testimonials
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            No container boundaries - cards flow seamlessly across the viewport
          </p>
        </AnimatedSection>
      </div>

      {/* Full width - no container */}
      <div className="space-y-5">
        <TestimonialMarquee items={testimonialsRow1} direction="left" />
        <TestimonialMarquee items={testimonialsRow2} direction="right" />
      </div>
    </section>
  )
}

// Contained testimonial marquee (with SpotlightCard)
function TestimonialsContained() {
  const testimonialsRow1 = [
    { quote: "The scroll animations are buttery smooth. Finally someone who understands performance.", author: "Mike Peters", role: "CTO @ Startup" },
    { quote: "Hired them for our rebrand. The attention to micro-interactions was next level.", author: "Lisa Wang", role: "Design Director" },
    { quote: "Our conversion rate jumped 40% after the redesign. Worth every penny.", author: "Tom Bradley", role: "Founder @ SaaS" },
    { quote: "They delivered Framer-quality work but we own the code. Game changer.", author: "Rachel Kim", role: "Product Manager" },
  ]

  const testimonialsRow2 = [
    { quote: "The custom cursor alone makes our site feel so premium. Clients love it.", author: "Jake Morrison", role: "Agency Owner" },
    { quote: "Fast, communicative, and the code is actually maintainable. Rare combo.", author: "Anna Schmidt", role: "Tech Lead" },
    { quote: "We've worked with many devs. This is the first time animations felt right.", author: "Carlos Ruiz", role: "Creative Director" },
    { quote: "Our bounce rate dropped significantly. Users actually stay and explore now.", author: "Sophie Chen", role: "Growth Lead" },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 overflow-hidden bg-[var(--bg-secondary)]/30">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Contained Marquee
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
            With Spotlight Container
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Wrapped in a glass card with spotlight effect - premium feel
          </p>
        </AnimatedSection>

        {/* Premium Container with Spotlight Effect */}
        <SpotlightCard
          className="rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border)] p-4 sm:p-6 md:p-8 lg:p-10"
          spotlightColor="rgba(34, 211, 238, 0.08)"
        >
          <div className="space-y-5">
            <TestimonialMarquee items={testimonialsRow1} direction="left" />
            <TestimonialMarquee items={testimonialsRow2} direction="right" />
          </div>

          {/* Feature callouts */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap justify-center gap-6 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Pure CSS Animation
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              GPU Accelerated
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              Pause on Hover
            </span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

// ============================================
// PILL/BADGE MARQUEE - Pure CSS for smooth animation
// ============================================
function PillMarquee({
  items,
  direction = 'left',
  speed = 'normal',
}: {
  items: { text: string; color?: string }[]
  direction?: 'left' | 'right'
  speed?: 'slow' | 'normal' | 'fast'
}) {
  const { ref, isVisible } = useIsVisible()
  const duplicated = [...items, ...items, ...items]

  // Build CSS class based on direction and speed
  const directionClass = direction === 'left' ? 'pill-marquee-left' : 'pill-marquee-right'
  const speedClass = speed === 'slow' ? 'pill-marquee-slow' : speed === 'fast' ? 'pill-marquee-fast' : ''

  return (
    <div
      ref={ref}
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
      }}
    >
      {/* Pure CSS animation - runs on compositor thread for 60fps */}
      <div
        className={`flex gap-4 whitespace-nowrap ${directionClass} ${speedClass} ${!isVisible ? 'marquee-paused' : ''}`}
      >
        {duplicated.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:scale-105 ${
              item.color || 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)] hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-60" />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function PillMarqueeShowcase() {
  const techStack = [
    { text: 'React 19', color: 'bg-cyan-500/10 border-cyan-500/30 text-[var(--accent-cyan)]' },
    { text: 'Next.js 15', color: 'bg-white/10 border-white/20 text-[var(--text-primary)]' },
    { text: 'TypeScript', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
    { text: 'Tailwind CSS', color: 'bg-teal-500/10 border-teal-500/30 text-teal-400' },
    { text: 'Framer Motion', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
    { text: 'Lenis Scroll', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
  ]

  const features = [
    { text: '60fps Animations' },
    { text: 'GPU Accelerated' },
    { text: 'Mobile Optimized' },
    { text: 'SEO Friendly' },
    { text: 'Accessible' },
    { text: 'Type Safe' },
    { text: 'Server Components' },
    { text: 'Edge Ready' },
  ]

  const services = [
    { text: 'Landing Pages', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
    { text: 'SaaS Websites', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
    { text: 'Portfolio Sites', color: 'bg-violet-500/10 border-violet-500/30 text-violet-400' },
    { text: 'Marketing Sites', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    { text: 'Web Apps', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    { text: 'E-commerce', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <AnimatedSection className="text-center">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Pill Marquee
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
            Scrolling Badge Tags
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Perfect for tech stacks, features, services, or trust indicators
          </p>
        </AnimatedSection>
      </div>

      <div className="space-y-6">
        {/* Tech stack - colored pills, left */}
        <PillMarquee items={techStack} direction="left" speed="normal" />

        {/* Features - neutral pills, right */}
        <PillMarquee items={features} direction="right" speed="slow" />

        {/* Services - colored pills, left fast */}
        <PillMarquee items={services} direction="left" speed="fast" />
      </div>

      {/* Caption */}
      <motion.p
        className="text-center text-[var(--text-muted)] text-sm mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Three speed variants: slow, normal, fast — with customizable colors
      </motion.p>
    </section>
  )
}

// Contained version of Pill Marquee
function PillMarqueeContained() {
  const skills = [
    { text: 'UI Design', color: 'bg-cyan-500/10 border-cyan-500/30 text-[var(--accent-cyan)]' },
    { text: 'Animation', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
    { text: 'Frontend Dev', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
    { text: 'React', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
    { text: 'Prototyping', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
    { text: 'Responsive', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
  ]

  const tools = [
    { text: 'Figma' },
    { text: 'VS Code' },
    { text: 'GitHub' },
    { text: 'Vercel' },
    { text: 'Notion' },
    { text: 'Linear' },
    { text: 'Slack' },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 overflow-hidden bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Contained Pill Marquee
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
            With Spotlight Container
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Badge tags wrapped in a glass card - perfect for skills or tools sections
          </p>
        </AnimatedSection>

        <SpotlightCard
          className="rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border)] p-4 sm:p-6 md:p-8 lg:p-12"
          spotlightColor="rgba(168, 85, 247, 0.08)"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-4 text-center">Skills</p>
              <PillMarquee items={skills} direction="left" speed="slow" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-4 text-center">Tools I Use</p>
              <PillMarquee items={tools} direction="right" speed="normal" />
            </div>
          </div>

          {/* Feature tags */}
          <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-wrap justify-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Customizable Colors
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Variable Speeds
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              Bi-directional
            </span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

// ============================================
// SINGLE ROW LOGO MARQUEE - Alternative style (Pure CSS)
// ============================================
function LogoMarqueeAlt() {
  const { ref, isVisible } = useIsVisible()
  const logos = [
    { name: 'Vercel', icon: '▲' },
    { name: 'Stripe', icon: '◈' },
    { name: 'Linear', icon: '◇' },
    { name: 'Notion', icon: '▣' },
    { name: 'Figma', icon: '◉' },
    { name: 'Slack', icon: '▤' },
    { name: 'Discord', icon: '◎' },
    { name: 'GitHub', icon: '◐' },
  ]

  const duplicated = [...logos, ...logos, ...logos]

  return (
    <section ref={ref} className="py-24 border-y border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <AnimatedSection className="text-center">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Logo Marquee
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Trusted By Leading Teams
          </h2>
        </AnimatedSection>
      </div>

      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
        }}
      >
        {/* Pure CSS animation - runs on compositor thread */}
        <div
          className={`flex gap-12 whitespace-nowrap pill-marquee-left pill-marquee-fast ${!isVisible ? 'marquee-paused' : ''}`}
        >
          {duplicated.map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-default"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-2xl font-semibold">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// PRICING CARDS SHOWCASE
// ============================================
function PricingShowcase() {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for trying out',
      features: ['10 Components', 'Basic Animations', 'Community Support', 'MIT License'],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: 49,
      description: 'For serious builders',
      features: ['150+ Components', 'Premium Animations', 'Priority Support', 'Lifetime Updates', 'Figma Files', 'Private Discord'],
      cta: 'Get Pro Access',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 199,
      description: 'For teams at scale',
      features: ['Everything in Pro', 'Custom Components', 'Dedicated Support', 'Team License', 'White-label Rights', 'SLA Guarantee'],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Pricing Cards
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            SaaS Pricing Component
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Three-tier pricing with hover lift, popular badge, and magnetic buttons
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
                plan.popular
                  ? 'bg-gradient-to-b from-cyan-500/10 to-purple-500/10 border-cyan-500/30'
                  : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Most Popular
                </motion.div>
              )}

              <div className="mb-5 sm:mb-6 md:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">{plan.name}</h3>
                <p className="text-[var(--text-muted)] text-xs sm:text-sm">{plan.description}</p>
              </div>

              <div className="mb-5 sm:mb-6 md:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]">${plan.price}</span>
                {plan.price > 0 && <span className="text-[var(--text-muted)] ml-2 text-sm">one-time</span>}
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 md:mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 sm:gap-3 text-[var(--text-primary)] text-sm sm:text-base">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-cyan-500/20' : 'bg-white/10'}`}>
                      <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${plan.popular ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`} />
                    </div>
                    <span className="whitespace-nowrap">{feature}</span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg transition-all touch-target ${
                  plan.popular
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-[var(--text-primary)] shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </MagneticButton>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ============================================
// FAQ ACCORDION - Animated expand/collapse
// ============================================
function FAQItem({
  q,
  a,
  open,
  toggle,
  index
}: {
  q: string
  a: string
  open: boolean
  toggle: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30'
          : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]'
      }`}
    >
      <button
        onClick={toggle}
        className="w-full p-5 flex items-center justify-between gap-4 text-left"
        data-hover
      >
        <span className={`font-semibold text-base md:text-lg leading-snug transition-colors duration-300 ${
          open ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'
        }`}>
          {q}
        </span>

        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            open ? 'bg-cyan-500/20 text-[var(--accent-cyan)]' : 'bg-white/10 text-[var(--text-primary)]'
          }`}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pt-0">
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
            {a}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FAQShowcase() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    { q: "Can you build custom animations?", a: "Absolutely. Every animation you see here is custom-built with Framer Motion. From micro-interactions to complex scroll-triggered sequences, I can bring any design to life." },
    { q: "Do I get the source code?", a: "Yes! Unlike Framer templates, you own the complete source code. It's built with React, Next.js, and Tailwind CSS - industry-standard tools your team can maintain and extend." },
    { q: "How does this compare to Framer?", a: "Same visual quality, but with full code ownership. No monthly fees, no platform lock-in. You can host anywhere, customize everything, and scale without limits." },
    { q: "What's your development process?", a: "I start with your Figma designs or references, build a prototype for review, iterate based on feedback, and deliver production-ready code with documentation." },
  ]

  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            FAQ Component
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Animated Accordion
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Smooth expand/collapse with spring physics and color transitions
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FAQItem
              key={i}
              q={f.q}
              a={f.a}
              open={openFaq === i}
              toggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// HORIZONTAL SCROLL SHOWCASE
// ============================================
function HorizontalScrollShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  // More scroll distance on mobile to show all cards
  const x = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '-220%' : '-75%'])

  const cards = [
    { icon: '✨', title: 'Spotlight Cards', desc: 'Light follows your cursor creating depth and focus', gradient: 'from-cyan-500/20 to-blue-500/20' },
    { icon: '🎯', title: '3D Tilt Effects', desc: 'Perspective transforms with smooth spring physics', gradient: 'from-purple-500/20 to-pink-500/20' },
    { icon: '🔮', title: 'Parallax Layers', desc: 'Multiple depth layers moving at different speeds', gradient: 'from-orange-500/20 to-red-500/20' },
    { icon: '⚡', title: 'Scroll Triggers', desc: 'Elements animate as they enter the viewport', gradient: 'from-green-500/20 to-emerald-500/20' },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--bg-secondary)]/50"
      style={{ height: isMobile ? '300vh' : '200vh' }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full mb-8 sm:mb-12">
          <AnimatedSection>
            <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
              Horizontal Scroll
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Pin & Scroll Section
            </h2>
            <p className="text-base sm:text-xl text-[var(--text-muted)] max-w-lg">
              The section pins while cards scroll horizontally - a signature Framer pattern
            </p>
          </AnimatedSection>
        </div>

        <motion.div
          className="flex gap-4 sm:gap-6 pl-[5%] sm:pl-[10%] will-change-transform"
          style={{ x }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <SpotlightCard className="h-full rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="p-5 sm:p-6 md:p-8 h-full">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 md:mb-6`}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">{card.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">{card.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[var(--text-muted)]">
          <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FORM COMPONENTS SHOWCASE
// ============================================
function FormShowcase() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Form Components
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Interactive Forms
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Animated inputs, loading states, and success feedback
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8"
          >
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-[var(--text-primary)]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Success!</h3>
                <p className="text-[var(--text-secondary)]">Your message has been sent.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {[
                  { key: 'name', label: 'Name', type: 'text', icon: User },
                  { key: 'email', label: 'Email', type: 'email', icon: Mail },
                ].map(({ key, label, type, icon: Icon }) => (
                  <div key={key} className="relative group">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                    <input
                      type={type}
                      placeholder={label}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 transition-all duration-200"
                    />
                  </div>
                ))}
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/50 transition-all duration-200 resize-none"
                  />
                </div>
                <MagneticButton
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-[var(--text-primary)] font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Message <ArrowRight className="w-5 h-5" /></>
                  )}
                </MagneticButton>
              </form>
            )}
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { icon: '🎯', title: 'Focus States', desc: 'Icons and borders change color on focus with smooth transitions' },
              { icon: '⏳', title: 'Loading States', desc: 'Animated spinner while processing form submission' },
              { icon: '✅', title: 'Success Feedback', desc: 'Celebratory animation when form is submitted' },
              { icon: '🧲', title: 'Magnetic Buttons', desc: 'Buttons follow your cursor with spring physics' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{item.title}</h4>
                  <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// PROCESS/STEPS SHOWCASE - Progressive reveal
// ============================================
function ProcessShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center']
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  const steps = [
    { icon: Calendar, title: 'Discovery Call', desc: 'We discuss your vision, requirements, and timeline.' },
    { icon: FileText, title: 'Proposal & Design', desc: 'I create a detailed proposal with mockups and pricing.' },
    { icon: Code2, title: 'Development', desc: 'Building your site with clean, maintainable code.' },
    { icon: Sparkles, title: 'Launch & Support', desc: 'Deploy to production with ongoing support.' },
  ]

  return (
    <section ref={sectionRef} className="py-32 bg-[var(--bg-secondary)]/30">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
            Process Component
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Timeline with Progress
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-lg mx-auto">
            Line draws progressively as you scroll through the section
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* SVG connector line - desktop */}
          <svg className="absolute top-12 left-0 w-full h-4 overflow-visible hidden md:block" preserveAspectRatio="none">
            <line x1="12.5%" y1="50%" x2="87.5%" y2="50%" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="2" />
            <motion.line
              x1="12.5%" y1="50%" x2="87.5%" y2="50%"
              stroke="rgb(34, 211, 238)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <s.icon className="w-8 h-8 text-[var(--accent-cyan)]" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-500 text-[var(--text-inverted)] text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </motion.div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{s.title}</h3>
                <p className="text-[var(--text-muted)] text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA
// ============================================
function CTA() {
  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <div className="relative text-center p-8 sm:p-12 md:p-16 lg:p-24 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden group">
            {/* Animated gradient border - rotates on hover */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] cta-gradient-border" />
            <div className="absolute inset-[2px] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-[var(--bg-primary)]" />

            {/* Glow - intensifies on hover */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 blur-[120px]"
              whileHover={{ opacity: 1.5 }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Let's Build Together
              </motion.h2>
              <motion.p
                className="text-xl text-[var(--text-secondary)] mb-12 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Need a developer who can match Framer's quality? You own the code. No subscriptions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <MagneticButton className="px-12 py-6 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-xl shadow-2xl shadow-black/10 dark:shadow-white/10 hover:shadow-black/20 dark:hover:shadow-white/20 transition-shadow inline-flex items-center gap-3">
                  Get In Touch
                  <ExternalLink className="w-5 h-5" />
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============================================
// MAIN
// ============================================
export default function Page() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ThemeToggle />
      <main className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased cursor-none transition-colors duration-300">
        <ScrollProgress />
        <Hero />
        <LogoMarquee />
        <Stats />
        <Features />

        {/* Globe Section - Eldora UI */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
                Interactive Globe
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                Global{' '}
                <MorphingText
                  texts={['Reach', 'Impact', 'Scale', 'Vision']}
                  className="text-[var(--accent-cyan)]"
                  duration={2500}
                />
              </h2>
              <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto">
                A 3D interactive globe component. Drag to rotate.
              </p>
            </AnimatedSection>
            <CobeGlobe className="mx-auto max-w-[500px]" />
          </div>
        </section>

        <PremiumCards />
        <HorizontalScrollShowcase />
        <TestimonialsFullWidth />
        <TestimonialsContained />
        <PillMarqueeShowcase />
        <PillMarqueeContained />
        <LogoMarqueeAlt />
        <FAQShowcase />
        <FormShowcase />
        <ProcessShowcase />
        <PricingShowcase />
        <CTA />

        <footer className="py-16 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/eldora">
                <ShimmerButton className="text-sm">
                  View More Components →
                </ShimmerButton>
              </Link>
            </motion.div>
            <motion.p
              className="text-[var(--text-muted)] text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Patterns Playground — Built with Next.js + Framer Motion + Tailwind + Lenis
            </motion.p>
            <motion.p
              className="text-[var(--text-muted)] text-xs mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              A portfolio piece by Highbee
            </motion.p>
          </div>
        </footer>
      </main>
    </SmoothScrollProvider>
  )
}
