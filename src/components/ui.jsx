import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/* ── Magnetic — element drifts toward the cursor, springs back ── */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 160, damping: 15, mass: 0.3 })
  const y = useSpring(my, { stiffness: 160, damping: 15, mass: 0.3 })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => { mx.set(0); my.set(0) }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

/* ── ButtonLink — magnetic CTA, internal (to) or external (href) ── */
export function ButtonLink({ to, href, children, variant = 'solid', className = '', ...rest }) {
  const base =
    'inline-block font-mono text-[11px] tracking-[0.16em] uppercase px-8 py-4 rounded-full cursor-pointer transition-colors duration-200 text-center'
  const styles = {
    solid: 'bg-clay text-card hover:bg-clay-deep',
    outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper',
    ghost: 'border border-paper/30 text-paper hover:bg-paper hover:text-ink',
  }
  const inner = (
    <motion.span className={`${base} ${styles[variant]} ${className}`} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.span>
  )
  return (
    <Magnetic strength={0.3}>
      {to ? <Link to={to} {...rest}>{inner}</Link>
        : <a href={href} {...rest}>{inner}</a>}
    </Magnetic>
  )
}

/* ── CountUp — animates 0→to when scrolled into view ── */
export function CountUp({ to, duration = 1.6, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return <span ref={ref} className={className}>{val}</span>
}

/* ── Badge — menu labels, colored by meaning ── */
export function Badge({ children }) {
  const t = String(children).toLowerCase()
  const tone = t.includes('vegan') ? 'text-olive border-olive/40'
    : t.includes('season') ? 'text-clay border-clay/40'
    : 'text-ink/50 border-ink/25'
  return (
    <span className={`font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 border rounded-full ${tone}`}>
      {children}
    </span>
  )
}

export { EASE }
