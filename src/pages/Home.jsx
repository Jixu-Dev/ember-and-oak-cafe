import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameSequence } from '../hooks/useFrameSequence'
import LoadingScreen from '../components/LoadingScreen'
import Reveal, { EASE } from '../components/Reveal'
import { ButtonLink, CountUp, Magnetic, Badge } from '../components/ui'
import {
  brand, homeFrames, heroCaptions, manifesto,
  ritual, values, stats, featured, quote, roastSpectrum,
} from '../data/content'

const TOTAL_FRAMES = 200
const marqueeWords = [
  'Small-batch Roasting', 'Single Origin', 'Roasted In-House', 'Poured By Hand',
  'Direct Trade', 'No Shortcuts', 'Alberta Arts District', 'Est. 2016',
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
    rotateX.set(y * -10)
    rotateY.set(x * 10)
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
   Custom SVG Icons for Ritual Steps
   ═══════════════════════════════════════════════════════════ */
const RitualStepIcons = [
  // 01: SOURCING — Origin Branch & Sun
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="34" cy="14" r="6" strokeDasharray="3 3" />
      <path d="M12 38 C14 26 24 16 38 14" />
      <path d="M22 28 C26 22 34 22 34 28 C34 34 26 34 22 28Z" />
      <path d="M14 36 C10 32 10 24 16 22 C22 20 20 30 14 36Z" />
      <circle cx="12" cy="38" r="2" fill="currentColor" />
    </svg>
  ),
  // 02: ROASTING — Roaster Drum & Thermal Flame
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="24" cy="20" r="13" />
      <path d="M17 20 C17 16 24 12 24 20 C24 26 31 22 31 20" />
      <path d="M15 36 C18 42 30 42 33 36" />
      <path d="M24 33 L24 42" />
      <path d="M18 42 L30 42" />
    </svg>
  ),
  // 03: GRINDING — Precision Burr & Particles
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <polygon points="12,12 36,12 30,28 18,28" />
      <line x1="24" y1="6" x2="24" y2="12" />
      <line x1="18" y1="6" x2="30" y2="6" />
      <circle cx="24" cy="34" r="1.5" fill="currentColor" />
      <circle cx="20" cy="38" r="1.2" fill="currentColor" />
      <circle cx="28" cy="39" r="1.2" fill="currentColor" />
      <circle cx="23" cy="42" r="1" fill="currentColor" />
    </svg>
  ),
  // 04: POURING — Portafilter & Velvet Flow
  () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <rect x="14" y="10" width="20" height="10" rx="2" />
      <path d="M8 14 L14 14" />
      <path d="M20 20 L20 26 C20 28 22 30 24 30 C26 30 28 28 28 26 L28 20" />
      <path d="M24 30 L24 38" />
      <path d="M18 38 C18 42 30 42 30 38" />
      <path d="M14 42 L34 42" />
    </svg>
  ),
]

/* ═══════════════════════════════════════════════════════════
   Coffee Steam Particle Effect
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
   Interactive Roast Spectrum & Flavor Matrix Component
   ═══════════════════════════════════════════════════════════ */
function RoastSpectrumWidget() {
  const [activeTab, setActiveTab] = useState(0)
  const activeRoast = roastSpectrum[activeTab]

  return (
    <div className="relative bg-ink text-paper rounded-3xl p-8 md:p-14 overflow-hidden border border-paper/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-clay/15 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gold/10 blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-5" />

      {/* Widget Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-paper/10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <p className="label text-clay">Interactive Sensory Lab</p>
          </div>
          <h3 className="font-serif font-light text-3xl md:text-5xl tracking-tight text-paper">
            The Roast Spectrum
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-paper/5 p-1.5 rounded-full border border-paper/10 backdrop-blur-md">
          {roastSpectrum.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`relative px-5 py-2.5 rounded-full font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                activeTab === idx
                  ? 'text-ink font-medium'
                  : 'text-paper/60 hover:text-paper'
              }`}
            >
              {activeTab === idx && (
                <motion.div
                  layoutId="roastTabPill"
                  className="absolute inset-0 bg-paper rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Roast Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRoast.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="relative z-10 mt-10 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center"
        >
          {/* Left Column: Tasting Notes & Narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-clay/20 text-clay border border-clay/30 rounded-full">
                {activeRoast.origin}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-paper/50">
                {activeRoast.elevation}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-paper/50">
                • {activeRoast.process}
              </span>
            </div>

            <h4 className="font-serif text-3xl md:text-4xl text-paper mb-4">
              {activeRoast.name}
            </h4>

            <p className="text-paper/70 font-light text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {activeRoast.description}
            </p>

            {/* Flavor Tag Chips */}
            <div>
              <p className="label text-paper/40 mb-3">Tasting Notes</p>
              <div className="flex flex-wrap gap-2">
                {activeRoast.notes.map((note, i) => (
                  <motion.span
                    key={note}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-paper/10 text-paper/90 border border-paper/15"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sensory Attributes Meters */}
          <div className="bg-paper/5 rounded-2xl p-6 md:p-8 border border-paper/10 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-paper/10 pb-4">
              <span className="label text-clay">Sensory Profile</span>
              <span className="font-mono text-[11px] text-paper/50 tracking-wider">
                Best for: <strong className="text-paper font-normal">{activeRoast.bestFor}</strong>
              </span>
            </div>

            {/* Acidity Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-paper/70">Acidity / Brightness</span>
                <span className="text-clay font-medium">{activeRoast.acidity}%</span>
              </div>
              <div className="h-2 w-full bg-paper/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activeRoast.acidity}%` }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="h-full bg-gradient-to-r from-clay to-gold rounded-full"
                />
              </div>
            </div>

            {/* Body Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-paper/70">Body / Mouthfeel</span>
                <span className="text-clay font-medium">{activeRoast.body}%</span>
              </div>
              <div className="h-2 w-full bg-paper/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activeRoast.body}%` }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="h-full bg-gradient-to-r from-clay to-amber-600 rounded-full"
                />
              </div>
            </div>

            {/* Sweetness Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-paper/70">Sweetness / Caramelization</span>
                <span className="text-clay font-medium">{activeRoast.sweetness}%</span>
              </div>
              <div className="h-2 w-full bg-paper/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activeRoast.sweetness}%` }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="h-full bg-gradient-to-r from-amber-600 to-clay-deep rounded-full"
                />
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/menu"
                className="inline-block font-mono text-[11px] tracking-[0.16em] uppercase text-clay hover:text-gold transition-colors link-underline"
              >
                Order This Roast In-Café ↗
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)

  const onProgress = useCallback((loaded, total) => {
    setLoadPct(Math.round((loaded / total) * 100))
  }, [])

  const { canvasRef, scrub, preload, resize } = useFrameSequence(homeFrames, onProgress)

  // preload frames, then reveal
  useEffect(() => {
    let alive = true
    preload().then(() => { if (alive) { resize(); setFrameLoaded(true) } })
    return () => { alive = false }
  }, [preload, resize])

  // pin the hero + scrub the sequence
  useEffect(() => {
    if (!frameLoaded || !heroRef.current) return
    scrub(0)

    const st = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=420%',
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        setProgress(self.progress)
        scrub(self.progress)
      },
    })

    const onResize = debounce(() => { resize(); ScrollTrigger.refresh() }, 200)
    window.addEventListener('resize', onResize)
    ScrollTrigger.refresh()

    return () => { st.kill(); window.removeEventListener('resize', onResize) }
  }, [frameLoaded, scrub, resize])

  const caption = heroCaptions.find((c) => progress >= c.from && progress < c.to) ?? heroCaptions[0]
  const frameNo = String(Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)).padStart(3, '0')
  const showIntro = progress < 0.12
  const showEnd = progress > 0.9

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.6 }}
      aria-label="Home"
    >
      {/* ── Loading ── */}
      <AnimatePresence>
        {!frameLoaded && <LoadingScreen progress={loadPct} />}
      </AnimatePresence>

      {/* ══ PINNED CINEMATIC HERO (UNTOUCHED AS REQUESTED) ══ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-paper">
        {/* corner meta flourishes */}
        <div className="absolute inset-0 z-[3] pointer-events-none hidden md:block">
          <span className="absolute top-24 left-8 label text-ink/40">45.559°N / 122.643°W</span>
          <span className="absolute top-24 right-8 label text-ink/40">{brand.neighborhood}</span>
        </div>

        {/* the framed "film" window */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center px-6 md:px-8">
          <motion.div
            className="relative w-full max-w-[1120px] aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-ink/15 shadow-[0_40px_120px_-40px_rgba(35,25,15,0.55)] bg-ink"
            style={{ scale: 1 + progress * 0.03 }}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

            {/* subtle vignette so window edges read as a frame */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 120px 20px rgba(0,0,0,0.45)' }} />

            {/* top strip: REC + frame counter */}
            <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 md:px-5 py-3 text-paper/80">
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-clay"
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
                The Roast
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-paper/70">
                {frameNo} / {TOTAL_FRAMES}
              </span>
            </div>

            {/* corner ticks */}
            {['top-3 left-3 border-l border-t', 'top-3 right-3 border-r border-t',
              'bottom-3 left-3 border-l border-b', 'bottom-3 right-3 border-r border-b'].map((c) => (
              <span key={c} className={`absolute w-4 h-4 border-paper/40 ${c}`} />
            ))}

            {/* in-window caption */}
            <div className="absolute bottom-0 inset-x-0 px-5 md:px-8 pb-5 pt-16 bg-gradient-to-t from-black/70 to-transparent">
              <AnimatePresence mode="wait">
                <motion.p
                  key={caption.text}
                  className="font-serif italic text-paper text-lg md:text-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className="font-mono not-italic text-clay text-xs mr-3 align-middle">{caption.index}</span>
                  {caption.text}
                </motion.p>
              </AnimatePresence>
              {/* scrub progress line */}
              <div className="mt-4 h-px bg-paper/20">
                <div className="h-full bg-clay origin-left" style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Intro headline overlay — fades as scrub begins */}
        <AnimatePresence>
          {showIntro && frameLoaded && (
            <motion.div
              className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center px-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="bg-paper/70 backdrop-blur-sm rounded-3xl px-8 py-10 md:px-16 md:py-12">
                <motion.p className="label text-clay mb-5"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  {brand.kind} · {brand.city}
                </motion.p>
                <motion.h1
                  className="font-serif font-light text-ink leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                  initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 1, ease: EASE }}>
                  A bean becomes<br /><em className="text-clay">a morning.</em>
                </motion.h1>
                <motion.p className="mt-6 text-ink/60 font-light max-w-md mx-auto"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  Scroll to follow one cup, from raw bean to the last swirl of milk.
                </motion.p>
              </div>

              {/* scroll cue */}
              <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                <span className="label text-ink/40">Scroll</span>
                <span className="relative w-5 h-9 rounded-full border border-ink/30">
                  <span className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-clay animate-scroll-dot" />
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End card — appears at the last of the scrub */}
        <AnimatePresence>
          {showEnd && (
            <motion.div
              className="absolute inset-x-0 bottom-10 z-[2] flex flex-col items-center gap-5 text-center px-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}>
              <p className="label text-clay">Now brewing on Alberta Street</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonLink to="/menu">See the Menu ↗</ButtonLink>
                <ButtonLink to="/contact" variant="outline">Find Us</ButtonLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 1: REFINED MARQUEE RIBBON
          ══════════════════════════════════════════════════════ */}
      <div className="bg-ink text-paper py-6 overflow-hidden border-y border-ink relative z-10 shadow-lg">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
              {marqueeWords.map((w, i) => (
                <span key={w} className="flex items-center group cursor-default">
                  <span className="font-serif text-2xl md:text-3xl px-6 whitespace-nowrap text-paper group-hover:text-clay transition-colors duration-300">
                    {w}
                  </span>
                  <span className="text-clay text-lg animate-spin-slow">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: THE MANIFESTO (EST. 2016 · ALBERTA ARTS DISTRICT)
          ══════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-28 md:py-40 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle decorative dot grid */}
        <div className="absolute inset-0 dot-grid pointer-events-none" />

        {/* Ambient warm gradient blur */}
        <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-clay/5 blur-[100px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-20 items-center">
          {/* Main Manifesto Text Block */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-clay animate-pulse" />
                <p className="label text-clay">{manifesto.kicker}</p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-ink leading-[1.05] tracking-tight text-4xl md:text-6xl lg:text-7xl max-w-3xl mb-10">
                We believe a good cup is <em className="shimmer-text not-italic">worth slowing down for.</em>
              </h2>
            </Reveal>

            <div className="space-y-6 max-w-2xl">
              {manifesto.body.map((p, i) => (
                <Reveal key={i} delay={0.12 + i * 0.1}>
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-clay text-xs pt-1">0{i + 1}</span>
                    <p className="text-ink/75 leading-[1.95] text-base md:text-lg font-light">
                      {p}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Signature & Location Marker */}
            <Reveal delay={0.3} className="mt-12 pt-8 border-t border-ink/10 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-clay/40 bg-card flex items-center justify-center font-serif italic text-clay text-lg shadow-sm">
                  E&O
                </div>
                <div>
                  <p className="font-serif text-ink text-base">Ember & Oak Roasters</p>
                  <p className="font-mono text-[10px] tracking-widest text-ink/50 uppercase">Portland, Oregon</p>
                </div>
              </div>

              <Link
                to="/about"
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-clay hover:text-clay-deep transition-colors link-underline"
              >
                Read Our Full Story ↗
              </Link>
            </Reveal>
          </div>

          {/* Interactive Editorial Seal / Visual Card */}
          <Reveal delay={0.2}>
            <TiltCard>
              <div className="relative bg-card rounded-3xl p-8 md:p-10 border border-ink/10 shadow-[0_30px_90px_-30px_rgba(35,25,15,0.25)] overflow-hidden">
                {/* Vintage roaster badge banner */}
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                  <div className="absolute transform rotate-45 bg-clay text-card font-mono text-[9px] tracking-[0.2em] uppercase py-1 right-[-35px] top-[20px] w-[140px] text-center shadow-md">
                    Craft Lot
                  </div>
                </div>

                <p className="label text-clay/80 mb-2">Heritage Profile</p>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-6">
                  The Alberta Corner
                </h3>

                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 ring-1 ring-ink/10 shadow-inner">
                  <img
                    src="/frames/home/ezgif-frame-001.jpg"
                    alt="Ember and Oak vintage drum roaster"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.16em] uppercase text-paper">
                    12kg Cast-Iron Drum · Batch #4,280
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink/10">
                  <div>
                    <span className="font-mono text-[10px] tracking-wider text-ink/40 uppercase block">Elevation</span>
                    <span className="font-serif text-lg text-ink font-normal">1,750 – 2,200m</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-wider text-ink/40 uppercase block">Roast Rhythm</span>
                    <span className="font-serif text-lg text-ink font-normal">Weekly Small-Batch</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3: THE RITUAL (FOUR STEPS, EVERY CUP)
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-sand px-6 md:px-12 py-28 md:py-36 overflow-hidden">
        {/* Background accent */}
        <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-clay/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-clay" />
                <p className="label text-clay">Methodology</p>
              </div>
              <h2 className="font-serif font-light text-ink text-4xl md:text-6xl tracking-tight">
                The four-step ritual.
              </h2>
            </div>
            <p className="font-serif italic text-ink/60 text-lg md:text-xl max-w-sm">
              From high-altitude green bean to golden crema — calibrated to the morning.
            </p>
          </Reveal>

          {/* Stepped Interactive Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ritual.map((step, i) => {
              const Icon = RitualStepIcons[i] || RitualStepIcons[0]
              return (
                <Reveal key={step.no} delay={i * 0.1}>
                  <TiltCard className="h-full">
                    <div className="group relative bg-card rounded-2xl p-7 md:p-8 h-full flex flex-col justify-between border border-ink/10 hover:border-clay/40 transition-colors duration-500 shadow-sm hover:shadow-xl">
                      {/* Top Header: Step Number & Animated SVG */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-xl bg-paper flex items-center justify-center text-clay border border-ink/5 group-hover:border-clay/30 transition-colors">
                            <DrawSVG>
                              <Icon />
                            </DrawSVG>
                          </div>
                          <span className="font-mono text-clay text-sm font-medium px-2.5 py-1 rounded-full bg-clay/10 border border-clay/20">
                            {step.no}
                          </span>
                        </div>

                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-clay/80 mb-1">
                          {step.subtitle}
                        </p>
                        <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 group-hover:text-clay transition-colors duration-300">
                          {step.title}
                        </h3>

                        <p className="text-ink/65 text-[14px] leading-relaxed font-light mb-8">
                          {step.text}
                        </p>
                      </div>

                      {/* Bottom Micro Parameters Tag */}
                      <div className="pt-4 border-t border-ink/10 flex items-center justify-between font-mono text-[10px] tracking-wider text-ink/60">
                        <span className="text-clay font-medium">{step.metric}</span>
                        <span>{step.detail}</span>
                      </div>

                      {/* Interactive hover bottom progress line */}
                      <div className="value-line mt-3 w-full" />
                    </div>
                  </TiltCard>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4: BY THE NUMBERS (ELEVATED STATS)
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-ink text-paper px-6 md:px-12 py-24 md:py-32 overflow-hidden">
        {/* Animated background stars / dot grid */}
        <div className="absolute inset-0 dot-grid opacity-5 pointer-events-none" />

        {/* Ambient floating orbs */}
        <div className="absolute top-10 left-[15%] w-72 h-72 rounded-full bg-clay/10 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-10 right-[10%] w-60 h-60 rounded-full bg-gold/10 blur-[90px] animate-float" />

        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="label text-clay mb-3">Small Batch Precision</p>
            <h2 className="font-serif font-light text-paper text-4xl md:text-5xl tracking-tight">
              By the numbers
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.09}>
                <TiltCard>
                  <div className="glow-card rounded-2xl p-6 md:p-8 text-center h-full">
                    <div className="relative z-10">
                      <div className="font-serif font-light text-paper text-5xl md:text-6xl lg:text-7xl tracking-tight mb-2">
                        <CountUp to={parseInt(s.value, 10)} />
                        {s.suffix && (
                          <span className="text-clay text-2xl md:text-3xl align-top ml-1">
                            {s.suffix}
                          </span>
                        )}
                      </div>
                      <p className="label text-paper/50 mt-3">{s.label}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5: INTERACTIVE ROAST SPECTRUM & FLAVOR MATRIX
          ══════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-28 md:py-36 max-w-7xl mx-auto">
        <Reveal>
          <RoastSpectrumWidget />
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6: HOUSE FAVORITES (FEATURED MENU)
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-sand px-6 md:px-12 py-28 md:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="label text-clay mb-3">A Taste of the Board</p>
              <h2 className="font-serif font-light text-ink text-4xl md:text-6xl tracking-tight">
                House favorites
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-block font-mono text-[11px] tracking-[0.2em] uppercase text-ink/70 hover:text-clay transition-colors link-underline"
            >
              Explore Full Seasonal Menu (18 Items) ↗
            </Link>
          </Reveal>

          {/* Featured Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.12}>
                <Magnetic strength={0.15}>
                  <div className="group bg-card rounded-2xl p-8 border border-ink/10 hover:border-clay/40 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-clay px-2.5 py-1 rounded-full bg-clay/10 border border-clay/20">
                          {item.tag || 'Specialty'}
                        </span>
                        <span className="font-mono text-lg text-ink font-medium">
                          ${item.price}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl md:text-3xl text-ink mb-3 group-hover:text-clay transition-colors duration-300">
                        {item.name}
                      </h3>

                      <p className="text-ink/65 text-[14px] leading-relaxed font-light mb-6">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-ink/45 tracking-wider">
                        {item.notes || 'Handcrafted Fresh'}
                      </span>
                      <span className="text-clay group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </Magnetic>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7: THEATRICAL PRESS QUOTE
          ══════════════════════════════════════════════════════ */}
      <section className="relative bg-ink text-paper px-6 md:px-12 py-28 md:py-40 overflow-hidden">
        {/* Ambient glowing embers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-clay/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <Reveal>
            <CoffeeSteam />
          </Reveal>

          <Reveal delay={0.1}>
            <motion.span
              className="font-serif text-clay text-7xl md:text-8xl leading-none block mb-4"
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              “
            </motion.span>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="font-serif font-light italic text-card text-3xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight">
              {quote.text}
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-clay/40" />
              <p className="label text-paper/60">{quote.source}</p>
              <span className="h-px w-8 bg-clay/40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8: ALBERTA STREET INVITATION (CTA)
          ══════════════════════════════════════════════════════ */}
      <section className="bg-clay text-card px-6 md:px-12 py-24 md:py-36 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full border border-card/10 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full border border-card/10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <Reveal>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-card animate-pulse" />
                <p className="label text-card/80">Open Daily · Alberta Arts District</p>
              </div>

              <h2 className="font-serif font-light text-card text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-4">
                Come sit with us<br />a while.
              </h2>

              <p className="text-card/75 text-base md:text-lg font-light max-w-md">
                2847 NE Alberta Street · Roasting, brewing, and baking seven days a week.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <ButtonLink to="/menu" variant="ghost" className="border-card/40 text-card">
                Browse the Menu
              </ButtonLink>
              <Link to="/contact">
                <motion.span
                  className="inline-block font-mono text-[11px] tracking-[0.16em] uppercase px-8 py-4 rounded-full bg-card text-ink hover:bg-paper transition-colors duration-200 text-center w-full sm:w-auto shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Find Our Corner ↗
                </motion.span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

function debounce(fn, ms) {
  let t
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}
