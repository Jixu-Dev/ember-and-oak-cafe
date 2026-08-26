import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal, { EASE } from '../components/Reveal'
import { ButtonLink, CountUp, Magnetic } from '../components/ui'
import { brand, about, values, stats, quote, team } from '../data/content'

/* ═══════════════════════════════════════════════════════════
   SVG icon illustrations for the values section
   Each draws itself in on scroll via stroke-dasharray animation
   ═══════════════════════════════════════════════════════════ */
const ValueIcons = [
  // Traceable Sourcing — coffee bean + leaf
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <ellipse cx="24" cy="28" rx="10" ry="14" />
      <path d="M24 14 C24 14 20 22 24 28 C28 22 24 14 24 14Z" />
      <path d="M24 14 C28 8 36 10 34 16" />
      <path d="M34 16 C32 12 28 11 24 14" />
    </svg>
  ),
  // Roasted In-House — fire/flame
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M24 4 C24 4 32 14 32 24 C32 32 28 38 24 38 C20 38 16 32 16 24 C16 14 24 4 24 4Z" />
      <path d="M24 18 C24 18 28 22 28 26 C28 30 26 32 24 32 C22 32 20 30 20 26 C20 22 24 18 24 18Z" />
      <line x1="24" y1="38" x2="24" y2="44" />
    </svg>
  ),
  // Made By Hand — hand
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M18 28 L18 14 C18 12 20 10 22 12 L22 22" />
      <path d="M22 12 L22 8 C22 6 24 4 26 6 L26 22" />
      <path d="M26 10 L26 8 C26 6 28 5 30 7 L30 22" />
      <path d="M30 12 C30 10 32 9 34 11 L34 26 C34 34 30 40 24 42 C18 40 14 34 14 28 L14 24 C14 22 16 21 18 23" />
    </svg>
  ),
  // A Third Place — house/door
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
      <path d="M6 22 L24 6 L42 22" />
      <path d="M10 22 L10 42 L38 42 L38 22" />
      <path d="M20 42 L20 30 L28 30 L28 42" />
      <circle cx="24" cy="18" r="3" />
    </svg>
  ),
]

/* ═══════════════════════════════════════════════════════════
   3D Tilt Card — tracks cursor for perspective transform
   ═══════════════════════════════════════════════════════════ */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    rotateX.set(y * -12)
    rotateY.set(x * 12)
  }, [rotateX, rotateY])

  const reset = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Staggered letter animation for hero headline
   ═══════════════════════════════════════════════════════════ */
function SplitText({ text, className = '', delay = 0 }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: delay + wi * 0.06 + ci * 0.03,
                duration: 0.7,
                ease: EASE,
              }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   DrawSVG — triggers stroke-dasharray draw on scroll
   ═══════════════════════════════════════════════════════════ */
function DrawSVG({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} className={`draw-svg ${inView ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Coffee steam component for quote section
   ═══════════════════════════════════════════════════════════ */
function CoffeeSteam() {
  return (
    <div className="steam-container mx-auto mb-4">
      <div className="steam-particle animate-steam-1" />
      <div className="steam-particle animate-steam-2" />
      <div className="steam-particle animate-steam-3" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Page transition variants
   ═══════════════════════════════════════════════════════════ */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.4 } },
}

/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
   ═══════════════════════════════════════════════════════════ */
export default function About() {
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const quoteRef = useRef(null)

  // Parallax for hero section
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImgY = useTransform(heroProgress, [0, 1], [0, 120])
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -60])
  const heroOverlayOpacity = useTransform(heroProgress, [0, 0.6], [0.3, 0.7])

  // Quote section scroll-driven color (background shifts)
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ['start end', 'end start'],
  })
  const quoteBg = useTransform(
    quoteProgress,
    [0, 0.3, 0.7, 1],
    ['#23190F', '#3a1f0f', '#C05A34', '#C05A34']
  )

  return (
    <motion.main
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="bg-paper" aria-label="About"
    >
      {/* ══════════════════════════════════════════════════════
          SECTION 1: CINEMATIC HERO WITH PARALLAX
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroImgY }}
        >
          <img
            src="/frames/home/ezgif-frame-001.jpg"
            alt="Freshly roasted coffee beans"
            className="w-full h-[120%] object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-ink/40 via-ink/30 to-ink/70"
          style={{ opacity: heroOverlayOpacity }}
        />

        {/* Decorative floating elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {/* Rotating ring */}
          <div className="absolute top-20 right-[10%] w-32 h-32 md:w-48 md:h-48 border border-paper/10 rounded-full animate-spin-slow" />
          {/* Floating dot cluster */}
          <div className="absolute bottom-[20%] left-[8%] w-3 h-3 rounded-full bg-clay/40 animate-float" />
          <div className="absolute top-[30%] left-[15%] w-2 h-2 rounded-full bg-gold/30 animate-float-delayed" />
          <div className="absolute top-[60%] right-[12%] w-4 h-4 rounded-full bg-clay/20 animate-float-slow" />
          {/* Corner accent lines */}
          <svg className="absolute top-24 left-8 w-16 h-16 text-paper/15" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="0.5">
            <line x1="0" y1="0" x2="64" y2="0" />
            <line x1="0" y1="0" x2="0" y2="64" />
          </svg>
          <svg className="absolute bottom-24 right-8 w-16 h-16 text-paper/15" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="0.5">
            <line x1="64" y1="64" x2="0" y2="64" />
            <line x1="64" y1="64" x2="64" y2="0" />
          </svg>
        </div>

        {/* Hero content with parallax text */}
        <motion.div
          className="relative z-[2] text-center px-6 max-w-5xl mx-auto pt-32 md:pt-40"
          style={{ y: heroTextY }}
        >
          <motion.p
            className="label text-clay mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          >
            {about.kicker}
          </motion.p>

          <h1 className="font-serif font-light text-paper leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-[6.5rem] mb-8">
            <SplitText text={about.title} delay={0.4} />
          </h1>

          <motion.p
            className="font-serif italic text-paper/70 text-xl md:text-2xl max-w-2xl mx-auto leading-snug"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          >
            {about.intro}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <span className="label text-paper/40">Scroll to discover</span>
            <span className="relative w-5 h-9 rounded-full border border-paper/30">
              <span className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-clay animate-scroll-dot" />
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom edge meta flourish */}
        <div className="absolute bottom-6 left-6 right-6 z-[2] flex justify-between pointer-events-none">
          <span className="label text-paper/30 hidden md:block">45.559°N / 122.643°W</span>
          <span className="label text-paper/30 hidden md:block">Small-batch, since {brand.est}</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: IMMERSIVE STORY TIMELINE
          ══════════════════════════════════════════════════════ */}
      <section ref={storyRef} className="relative px-6 md:px-12 py-28 md:py-40 max-w-6xl mx-auto overflow-hidden">
        {/* Decorative dot grid background */}
        <div className="absolute inset-0 dot-grid pointer-events-none" />

        {/* Section header */}
        <div className="relative mb-20 md:mb-28">
          <Reveal>
            <p className="label text-clay mb-4">The Journey</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif font-light text-ink leading-[1.05] tracking-tight text-4xl md:text-6xl lg:text-7xl max-w-4xl">
              A story told in <em className="shimmer-text not-italic">two chapters.</em>
            </h2>
          </Reveal>
        </div>

        {/* Timeline with connecting SVG line */}
        <div className="relative">
          {/* Connecting vertical line (desktop) */}
          <div className="hidden md:block absolute left-[110px] top-0 bottom-0 w-px">
            <motion.div
              className="w-full bg-gradient-to-b from-clay via-clay/50 to-transparent"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: EASE }}
            />
          </div>

          {about.story.map((s, i) => (
            <div key={s.heading} className="relative grid md:grid-cols-[220px_1fr] gap-8 md:gap-20 mb-20 md:mb-28 last:mb-0">
              {/* Number + heading */}
              <Reveal>
                <div className="flex items-center gap-4 md:flex-col md:items-start">
                  {/* Animated number circle */}
                  <motion.div
                    className="relative w-14 h-14 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-clay/30 animate-glow-border" />
                    <span className="font-mono text-clay text-lg font-medium">0{i + 1}</span>
                  </motion.div>
                  <h3 className="font-serif text-ink text-3xl md:text-4xl tracking-tight">{s.heading}</h3>
                </div>
              </Reveal>

              {/* Body with mask-wipe effect */}
              <Reveal delay={0.15}>
                <div className="relative">
                  <p className="text-ink/70 leading-[2] text-base md:text-lg font-light">{s.body}</p>
                  {/* Decorative accent bar */}
                  <motion.div
                    className="mt-8 h-[2px] bg-gradient-to-r from-clay to-transparent max-w-[200px]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        {/* Full-width cinematic image with scale + blur entrance */}
        <Reveal delay={0.1} className="mt-8">
          <motion.div
            className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden ring-1 ring-ink/10 shadow-[0_60px_140px_-50px_rgba(35,25,15,0.5)]"
            initial={{ scale: 1.08, filter: 'blur(8px)' }}
            whileInView={{ scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <img
              src="/frames/home/ezgif-frame-001.jpg"
              alt="Inside the roastery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Inner vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 100px 30px rgba(0,0,0,0.3)' }}
            />
            <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.18em] uppercase text-paper/80">
              Alberta Street, {brand.est}
            </span>
          </motion.div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3: GLASSMORPHIC STATS WITH 3D TILT
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-ink text-paper px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0 dot-grid" style={{ backgroundImage: 'radial-gradient(circle, #FCF8EF 1px, transparent 1px)' }} />
        </div>

        {/* Floating decorative orbs */}
        <div className="absolute top-10 left-[20%] w-64 h-64 rounded-full bg-clay/5 blur-[80px] animate-float-slow" />
        <div className="absolute bottom-10 right-[15%] w-48 h-48 rounded-full bg-gold/5 blur-[60px] animate-float" />

        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="label text-clay mb-4">By The Numbers</p>
            <h2 className="font-serif font-light text-paper text-4xl md:text-5xl tracking-tight">
              Small numbers, <em className="text-clay">big meaning.</em>
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <TiltCard>
                  <div className="glow-card rounded-2xl p-6 md:p-8 text-center h-full">
                    <div className="relative z-10">
                      <div className="font-serif font-light text-paper text-5xl md:text-6xl lg:text-7xl tracking-tight mb-2">
                        <CountUp to={parseInt(s.value, 10)} />
                        {s.suffix && (
                          <span className="text-clay text-2xl md:text-3xl align-top ml-1">{s.suffix}</span>
                        )}
                      </div>
                      <p className="label text-paper/40 mt-3">{s.label}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4: VALUES WITH SVG ICON ILLUSTRATIONS
          ══════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 max-w-6xl mx-auto py-28 md:py-36 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sand/50 blur-[120px] pointer-events-none" />

        <div className="relative">
          <Reveal className="mb-20">
            <p className="label text-clay mb-4">What We Hold To</p>
            <h2 className="font-serif font-light text-ink text-4xl md:text-6xl tracking-tight max-w-3xl">
              Four things we won't cut corners on.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-20">
            {values.map((v, i) => {
              const Icon = ValueIcons[i] || ValueIcons[0]
              return (
                <Reveal key={v.title} delay={i * 0.1}>
                  <motion.div
                    className="group relative cursor-default"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {/* SVG icon with draw animation */}
                    <DrawSVG className="text-clay mb-5">
                      <Icon />
                    </DrawSVG>

                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-mono text-clay text-sm">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-ink">{v.title}</h3>
                    </div>

                    <p className="text-ink/60 leading-relaxed font-light pl-0 md:pl-0">{v.text}</p>

                    {/* Animated underline on hover */}
                    <div className="value-line mt-4 w-full" />

                    {/* Subtle glow on hover */}
                    <div className="absolute -inset-4 rounded-xl bg-clay/0 group-hover:bg-clay/[0.03] transition-colors duration-500 -z-10" />
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5: TEAM / BARISTA SPOTLIGHT
          ══════════════════════════════════════════════════════ */}
      <section className="bg-sand px-6 md:px-12 py-28 md:py-36 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="label text-clay mb-4">The People</p>
            <h2 className="font-serif font-light text-ink text-4xl md:text-6xl tracking-tight">
              Meet the hands behind <em className="text-clay">your cup.</em>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.12}>
                <Magnetic strength={0.15}>
                  <motion.div
                    className="group relative"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {/* Portrait with circular clip + hover scale */}
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 ring-1 ring-ink/10 shadow-lg">
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Role badge appears on hover */}
                      <motion.div
                        className="absolute bottom-4 left-4 right-4 glass-dark rounded-xl px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                      >
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-clay">{member.role}</p>
                      </motion.div>
                    </div>

                    {/* Name + bio */}
                    <h3 className="font-serif text-2xl md:text-[1.7rem] text-ink mb-2 group-hover:text-clay transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="label text-clay/70 mb-3">{member.role}</p>
                    <p className="text-ink/60 text-sm leading-relaxed font-light">{member.bio}</p>
                  </motion.div>
                </Magnetic>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6: THEATRICAL QUOTE WITH STEAM + COLOR SHIFT
          ══════════════════════════════════════════════════════ */}
      <motion.section
        ref={quoteRef}
        className="relative px-6 md:px-12 py-28 md:py-40 overflow-hidden"
        style={{ backgroundColor: quoteBg }}
      >
        {/* Floating ambient orbs */}
        <div className="absolute top-[20%] left-[10%] w-40 h-40 rounded-full bg-clay/10 blur-[60px] animate-float" />
        <div className="absolute bottom-[15%] right-[8%] w-56 h-56 rounded-full bg-gold/8 blur-[80px] animate-float-slow" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Steam effect above quote */}
          <Reveal>
            <CoffeeSteam />
          </Reveal>

          {/* Large decorative quote mark */}
          <Reveal>
            <motion.span
              className="font-serif text-clay text-8xl md:text-9xl leading-none block mb-4"
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              "
            </motion.span>
          </Reveal>

          {/* Quote text with staggered word reveal */}
          <Reveal delay={0.1}>
            <p className="font-serif font-light italic text-card text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight">
              {quote.text}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="label text-card/60 mt-10 mb-12">— {quote.source}</p>
          </Reveal>

          <Reveal delay={0.4}>
            <ButtonLink to="/menu" variant="ghost" className="border-card/40 text-card">
              See What We Pour ↗
            </ButtonLink>
          </Reveal>
        </div>
      </motion.section>
    </motion.main>
  )
}
