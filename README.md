# Vectra Logistics — 3D Animated Website

React + CSS logistics website with a real Three.js 3D globe, GSAP scroll
animations, parallax effects, 3D tilt cards, photo gallery, video showcase,
and dark/light mode.

## Chalane ka tarika (Setup)

1. Node.js install hona chahiye (v16+). Terminal me project folder ke andar jao:
   ```
   cd vectra-logistics
   ```
2. Dependencies install karo:
   ```
   npm install
   ```
3. Dev server start karo:
   ```
   npm start
   ```
4. Browser me khulega: `http://localhost:3000`

## Folder structure

```
src/
  App.jsx / App.css        -> Sabhi sections ko jodta hai
  index.js / index.css     -> Entry point + global theme tokens
  context/
    ThemeContext.jsx        -> Dark / Light mode logic
  components/
    Navbar.jsx / Navbar.css
    Hero.jsx / Hero.css              -> 3D tilt cards + animated route line
    VideoShowcase.jsx / .css         -> Cinematic video section (play/mute + parallax zoom)
    Services.jsx / Services.css      -> 3D hover tilt cards (freight modes)
    About.jsx / About.css            -> Real Three.js 3D rotating network globe
    Globe3D.jsx / Globe3D.css        -> The Three.js globe itself (react-three-fiber)
    Gallery.jsx / Gallery.css        -> Photo gallery grid + lightbox
    Stats.jsx / Stats.css            -> Animated counters + parallax bg
    Testimonials.jsx / Testimonials.css
    Contact.jsx / Contact.css        -> 3D tilt quote form
    Footer.jsx / Footer.css
```

## Features

- **Real 3D (Three.js)** — `About` section has a live, draggable, auto-rotating
  3D globe (react-three-fiber) with glowing hub nodes and curved freight routes
- **Video section** — cinematic background video with custom play/pause + mute
  buttons and a scroll-driven parallax zoom
- **Gallery** — responsive photo grid with hover captions and a full keyboard-
  navigable lightbox (Esc to close, arrow keys to move between photos)
- **Dark / Light mode** — toggle button in navbar, saved to localStorage
- **GSAP animations** — page load entrance, scroll-triggered reveals (ScrollTrigger)
- **Parallax effects** — Stats, About and Video sections all have scroll parallax
- **3D tilt cards** — Hero metric cards, service cards, and contact form use
  CSS 3D transforms (perspective + rotateX/rotateY) that tilt on mouse move
- **Fully responsive** — tuned breakpoints down to small phones (≤480px),
  hamburger nav, stacked layouts, touch-friendly lightbox/gallery
- **Unique color palette** — "Cargo Night": navy ink background, teal + amber +
  violet accent gradient (no generic purple-blue gradient)

## Placeholder media — replace before launch

Do jagah abhi **placeholder media** use ho rahi hai (free, hotlink-safe
services) — launch se pehle apni real files se replace kar dena:

- **Gallery photos** (`src/components/Gallery.jsx`) — `picsum.photos`
  placeholder images. `PHOTOS` array me har photo ka `id` ya poora `src`
  apni image se badlo.
- **Showcase video** (`src/components/VideoShowcase.jsx`) — Google ka public
  sample video (`SAMPLE_VIDEO_SRC`). Apni real operations footage ka URL ya
  `import` kiya hua local `.mp4` file yahan daal do.

## Customize karne ke liye

- Colors: `src/index.css` me `:root[data-theme='dark']` aur `[data-theme='light']`
  ke CSS variables change karo
- Company name / copy: har component file me text seedha edit karo
- Logo: `Navbar.jsx` aur `Footer.jsx` me `__logo` wale hisse
- Globe hub cities / routes: `src/components/Globe3D.jsx` me `HUBS` aur
  `ROUTES` arrays edit karo

## Note

- Agar `npm start` par GSAP ScrollTrigger error aaye, confirm karo ki
  `gsap` package install hua hai — already `package.json` me listed hai.
- 3D globe ke liye `three`, `@react-three/fiber`, aur `@react-three/drei`
  bhi `package.json` me add hain — `npm install` sab khud le aayega.
