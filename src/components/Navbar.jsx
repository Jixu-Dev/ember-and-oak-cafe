import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { brand, navLinks } from '../data/content'

const EASE = [0.16, 1, 0.3, 1]

function Wordmark({ className = '' }) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      {brand.markA} <span className="text-clay italic">&amp;</span> {brand.markB}
    </span>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  const navBg = useTransform(scrollY, [0, 90], ['rgba(244,236,221,0)', 'rgba(244,236,221,0.9)'])
  const navBlur = useTransform(scrollY, [0, 90], ['blur(0px)', 'blur(14px)'])

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20))
    return () => unsub()
  }, [scrollY])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  const toggleMenu = () => {
    setMenuOpen((v) => !v)
    document.body.style.overflow = !menuOpen ? 'hidden' : ''
  }

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 py-4 flex items-center justify-between"
        style={{ backgroundColor: navBg, backdropFilter: navBlur, WebkitBackdropFilter: navBlur }}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* hairline under nav once scrolled */}
        <motion.span
          className="absolute inset-x-0 bottom-0 h-px bg-ink/10"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <Link to="/" aria-label={`${brand.name} — home`}>
          <motion.span
            className="block text-ink text-lg md:text-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Wordmark />
          </motion.span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-9 list-none">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
            >
              <Link
                to={link.to}
                className={`relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 group
                  ${isActive(link.to) ? 'text-clay' : 'text-ink/60 hover:text-ink'}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-clay transition-all duration-300
                    ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </Link>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/contact">
              <motion.span
                className="block font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 bg-clay text-card rounded-full cursor-pointer"
                whileHover={{ scale: 1.04, backgroundColor: '#9E4626' }}
                whileTap={{ scale: 0.97 }}
              >
                Visit Us
              </motion.span>
            </Link>
          </motion.li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer z-[1001]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-6 h-px bg-ink rounded-full origin-center"
              animate={
                menuOpen
                  ? i === 0 ? { rotate: 45, y: 6 }
                  : i === 1 ? { opacity: 0, scaleX: 0 }
                  : { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
              }
              transition={{ duration: 0.35, ease: EASE }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 md:hidden bg-paper"
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 36px) 32px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 36px) 32px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 36px) 32px)' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {navLinks.map((link, i) => (
              <Link key={link.to} to={link.to} onClick={toggleMenu}>
                <motion.span
                  className={`block font-serif text-5xl font-light cursor-pointer
                    ${isActive(link.to) ? 'text-clay' : 'text-ink/80'}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, ease: EASE }}
                  whileHover={{ x: 10, color: '#C05A34' }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
            <div className="label text-ink/40 mt-6">{brand.neighborhood}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { Wordmark }
