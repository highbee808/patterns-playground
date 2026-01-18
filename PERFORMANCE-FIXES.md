# Animation Performance Fixes

Instructions for achieving buttery smooth 60fps animations. Apply these fixes to eliminate lag and jank in scroll animations, marquees, and cursor effects.

---

## 1. Throttle Custom Cursor with RequestAnimationFrame

**Problem:** Mousemove events fire 60+ times per second, causing excessive re-renders.

**Fix:** Store position in a ref and only update state once per animation frame.

```tsx
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const posRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPos(posRef.current)
          rafRef.current = null
        })
      }
    }

    window.addEventListener('mousemove', move, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ... rest of component
}
```

---

## 2. Pause Off-Screen Animations with IntersectionObserver

**Problem:** Marquees and animations continue running when not visible, wasting CPU/GPU.

**Fix:** Create a visibility hook and pause animations when off-screen.

```tsx
function useIsVisible(rootMargin = '100px') {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, isVisible }
}
```

**Usage in marquee components:**
```tsx
function Marquee() {
  const { ref, isVisible } = useIsVisible()

  return (
    <div ref={ref}>
      <div
        className="marquee-track"
        style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      >
        {/* content */}
      </div>
    </div>
  )
}
```

For Framer Motion marquees:
```tsx
<motion.div
  animate={isVisible ? { x: ['0%', '-50%'] } : undefined}
  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
  style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
>
```

---

## 3. CSS Optimizations for Marquees

**Add to globals.css:**

```css
/* Container optimization */
.testimonial-marquee-container,
.marquee-container {
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
}

/* GPU acceleration for marquee tracks */
.testimonial-marquee,
.pill-marquee-track,
.logo-marquee-track,
.marquee-track {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
}

/* Apply will-change only when visible and animating */
.testimonial-marquee[style*="running"],
.pill-marquee-track[style*="running"],
.logo-marquee-track[style*="running"],
.marquee-track[style*="running"] {
  will-change: transform;
}

/* IMPORTANT: Slower animations on mobile = smoother */
/* Mobile devices struggle with fast animations */
@media (max-width: 768px) {
  .testimonial-marquee-left,
  .marquee-left {
    animation-duration: 14s; /* Slower than desktop */
  }

  .testimonial-marquee-right,
  .marquee-right {
    animation-duration: 16s;
  }
}

@media (max-width: 640px) {
  .testimonial-marquee-left,
  .marquee-left {
    animation-duration: 16s; /* Even slower on small mobile */
  }

  .testimonial-marquee-right,
  .marquee-right {
    animation-duration: 18s;
  }
}
```

---

## 4. Optimize Lenis Smooth Scroll

**Problem:** Default Lenis config can be too aggressive and fight with animations.

**Fix:** Update Lenis configuration in smooth-scroll.tsx:

```tsx
useEffect(() => {
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches

  const lenis = new Lenis({
    duration: 1.5,                              // Slower = smoother
    easing: (t) => 1 - Math.pow(1 - t, 3),     // Simpler cubic ease (less CPU)
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,                       // Less aggressive than 2
    syncTouch: false,                           // Let native handle touch
    syncTouchLerp: 0.1,
    wheelMultiplier: isTouchDevice ? 0 : 1,    // Disable on touch devices
  })

  lenisRef.current = lenis

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  return () => lenis.destroy()
}, [])
```

---

## 5. Convert Hero Orbs from Framer Motion to CSS

**Problem:** Framer Motion continuously animating blur elements is expensive.

**Fix:** Use pure CSS animations instead.

**Add to globals.css:**
```css
@keyframes orb-float-1 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(50px, -30px, 0) scale(1.1); }
}

@keyframes orb-float-2 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-40px, 40px, 0) scale(0.9); }
}

@keyframes orb-float-3 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, 0, 0) scale(1.2); }
}

.hero-orb {
  will-change: auto;
  backface-visibility: hidden;
}

.hero-orb-1 { animation: orb-float-1 20s ease-in-out infinite; }
.hero-orb-2 { animation: orb-float-2 15s ease-in-out infinite; animation-delay: -7s; }
.hero-orb-3 { animation: orb-float-3 10s ease-in-out infinite; animation-delay: -3s; }

@media (max-width: 640px) {
  .hero-orb { animation-duration: 30s; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-orb { animation: none !important; opacity: 0.5; }
}
```

**Update JSX:** Replace `<motion.div animate={...}>` with:
```tsx
<div className="hero-orb hero-orb-1 absolute ...bg-cyan-500/20 rounded-full blur-[120px]" />
<div className="hero-orb hero-orb-2 absolute ...bg-purple-600/20 rounded-full blur-[120px]" />
<div className="hero-orb hero-orb-3 absolute ...bg-pink-500/10 rounded-full blur-[100px]" />
```

---

## 6. Horizontal Scroll Section Mobile Fix

**Problem:** On mobile, not all cards are visible before section scrolls away.

**Fix:** Increase scroll distance on mobile:

```tsx
function HorizontalScrollShowcase() {
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

  // More scroll distance on mobile
  const x = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '-220%' : '-75%'])

  return (
    <section style={{ height: isMobile ? '300vh' : '200vh' }}>
      {/* ... */}
    </section>
  )
}
```

---

## Summary Checklist

- [ ] Throttle CustomCursor with RAF
- [ ] Add useIsVisible hook
- [ ] Apply IntersectionObserver to all marquee components
- [ ] Add CSS container optimizations (contain, content-visibility)
- [ ] Make mobile animations SLOWER (not faster)
- [ ] Optimize Lenis config (disable on touch devices)
- [ ] Convert hero gradient orbs to pure CSS
- [ ] Fix horizontal scroll section for mobile

---

## Key Principles

1. **Mobile animations should be SLOWER** - counterintuitive but smoother on constrained devices
2. **Pause off-screen animations** - saves CPU/GPU cycles
3. **Avoid static will-change** - apply only when animating
4. **Use CSS animations over Framer Motion** for always-running animations (orbs, marquees)
5. **Throttle mousemove handlers** with RAF
6. **Let native scroll handle touch devices** - disable Lenis smoothWheel on mobile
