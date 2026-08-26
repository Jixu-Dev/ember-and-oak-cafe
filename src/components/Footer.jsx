import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { brand, navLinks, contact } from '../data/content'
import { Wordmark } from './Navbar'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="relative bg-ink text-paper" role="contentinfo">
      {/* top row */}
      <div className="px-6 md:px-12 pt-20 pb-14 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1">
          <Link to="/">
            <span className="text-2xl text-paper">
              <Wordmark />
            </span>
          </Link>
          <p className="mt-4 font-serif italic text-paper/50 text-sm leading-relaxed max-w-[16rem]">
            {brand.taglineAlt}
          </p>
        </div>

        <div>
          <p className="label text-clay mb-4">Explore</p>
          <ul className="space-y-2.5 list-none">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-paper/65 hover:text-paper text-sm transition-colors link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label text-clay mb-4">Visit</p>
          <address className="not-italic text-paper/65 text-sm leading-relaxed">
            {contact.addressLines.map((line) => <div key={line}>{line}</div>)}
          </address>
          <div className="mt-3 space-y-1">
            {contact.hours.map((h) => (
              <div key={h.day} className="flex justify-between gap-4 text-[13px] text-paper/50">
                <span>{h.day}</span><span className="font-mono">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="label text-clay mb-4">Say Hello</p>
          <ul className="space-y-2.5 list-none text-sm">
            <li><a href={contact.phoneHref} className="text-paper/65 hover:text-paper transition-colors link-underline">{contact.phone}</a></li>
            <li><a href={`mailto:${contact.email}`} className="text-paper/65 hover:text-paper transition-colors link-underline">{contact.email}</a></li>
            <li><a href={contact.instagramHref} target="_blank" rel="noreferrer" className="text-paper/65 hover:text-paper transition-colors link-underline">{contact.instagram}</a></li>
          </ul>
        </div>
      </div>

      {/* oversized wordmark */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          className="border-t border-paper/10 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="block font-serif text-[15vw] leading-[0.85] tracking-tight text-paper/[0.07] select-none pointer-events-none">
            {brand.markA} &amp; {brand.markB}
          </span>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="px-6 md:px-12 py-6 border-t border-paper/10 flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.14em] text-paper/40 uppercase">
          &copy; {year} {brand.name} — {brand.city}
        </p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-paper/30 uppercase">
          {brand.tagline}
        </p>
      </div>
    </footer>
  )
}
