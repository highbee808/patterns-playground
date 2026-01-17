# Framer-Quality Animation Patterns

A collection of premium animation patterns built with Next.js + Framer Motion + Tailwind + Lenis.

## Stack

```
Next.js 16+ (App Router)
├── Framer Motion (animations)
├── Tailwind CSS (styling)
├── Lenis (smooth scrolling)
└── TypeScript
```

---

## Patterns Documented

### 1. Smooth Scroll (Lenis)

```tsx
// components/smooth-scroll.tsx
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  smoothWheel: true,
})
```

**Key settings:**
- `duration: 1.2` - Scroll momentum duration
- `easeOutExpo` - That premium deceleration feel

---

### 2. Magnetic Button

Button subtly follows cursor on hover.

```tsx
function MagneticButton({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * 0.15  // 0.15 = magnetic strength
    const y = (e.clientY - top - height / 2) * 0.15
    setPosition({ x, y })
  }

  return (
    <motion.button
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    />
  )
}
```

---

### 3. Scroll-Triggered Fade Up

```tsx
function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1]  // Custom cubic-bezier
      }}
    />
  )
}
```

**Key:** The `ease: [0.25, 0.4, 0.25, 1]` curve gives that Framer-like feel.

---

### 4. Stagger Children

```tsx
const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
}

<motion.div
  initial="hidden"
  animate={isInView ? 'visible' : 'hidden'}
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div variants={staggerChild}>{item}</motion.div>
  ))}
</motion.div>
```

---

### 5. Word-by-Word Text Reveal

```tsx
const words = "Build Stunning Interfaces".split(' ')

{words.map((word, i) => (
  <motion.span
    key={i}
    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{
      duration: 0.7,
      delay: 0.2 + i * 0.08,  // Stagger each word
      ease: [0.25, 0.4, 0.25, 1]
    }}
    className="inline-block mr-[0.25em]"
  >
    {word}
  </motion.span>
))}
```

---

### 6. Infinite Scrolling Cards (Two Rows, Opposite Directions)

```tsx
// Row 1: left direction
<AnimatedCards items={row1} direction="left" speed="slow" />

// Row 2: right direction (creates crossover effect)
<AnimatedCards items={row2} direction="right" speed="slow" />
```

**Component internals:**
```tsx
<motion.div
  initial={{ x: direction === 'left' ? '0%' : '-50%' }}
  animate={{ x: direction === 'left' ? '-50%' : '0%' }}
  transition={{
    duration: 35,  // slow speed
    repeat: Infinity,
    ease: 'linear',
    repeatType: 'loop',
  }}
/>
```

**Fade edges with CSS mask:**
```css
mask-image: linear-gradient(to right, transparent, white 5%, white 95%, transparent);
```

---

### 7. Spotlight Card (Cursor-Following Light)

```tsx
function SpotlightCard({ children, spotlightColor }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={(e) => setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })}>
      {/* Spotlight gradient follows cursor */}
      <div
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
```

---

### 8. 3D Tilt Card

```tsx
function TiltCard({ children, tiltAmount = 15 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  return (
    <motion.div style={{ perspective: 1000 }}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </motion.div>
  )
}
```

---

### 9. Parallax Hero (Content fades/moves on scroll)

```tsx
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start start', 'end start'],
})

const y = useTransform(scrollYProgress, [0, 1], [0, 300])
const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

<motion.div style={{ y, opacity, scale }}>
  {/* Hero content */}
</motion.div>
```

---

### 10. Animated Gradient Orbs (Background)

```tsx
<motion.div
  className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"
  animate={{
    x: [0, 50, 0],
    y: [0, -30, 0],
    scale: [1, 1.1, 1],
  }}
  transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
/>
```

---

### 11. Count-Up Animation (Numbers)

```tsx
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)  // easeOutQuart
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView])

  return { count, ref }
}
```

---

### 12. Scroll Progress Bar

```tsx
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
```

---

## Key Easing Curves

| Name | Value | Feel |
|------|-------|------|
| Framer-like | `[0.25, 0.4, 0.25, 1]` | Smooth, premium |
| easeOutExpo | `(t) => 1 - Math.pow(2, -10 * t)` | Sharp start, smooth end |
| Spring | `{ stiffness: 300, damping: 30 }` | Bouncy but controlled |

---

## Color Palette (Dark Theme)

```css
--background: #030712;     /* gray-950 */
--surface: #0a0f1a;        /* slightly lighter */
--border: rgba(255,255,255,0.08);
--accent: #22d3ee;         /* cyan-400 */
--accent-secondary: #a855f7; /* purple-500 */
```

---

## Live Demo

https://patterns-playground.vercel.app
