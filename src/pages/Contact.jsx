import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal, { EASE } from '../components/Reveal'
import { brand, contact } from '../data/content'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.4 } },
}

const field = 'w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder-ink/35 font-light focus:border-clay focus:outline-none transition-colors'
const labelCls = 'font-mono text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1 block'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending'); setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(
        err.message?.includes('fetch') || err.name === 'TypeError'
          ? 'Couldn’t reach the server. Start it with “npm run server”, or email us directly.'
          : err.message
      )
    }
  }

  return (
    <motion.main
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="bg-paper pt-32 md:pt-40" aria-label="Contact"
    >
      {/* header */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal><p className="label text-clay mb-6">Say Hello</p></Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-serif font-light text-ink leading-[0.9] tracking-tight text-6xl md:text-8xl">
            Come by,<br />or drop a line.
          </h1>
        </Reveal>
      </section>

      {/* info + form */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-20 md:py-28 grid lg:grid-cols-2 gap-16">
        {/* info */}
        <div className="space-y-10">
          <Reveal>
            <p className={labelCls}>Find us</p>
            <address className="not-italic font-serif text-2xl md:text-3xl text-ink leading-snug">
              {contact.addressLines.map((l) => <div key={l}>{l}</div>)}
            </address>
            <a href={contact.mapLink} target="_blank" rel="noreferrer"
              className="inline-block mt-3 font-mono text-[11px] tracking-[0.16em] uppercase text-clay link-underline">
              Open in Google Maps ↗
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            <p className={labelCls}>Hours</p>
            <div className="space-y-1.5 max-w-xs">
              {contact.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-6 text-ink/70">
                  <span className="font-light">{h.day}</span>
                  <span className="font-mono text-sm">{h.time}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className={labelCls}>Reach us</p>
            <ul className="list-none space-y-2 text-ink/80">
              <li><a href={contact.phoneHref} className="link-underline">{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`} className="link-underline">{contact.email}</a></li>
              <li><a href={contact.instagramHref} target="_blank" rel="noreferrer" className="link-underline">{contact.instagram}</a></li>
            </ul>
          </Reveal>
        </div>

        {/* form */}
        <Reveal delay={0.1}>
          <div className="bg-card rounded-2xl p-8 md:p-10 ring-1 ring-ink/10 shadow-[0_30px_90px_-50px_rgba(35,25,15,0.4)]">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="ok" className="text-center py-10"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                  <div className="w-14 h-14 rounded-full bg-olive/15 text-olive flex items-center justify-center mx-auto mb-5 text-2xl">✓</div>
                  <h3 className="font-serif text-3xl text-ink mb-2">Thank you.</h3>
                  <p className="text-ink/60 font-light">We’ve got your note and we’ll be in touch soon — usually within a day.</p>
                  <button onClick={() => setStatus('idle')}
                    className="mt-6 font-mono text-[11px] tracking-[0.16em] uppercase text-clay link-underline">
                    Send another ↗
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div>
                    <label htmlFor="name" className={labelCls}>Name *</label>
                    <input id="name" required value={form.name} onChange={update('name')} className={field} placeholder="Jane Rivera" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className={labelCls}>Email *</label>
                      <input id="email" type="email" required value={form.email} onChange={update('email')} className={field} placeholder="jane@email.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelCls}>Phone</label>
                      <input id="phone" value={form.phone} onChange={update('phone')} className={field} placeholder="Optional" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className={labelCls}>Message *</label>
                    <textarea id="message" required rows={4} value={form.message} onChange={update('message')} className={`${field} resize-none`} placeholder="Catering, private events, or just to say the flat white was perfect…" />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-clay-deep font-light">{error}</p>
                  )}

                  <motion.button type="submit" disabled={status === 'sending'}
                    className="w-full font-mono text-[11px] tracking-[0.16em] uppercase px-8 py-4 rounded-full bg-clay text-card disabled:opacity-60"
                    whileHover={status !== 'sending' ? { scale: 1.02, backgroundColor: '#9E4626' } : {}}
                    whileTap={status !== 'sending' ? { scale: 0.98 } : {}}>
                    {status === 'sending' ? 'Sending…' : 'Send Message ↗'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      {/* map */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-24 md:pb-32">
        <Reveal>
          <div className="relative w-full h-[380px] md:h-[460px] rounded-2xl overflow-hidden ring-1 ring-ink/15">
            <iframe
              title={`Map to ${brand.name}`}
              src={contact.mapEmbed}
              className="w-full h-full border-0 grayscale-[0.2] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </motion.main>
  )
}
