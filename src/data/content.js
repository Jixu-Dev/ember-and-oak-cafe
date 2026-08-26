// ══════════════════════════════════════════════════════════════
//  EMBER & OAK — Content source of truth
//  A small-batch coffee roaster in Portland, OR. All copy, menu,
//  brand details and asset paths live here so pages stay clean.
// ══════════════════════════════════════════════════════════════

export const brand = {
  name: 'Ember & Oak',
  markA: 'Ember',
  markB: 'Oak',
  kind: 'Coffee Roasters',
  est: '2016',
  city: 'Portland, Oregon',
  neighborhood: 'Alberta Arts District',
  tagline: 'Roasted slow. Poured with intention.',
  taglineAlt: 'Small-batch coffee for people who like to linger.',
}

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// ── Home cinematic frame sequence ────────────────────────────
// 200 source frames live in /public/frames/home. We sample an
// evenly-spaced subset for smooth scroll-scrubbing without
// preloading ~10MB of imagery.
const TOTAL_HOME_FRAMES = 200
const HOME_FRAME_COUNT = 120

export const homeFrames = Array.from({ length: HOME_FRAME_COUNT }, (_, i) => {
  const n = Math.round((i / (HOME_FRAME_COUNT - 1)) * (TOTAL_HOME_FRAMES - 1)) + 1
  return `/frames/home/ezgif-frame-${String(n).padStart(3, '0')}.jpg`
})

// Captions revealed as the scrubbed sequence advances (progress 0→1)
export const heroCaptions = [
  { from: 0.00, to: 0.16, index: '01', text: 'It starts with the bean.' },
  { from: 0.16, to: 0.34, index: '02', text: 'Roasted in small batches, never rushed.' },
  { from: 0.34, to: 0.54, index: '03', text: 'Ground fresh, the moment you order.' },
  { from: 0.54, to: 0.74, index: '04', text: 'Bloomed, then coaxed into espresso.' },
  { from: 0.74, to: 0.90, index: '05', text: 'Milk folds into crema.' },
  { from: 0.90, to: 1.01, index: '06', text: 'Your cup — poured with intention.' },
]

// ── Home: manifesto / intro ──────────────────────────────────
export const manifesto = {
  kicker: 'Est. 2016 · Alberta Arts District',
  lead: 'We believe a good cup is worth slowing down for.',
  body: [
    'Ember & Oak began in a narrow storefront on NE Alberta Street with one drum roaster, a stack of mismatched chairs, and a stubborn idea: that coffee tastes better when nobody is in a hurry.',
    'Eight years on, we still roast in small batches, still learn our farmers by name, and still pull every shot by hand. No conveyor belts. No shortcuts. Just the long, warm ritual of turning a bean into a morning.',
  ],
}

// ── Home: the ritual (scroll-revealed steps) ─────────────────
export const ritual = [
  {
    no: '01',
    title: 'Source',
    subtitle: 'Direct Farm Relationships',
    text: 'Green beans from 40+ small farms, bought on authentic long-term relationships — never on the anonymous spot market.',
    metric: '40+ Farms',
    detail: '1,800m+ Elevation',
  },
  {
    no: '02',
    title: 'Roast',
    subtitle: 'Cast-Iron Drum Roasting',
    text: 'Weekly, in 12-kilo batches, on a 1960s cast-iron drum roaster we carefully tune and refuse to retire.',
    metric: '12 kg Batches',
    detail: 'Slow Drum Profile',
  },
  {
    no: '03',
    title: 'Grind',
    subtitle: 'Precision Burr Dial-In',
    text: 'Dialed in every morning to the day’s humidity and atmospheric pressure. Freshly ground per single cup.',
    metric: 'Micron Dialed',
    detail: 'Per-Cup Fresh',
  },
  {
    no: '04',
    title: 'Pour',
    subtitle: 'Handcrafted Extraction',
    text: 'Pulled by hand by trained baristas at exactly nine bars of pressure and sixty-five degrees Celsius.',
    metric: '9 Bar / 65°C',
    detail: 'Silky Microfoam',
  },
]

// ── Home: Roast Spectrum & Flavor Matrix ─────────────────────
export const roastSpectrum = [
  {
    id: 'light',
    name: 'Single Origin Light',
    origin: 'Yirgacheffe, Ethiopia',
    elevation: '2,100 MASL',
    notes: ['Bergamot', 'Jasmine', 'Candied Lemon', 'Wild Honey'],
    process: 'Washed · Heirloom Varietal',
    acidity: 92,
    body: 45,
    sweetness: 80,
    bestFor: 'Pour Over & AeroPress',
    description: 'Crisp and tea-like with delicate floral aromatics and sparkling citrus brightness that dances on the palate.',
  },
  {
    id: 'medium',
    name: 'Alberta Sunrise Medium',
    origin: 'Huila, Colombia',
    elevation: '1,750 MASL',
    notes: ['Brown Sugar', 'Fuji Apple', 'Roasted Pecan', 'Milk Chocolate'],
    process: 'Fully Washed · Castillo & Caturra',
    acidity: 65,
    body: 75,
    sweetness: 90,
    bestFor: 'Drip & Balanced Espresso',
    description: 'Our most beloved everyday cup. Harmonious balance of juicy stone fruit sweetness and warm toasted nut undertones.',
  },
  {
    id: 'ember-dark',
    name: 'Ember Hearth Dark',
    origin: 'Antigua Guatemala & Sumatra',
    elevation: '1,600 MASL',
    notes: ['Dark Cocoa', 'Black Cherry', 'Smoked Cedar', 'Molasses'],
    process: 'Wet-Hulled & Washed Blend',
    acidity: 30,
    body: 95,
    sweetness: 65,
    bestFor: 'Cortado, Latte & French Press',
    description: 'Rich, syrupy and decadent. Heavy mouthfeel with layers of bittersweet chocolate and lingering caramelized oak finish.',
  },
]

// ── Home: values ─────────────────────────────────────────────
export const values = [
  { mark: '◦', title: 'Traceable Sourcing', text: 'Every bean is tied to a farm, a harvest, and a fair price we’re proud to name.' },
  { mark: '◦', title: 'Roasted In-House', text: 'We roast on-site each week so what’s in your cup is never more than days old.' },
  { mark: '◦', title: 'Made By Hand', text: 'No superautomatics. Six weeks of training before a barista pulls their first shot.' },
  { mark: '◦', title: 'A Third Place', text: 'Free water, slow wifi, and a standing invitation to stay as long as you like.' },
]

// ── Home: numbers ────────────────────────────────────────────
export const stats = [
  { value: '8', suffix: 'yrs', label: 'On Alberta Street' },
  { value: '42', suffix: '', label: 'Farm partners' },
  { value: '12', suffix: 'kg', label: 'Per roast batch' },
  { value: '1', suffix: '', label: 'Roaster, still' },
]

export const quote = {
  text: 'The best coffee city in America hides its finest cup down a side street in Portland.',
  source: 'The Roast Journal',
}

// ── Menu (18 items across three sections) ────────────────────
export const menu = [
  {
    id: 'espresso',
    title: 'Espresso Bar',
    note: 'Our house blend unless a single origin is noted on the board.',
    items: [
      { name: 'Espresso', desc: 'Pulled short and syrupy, house blend', price: '3.50' },
      { name: 'Macchiato', desc: 'Espresso stained with a spoon of foam', price: '4.00' },
      { name: 'Cortado', desc: 'Equal parts espresso and warm milk', price: '4.50' },
      { name: 'Cappuccino', desc: 'Espresso, steamed milk, a cap of dry foam', price: '5.00' },
      { name: 'Flat White', desc: 'Double ristretto under velvety microfoam', price: '5.25' },
      { name: 'Latte', desc: 'Silky steamed milk, rosetta on top', price: '5.50', badge: 'Oat +.75' },
      { name: 'Pour Over', desc: 'Single origin of the week, brewed to order', price: '6.00' },
      { name: 'Cold Brew', desc: 'Steeped twenty hours, poured over ice', price: '5.50' },
    ],
  },
  {
    id: 'not-coffee',
    title: 'Not Coffee',
    note: 'For the tea drinkers, the kids, and the after-four crowd.',
    items: [
      { name: 'Matcha Latte', desc: 'Ceremonial grade, whisked, oat milk', price: '6.00', badge: 'Vegan' },
      { name: 'London Fog', desc: 'Earl Grey, vanilla, steamed milk', price: '5.00' },
      { name: 'Masala Chai', desc: 'House-spiced and simmered, never a syrup', price: '5.25' },
      { name: 'Golden Turmeric', desc: 'Turmeric, ginger, black pepper, honey', price: '5.50', badge: 'Vegan opt.' },
      { name: 'Drinking Chocolate', desc: '70% single-origin, steamed whole milk', price: '5.50' },
    ],
  },
  {
    id: 'kitchen',
    title: 'From The Kitchen',
    note: 'Baked in-house each morning. Available all day, while they last.',
    items: [
      { name: 'Almond Croissant', desc: 'Twice-baked, frangipane, powdered sugar', price: '5.00' },
      { name: 'Avocado Toast', desc: 'Sourdough, chili crisp, radish, sea salt', price: '12.00', badge: 'Vegan' },
      { name: 'Ricotta & Honey Toast', desc: 'Whipped ricotta, wildflower honey, thyme', price: '10.50' },
      { name: 'Seasonal Galette', desc: 'Ask about today’s fruit or savory', price: '6.50', badge: 'Seasonal' },
      { name: 'Morning Grain Bowl', desc: 'Steel-cut oats, coconut, roasted pear, seeds', price: '9.50', badge: 'Vegan' },
    ],
  },
]

// A few items surfaced on the home page with enriched tasting badges
export const featured = [
  {
    name: 'Flat White',
    desc: 'Double ristretto extracted short over textured microfoam with subtle caramel sweetness.',
    price: '5.25',
    tag: 'House Signature',
    notes: 'Toffee · Cocoa · Cream',
  },
  {
    name: 'Pour Over',
    desc: 'Single origin of the week, freshly ground and hand-dripped at 204°F for clean clarity.',
    price: '6.00',
    tag: 'Ethiopia Yirgacheffe',
    notes: 'Jasmine · Peach · Citrus',
  },
  {
    name: 'Almond Croissant',
    desc: 'Twice-baked butter pastry filled with rich almond frangipane and dusted with powdered sugar.',
    price: '5.00',
    tag: 'Daily Bake',
    notes: 'Vanilla · Toasted Almond',
  },
]

// ── About page copy ──────────────────────────────────────────
export const about = {
  kicker: 'Our Story',
  title: 'Eight years on the same street corner.',
  intro: 'We never planned to open a café. We planned to roast good coffee and see who showed up. It turns out a lot of people will linger for a cup made slowly.',
  story: [
    {
      heading: 'How it started',
      body: 'In the spring of 2016 we signed a lease on a narrow, sun-starved storefront on NE Alberta because the rent was cheap and the corner caught the morning light. We put a drum roaster in the back, borrowed a dozen chairs, and started roasting twelve kilos at a time. The first week we sold nine coffees a day. We kept roasting anyway.',
    },
    {
      heading: 'How it’s going',
      body: 'Today we work with more than forty small farms, roast every week on the same stubborn machine, and train each barista for six weeks before they pull a shot on the floor. The chairs still don’t match. The corner still catches the light. And most mornings, if you come early, you’ll find a line out the door of people in no particular hurry.',
    },
  ],
}

// ── Team / Barista Spotlight ─────────────────────────────────
export const team = [
  {
    name: 'Elena Marsh',
    role: 'Lead Barista',
    bio: 'Six years behind the bar, two latte art championships, and still pulls every shot like it\'s her first.',
    image: '/team/barista-1.jpg',
  },
  {
    name: 'James Whitfield',
    role: 'Head Roaster',
    bio: 'Spent three years on coffee farms in Colombia before bringing his obsession home to Portland.',
    image: '/team/barista-2.jpg',
  },
  {
    name: 'Sofia Reyes',
    role: 'Pastry Chef',
    bio: 'Classically trained in Lyon, happiest at 4 AM with flour on her hands and croissants in the oven.',
    image: '/team/barista-3.jpg',
  },
]

// ── Contact details ──────────────────────────────────────────
export const contact = {
  addressLines: ['2847 NE Alberta Street', 'Portland, OR 97211'],
  phone: '(503) 555-0184',
  phoneHref: 'tel:+15035550184',
  email: 'hello@emberandoak.coffee',
  instagram: '@emberandoak',
  instagramHref: 'https://instagram.com',
  hours: [
    { day: 'Monday – Friday', time: '7:00 – 18:00' },
    { day: 'Saturday', time: '8:00 – 17:00' },
    { day: 'Sunday', time: '8:00 – 16:00' },
  ],
  // Google Maps embed centered on the Alberta Arts District (no API key needed)
  mapEmbed: 'https://www.google.com/maps?q=NE+Alberta+St,+Portland,+OR+97211&z=15&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=NE+Alberta+St+Portland+OR+97211',
}

// ── Legacy aliases (kept so no stray import breaks) ───────────
export const menuData = menu
export const valuesData = values
export const heroFrames = homeFrames
export const sectionFrames = { home: homeFrames }
