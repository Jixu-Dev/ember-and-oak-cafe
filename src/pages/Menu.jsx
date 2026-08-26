import { motion } from 'framer-motion'
import Reveal, { EASE } from '../components/Reveal'
import { Badge, ButtonLink } from '../components/ui'
import { brand, menu } from '../data/content'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.4 } },
}

export default function Menu() {
  return (
    <motion.main
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="bg-paper pt-32 md:pt-40" aria-label="Menu"
    >
      {/* header */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto">
        <Reveal><p className="label text-clay mb-6">The Board · {brand.city}</p></Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <Reveal delay={0.05}>
            <h1 className="font-serif font-light text-ink leading-[0.9] tracking-tight text-6xl md:text-8xl">
              Everything<br />we pour.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-ink/60 font-light max-w-sm leading-relaxed">
              Prices in USD. Oat, almond and soy always available. Ask your barista about
              this week’s single origin — it changes with what’s fresh.
            </p>
          </Reveal>
        </div>

        {/* framed still */}
        <Reveal delay={0.1} className="mt-14">
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden ring-1 ring-ink/15 shadow-[0_40px_120px_-50px_rgba(35,25,15,0.5)]">
            <img src="/frames/home/ezgif-frame-200.jpg" alt="Milk poured into fresh espresso"
              className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.18em] uppercase text-paper/80">Today’s pour</span>
          </div>
        </Reveal>
      </section>

      {/* categories */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto py-20 md:py-28 space-y-24">
        {menu.map((cat, ci) => (
          <div key={cat.id} className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-8 lg:gap-16">
            <div className="lg:sticky lg:top-28 h-fit">
              <Reveal>
                <span className="font-mono text-clay text-sm">0{ci + 1}</span>
                <h2 className="font-serif font-light text-ink text-4xl md:text-5xl tracking-tight mt-3">{cat.title}</h2>
                <p className="text-ink/55 text-sm font-light mt-4 max-w-xs leading-relaxed">{cat.note}</p>
              </Reveal>
            </div>
            <ul className="list-none divide-y divide-ink/10 border-t border-ink/10">
              {cat.items.map((item, i) => (
                <Reveal as="li" key={item.name} delay={i * 0.05} className="py-5 group">
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-serif text-xl md:text-2xl text-ink group-hover:text-clay transition-colors duration-200">
                      {item.name}
                    </h3>
                    {item.badge && <Badge>{item.badge}</Badge>}
                    <span className="flex-1 border-b border-dotted border-ink/25 translate-y-[-4px]" />
                    <span className="font-mono text-sm text-ink/70">${item.price}</span>
                  </div>
                  <p className="text-ink/50 text-sm font-light mt-1.5 max-w-md">{item.desc}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-sand px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <Reveal>
            <h2 className="font-serif font-light text-ink text-4xl md:text-5xl tracking-tight">Hungry yet?</h2>
            <p className="text-ink/60 font-light mt-3">We’re on the corner of NE Alberta &amp; 29th. Come find your usual.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink to="/contact">Plan Your Visit ↗</ButtonLink>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
