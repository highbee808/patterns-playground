'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

// Eldora UI Components
import { CobeGlobe } from '@/components/eldoraui/cobe-globe'
import { MorphingText, MorphingTextAdvanced } from '@/components/eldoraui/morphing-text'
import { WavyText, WavyTextLoop } from '@/components/eldoraui/wavy-text'
import { ScratchToReveal } from '@/components/eldoraui/scratch-to-reveal'
import { OrbitingCirclesDemo } from '@/components/eldoraui/orbiting-circles'
import { BentoGridDemo } from '@/components/eldoraui/bento-grid'
import { ShimmerButton, ShimmerBorderButton, PulseGlowButton } from '@/components/eldoraui/shimmer-button'
import { LogoTimelineDemo } from '@/components/eldoraui/logo-timeline'

// Theme
import { ThemeToggle } from '@/components/theme-toggle'
import { SmoothScrollProvider } from '@/components/smooth-scroll'

// Section wrapper
function Section({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.section
      className={`py-24 px-6 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </motion.section>
  )
}

export default function EldoraPage() {
  return (
    <SmoothScrollProvider>
      {/* Override cursor: none from globals.css */}
      <style jsx global>{`
        body, a, button, [data-hover] {
          cursor: auto !important;
        }
      `}</style>
      <main className="min-h-screen bg-[var(--bg-primary)]">
        <ThemeToggle />

        {/* Navigation */}
        <nav className="fixed top-6 left-6 z-50">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-cyan-light)] border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Eldora UI Components
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--text-primary)] mb-6">
              <MorphingText
                texts={['Beautiful', 'Animated', 'Interactive', 'Modern']}
                className="text-[var(--accent-cyan)]"
                duration={2500}
              />{' '}
              <br />
              Components
            </h1>

            <motion.p
              className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A collection of premium animated components from Eldora UI.
              Copy, paste, and customize for your projects.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ShimmerButton>Get Started</ShimmerButton>
              <ShimmerBorderButton>View Source</ShimmerBorderButton>
            </motion.div>
          </div>
        </section>

        {/* Globe Section */}
        <Section
          title="Interactive Globe"
          subtitle="A beautiful 3D globe powered by Cobe. Drag to rotate, auto-rotates when idle."
        >
          <CobeGlobe className="mx-auto" />
        </Section>

        {/* Text Animations */}
        <Section
          title="Text Animations"
          subtitle="Eye-catching text effects for headlines and emphasis"
          className="bg-[var(--bg-secondary)]/50"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Morphing Text */}
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
                Morphing Text
              </h3>
              <div className="text-4xl font-bold text-[var(--text-primary)]">
                Build{' '}
                <MorphingText
                  texts={['faster', 'better', 'smarter', 'together']}
                  className="text-[var(--accent-purple)]"
                  duration={2000}
                />
              </div>
            </div>

            {/* Morphing Text Advanced */}
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
                Character Morphing
              </h3>
              <div className="text-4xl font-bold text-[var(--text-primary)]">
                <MorphingTextAdvanced
                  texts={['Design', 'Develop', 'Deploy', 'Delight']}
                  className="text-[var(--accent-pink)]"
                  duration={2500}
                />
              </div>
            </div>

            {/* Wavy Text */}
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
                Wavy Text (On View)
              </h3>
              <div className="text-4xl font-bold text-[var(--text-primary)]">
                <WavyText text="Hello World!" />
              </div>
            </div>

            {/* Wavy Text Loop */}
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider mb-4">
                Wavy Text (Continuous)
              </h3>
              <div className="text-4xl font-bold text-[var(--text-primary)]">
                <WavyTextLoop text="Bouncy Text!" />
              </div>
            </div>
          </div>
        </Section>

        {/* Scratch To Reveal */}
        <Section
          title="Scratch To Reveal"
          subtitle="Interactive scratch card effect. Scratch to reveal hidden content!"
        >
          <div className="flex justify-center">
            <ScratchToReveal
              width={350}
              height={200}
              minScratchPercentage={40}
              onComplete={() => console.log('Revealed!')}
            >
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-8 rounded-2xl">
                <span className="text-4xl mb-2">🎉</span>
                <span className="text-2xl font-bold">You Won!</span>
                <span className="text-sm opacity-80">50% Off Everything</span>
              </div>
            </ScratchToReveal>
          </div>
        </Section>

        {/* Orbiting Circles */}
        <Section
          title="Orbiting Circles"
          subtitle="Elements orbit around a center point. Great for showcasing tech stacks."
          className="bg-[var(--bg-secondary)]/50"
        >
          <OrbitingCirclesDemo />
        </Section>

        {/* Bento Grid */}
        <Section
          title="Bento Grid"
          subtitle="Modern asymmetric grid layouts for feature showcases"
        >
          <BentoGridDemo />
        </Section>

        {/* Logo Timeline */}
        <Section
          title="Logo Timeline"
          subtitle="Animated tech stack showcase with smooth horizontal scrolling"
          className="bg-[var(--bg-secondary)]/50"
        >
          <LogoTimelineDemo />
        </Section>

        {/* Buttons */}
        <Section
          title="Animated Buttons"
          subtitle="Premium button styles with shimmer, glow, and border effects"
          className="bg-[var(--bg-secondary)]/50"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <ShimmerButton className="mb-2">Shimmer Button</ShimmerButton>
              <p className="text-sm text-[var(--text-muted)]">Shimmer</p>
            </div>
            <div className="text-center">
              <ShimmerBorderButton className="mb-2">Border Animation</ShimmerBorderButton>
              <p className="text-sm text-[var(--text-muted)]">Animated Border</p>
            </div>
            <div className="text-center">
              <PulseGlowButton className="mb-2">Pulse Glow</PulseGlowButton>
              <p className="text-sm text-[var(--text-muted)]">Pulse Glow</p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[var(--text-muted)] mb-4">
              Components inspired by{' '}
              <a
                href="https://www.eldoraui.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-cyan)] hover:underline"
              >
                Eldora UI
              </a>
            </p>
            <Link
              href="/"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to main showcase
            </Link>
          </div>
        </footer>
      </main>
    </SmoothScrollProvider>
  )
}
