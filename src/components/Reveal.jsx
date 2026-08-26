import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Reveal — a small scroll-into-view wrapper used across the site.
 * Fades + slides its children up once, when they enter the viewport.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.8,
  once = true,
  className = '',
  as = 'div',
  ...rest
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export { EASE }
