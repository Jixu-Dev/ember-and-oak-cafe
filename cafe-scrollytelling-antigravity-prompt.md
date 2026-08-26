# Cafe Scrollytelling Website — Master Build Prompt (for Antigravity)

This doc has 3 parts:
1. **Video generation prompts** — for an AI video tool (Veo / Runway / Kling / Sora) to generate the raw footage
2. **Frame extraction instructions** — turning that video into a scrubbable image sequence
3. **The full build prompt** — paste this into Antigravity to build the entire site

---

## PART 1 — Video Generation Prompts

Generate each as a separate clip, **locked-off static camera, no camera movement, no cuts, single continuous motion**, 8–10 seconds each, 24fps, landscape 16:9 at minimum 1920x1080 (higher if the tool allows — you'll be extracting frames, so resolution matters).

### Clip 1 — Hero sequence: "Bean to Cup" (main scroll-driver)
```
A cinematic macro shot on a warm wooden table, soft golden studio lighting from
the top-left, shallow depth of field. The sequence begins with a small pile of
raw green coffee beans. The beans slowly transform/dissolve into roasted dark
brown beans (roasting effect, subtle smoke wisp). The roasted beans then morph
into ground coffee powder, forming a small mound. The ground coffee transitions
into espresso pouring into a white ceramic cup from top of frame, crema forming.
Finally, a barista's hand enters frame holding a small pitcher and pours steamed
milk into the espresso, forming a rosetta latte art pattern, camera holds static
as the finished latte sits centered in frame. Warm color grade, cream and brown
tones, soft shadows, no text, no logos, no people's faces, product-photography
style, continuous single take, smooth morphing transitions between each stage.
```

### Clip 2 — About section: "Empty to Full"
```
Static wide shot of a cozy, empty cafe interior at dawn — wooden tables, warm
pendant lighting, sunlight starting to stream through large front windows,
steam rising faintly from an unattended espresso machine in the background.
Over the duration of the clip, the light gradually warms and brightens as if
time is passing from early morning to mid-morning, chairs remain empty, no
people, camera completely static, focus on the empty room filling with warm
light. Muted terracotta and cream tones, film-photography grain, cozy and
inviting mood.
```

### Clip 3 — Menu section: "Ingredients assembling"
```
Overhead flat-lay shot on a rustic wooden surface, soft natural light. Coffee
beans, a croissant, milk being poured from off-frame, and mint leaves slide
into frame from different edges and arrange themselves into a neat, styled
flat-lay composition centered in the shot. Smooth, elegant motion, no camera
movement, shallow depth of field, warm editorial food-photography style, cream
and brown palette, minimal and clean.
```

### Clip 4 — Contact section: "Cup on table, steam rising"
```
Static close shot of a single ceramic coffee cup on a wooden table by a window,
soft steam continuously rising from the cup, warm late-afternoon light shifting
gently across the frame, out-of-focus greenery visible through the window in
the background, calm and quiet mood, cinematic warm color grade, no people,
no text.
```

**Notes for the video tool:**
- Always specify "static camera" / "no camera movement" — panning or zooming ruins scroll-scrub because scroll position needs to map to a *linear* visual change, not camera motion.
- Ask for the highest frame rate and resolution the tool supports — you'll be sampling frames out of this, and fewer source frames = jerkier scroll.
- If the tool supports "seed" locking or "extend clip," generate each clip in one continuous pass rather than stitching multiple generations — morphing artifacts at stitch points look bad on scroll-scrub.

---

## PART 2 — Frame Extraction (ffmpeg)

Once you have the 4 video clips (`hero.mp4`, `about.mp4`, `menu.mp4`, `contact.mp4`), extract frames like this:

```bash
# Extract ~80 evenly spaced frames per clip, output as WebP for smaller payload
mkdir -p frames/hero frames/about frames/menu frames/contact

ffmpeg -i hero.mp4 -vf "fps=8" -q:v 80 frames/hero/frame_%03d.webp
ffmpeg -i about.mp4 -vf "fps=8" -q:v 80 frames/about/frame_%03d.webp
ffmpeg -i menu.mp4 -vf "fps=8" -q:v 80 frames/menu/frame_%03d.webp
ffmpeg -i contact.mp4 -vf "fps=8" -q:v 80 frames/contact/frame_%03d.webp

# Resize to a web-friendly max width (keeps aspect ratio) to cut file size further
for f in frames/hero/*.webp; do
  cwebp -resize 1600 0 "$f" -o "$f"
done
```

Target: 60–80 frames per sequence, each frame under ~80KB. That's roughly 4–6MB per sequence — preload with a loading screen (see build prompt below).

---

## PART 3 — Full Build Prompt (paste into Antigravity)

```
Build a scrollytelling cafe website called "[Cafe Name]" using frame-sequence
scroll-scrub animation (like Apple's product pages). Use HTML/CSS/vanilla JS
with GSAP + ScrollTrigger. No frameworks needed unless you think Next.js is
cleaner for asset handling — your call, but keep it lightweight.

## TECH APPROACH
- GSAP ScrollTrigger with `scrub: true` (near-zero-lag start/stop tied
  directly to scroll position, not eased/delayed)
- Each section is pinned (`pin: true`) while its frame sequence plays, then
  unpins and scrolls normally into the content reveal
- Frame sequences render on <canvas>, not <img> swapping, for performance —
  preload all frames for a sequence into an Image array before that section
  can be scrolled into
- Show a loading screen (simple animated logo mark + progress %) while the
  hero sequence's ~80 frames preload on first page load. Subsequent section
  sequences can lazy-load as the user approaches them (start loading when
  previous section is ~50% scrolled)
- Fully responsive: on mobile, either use a lower-frame-count/smaller-res
  version of the same sequences, or fall back to a static hero image with a
  simpler fade/slide scroll animation — full canvas frame-scrub is
  desktop-first, don't let it wreck mobile performance
- Respect prefers-reduced-motion: fall back to static images + simple fades

## ASSET STRUCTURE
/frames/hero/frame_001.webp ... frame_080.webp
/frames/about/frame_001.webp ... frame_060.webp
/frames/menu/frame_001.webp ... frame_060.webp
/frames/contact/frame_001.webp ... frame_060.webp

## DESIGN SYSTEM
Colors:
- --cream: #F5EFE6 (background, light sections)
- --espresso: #2B1D14 (text, dark sections)
- --roasted-brown: #6B4226 (primary accent, buttons)
- --terracotta: #C4703B (CTA/highlight accent)
- --sage: #8A9B6E (secondary accent, used sparingly)
- --warm-white: #FFFDF9 (cards, panels)

Typography:
- Headlines: "Fraunces" (serif, Google Fonts), large scale, tight tracking,
  weight 500-600
- Body/UI: "General Sans" or "Inter" (Google Fonts fallback), weight 400-500
- Accents/labels/prices: "Space Mono" or "JetBrains Mono", small caps, wide
  letter-spacing (0.08em+), used for menu prices, section tags, "vegan"
  labels etc.

Texture: apply a subtle noise/grain overlay (SVG or CSS, 5-8% opacity) across
the whole site so the warm palette doesn't look flat/digital.

## SECTION-BY-SECTION BUILD

### 1. HERO (pinned, hero frame sequence: "Bean to Cup")
- Full-viewport pinned section, canvas plays frame_001 → frame_080 as user
  scrolls through this section's scroll distance (make the pin duration
  ~300-400vh so the scrub doesn't feel rushed)
- On load (before scroll starts): headline "Good Coffee, Better Mornings."
  fades in over frame_001, subheadline below it, small "scroll to explore"
  indicator with a subtle bounce animation
- As user scrolls and frames advance, fade the headline out by ~20% scroll
  progress so the cup transformation is unobstructed
- At 100% scroll progress (frame_080, finished latte), the cup image should
  visually "settle" — animate it shrinking slightly and sliding to the left
  third of the viewport, then unpin
- Once settled, content panel slides in from the right: "More Than Just
  Coffee" teaser text + [Read Our Story] button (use About-page copy from
  the content doc)

### 2. ABOUT (pinned, about frame sequence: "Empty to Full")
- Similar pin/scrub pattern, shorter pin duration (~200vh)
- Frame sequence plays as background/full-bleed, dims via a soft dark
  overlay gradient at ~40% scroll for text legibility
- Once unpinned: full About content flows in — origin story, values grid
  (4 cards: Quality First, Sustainability, Community, Craft), team section
  if applicable
- Use content from the "About" section of the content doc already written

### 3. MENU (pinned, menu frame sequence: "Ingredients assembling")
- Shorter pin (~150vh), frame sequence settles into a still flat-lay image
  that stays as a sticky background/side panel
- Menu items reveal with staggered fade+slide-up as user scrolls past,
  grouped into Coffee / Non-Coffee / Food tables (reuse pricing table from
  content doc)
- Price and category tags use the monospace accent font

### 4. CONTACT (pinned, contact frame sequence: "Cup on table, steam rising")
- Short, calm pin (~100vh) — steam animation just plays out naturally as a
  looping ambient background once settled, doesn't need heavy scroll-driven
  frame control like the earlier sections (can just be a slow autoplay video/
  gif-like loop here instead of scroll-scrubbed, since it's the closing mood
  beat, not a driver)
- Contact form (Name, Email, Phone, Message, Send button), address/hours/
  phone/email/Instagram block, embedded map
- Closing line + soft fade to footer

## PERFORMANCE CHECKLIST
- Preload hero frames with a visible loading percentage before allowing scroll
- Lazy-load subsequent sections' frames as user approaches (IntersectionObserver
  at ~50% of previous section)
- Use `will-change: transform` sparingly, only on actively animating canvas/
  elements, remove after animation completes
- Compress all frames to WebP, target <80KB each
- Debounce/throttle resize handlers; recalculate ScrollTrigger pin distances
  on resize
- Lighthouse target: 90+ performance on desktop, 80+ on mobile

## CONTENT
Use the full copy (headlines, about story, menu items with prices, contact
details) from the "Cafe Website — Content Template" doc — replace placeholder
brackets like [Cafe Name], [Founder Name], [Year] with real details once
provided.

Build this as a single-page site (all 4 sections + contact on one scrollable
page, anchor-linked nav), not separate pages — scrollytelling works best as
one continuous scroll.
```

---

### Before you run this
Fill in your real cafe name, founder name(s), opening year, and city so Antigravity doesn't ship placeholder text — want me to update the content doc with those once you have them?
