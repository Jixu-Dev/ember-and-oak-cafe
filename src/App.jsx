import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'

gsap.registerPlugin(ScrollTrigger)

function AppRoutes() {
  const location = useLocation()
  const lenisRef = useLenis()

  // Drive ScrollTrigger from Lenis' RAF loop
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(tick)
    }
  }, [lenisRef])

  // Reset scroll on route change
  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    // let the new page mount, then recompute pin distances
    const id = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(id)
  }, [location.pathname, lenisRef])

  return (
    <div className="relative bg-paper text-ink min-h-screen overflow-clip">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
