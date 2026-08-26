import { motion } from 'framer-motion'
import { brand } from '../data/content'

export default function LoadingScreen({ progress = 0 }) {
  const R = 30
  const C = 2 * Math.PI * R
  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-paper flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="#23190F" strokeOpacity="0.12" strokeWidth="1.5" />
            <circle
              cx="32" cy="32" r={R} fill="none" stroke="#C05A34" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * progress) / 100}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-[18px] rounded-full bg-gradient-to-br from-clay to-clay-deep" />
        </motion.div>

        <span className="font-serif text-2xl tracking-tight text-ink">
          {brand.markA} <span className="text-clay italic">&amp;</span> {brand.markB}
        </span>
      </div>

      <div className="w-72 max-w-[80vw]">
        <div className="h-px bg-ink/10 overflow-hidden">
          <motion.div
            className="h-full bg-clay"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2.5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">Warming up</span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-clay">{progress}%</span>
        </div>
      </div>

      <motion.p
        className="font-serif italic text-ink/35 text-sm"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        From bean to cup…
      </motion.p>
    </motion.div>
  )
}
