# Prism

A launch site for **Prism**, a concept AI product that turns messy company docs into answers a team can trust: every answer cited to its source, filtered by who is allowed to see it.

Prism isn't a real product. It's a concept site designed and built by GLAZY to show what a modern product launch page can feel like.

**Live:** https://prism-glazy.vercel.app

## What's in it

- **Opening sequence.** A beam of white light crosses a dark screen, the PRISM wordmark resolves out of a red/green/blue split, and the percentage counts real loading (fonts, the 3D chunk, the first GPU frames, window load). The beam then swings aside onto the hero's glass prism, the same object it was landing on. It plays once per session, can be skipped with the button or `Esc`, and never plays with reduced motion turned on.
- **Glass prism hero.** A procedural, bevelled triangular prism rendered with React Three Fiber and drei's `MeshTransmissionMaterial` (chromatic aberration, thickness, back-face refraction). It's lit by a studio of `Lightformer`s, so no HDR file is downloaded. Custom shaders draw the incoming beam and the dispersed spectrum. The prism turns slowly and tilts toward the pointer.
- **Graceful fallbacks.** WebGL is checked before the canvas mounts. Software renderers, data saver, low memory or two-core devices get a static SVG version of the same scene, which also serves as the poster while the 3D loads. Rendering stops when the hero is off screen, and DPR is capped and lowered if frames drop.
- **Bento feature grid** with small live mock-ups in HTML and CSS: a search box that types its question, an answer whose citations light up their sources, a permissions switch, orbiting connectors, a live index counter and a low-confidence reply.
- **How it works**, with a sticky panel that follows the active step on desktop and inline panels on mobile. Then pricing with a monthly/yearly toggle, an accessible FAQ accordion, and a closing call to action.
- **Choreographed entrances** for every section, using Motion's staggered reveals.

Query flags for testing: `?intro=1` / `?intro=0` force the opening on or off, and `?hero=3d` / `?hero=static` force the hero mode.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [three.js](https://threejs.org), [@react-three/fiber](https://github.com/pmndrs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- [Motion](https://motion.dev) for React
- Fonts through `next/font`: Funnel Display, Instrument Sans and Fragment Mono

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes a production build and `npm run lint` runs ESLint.

## Accessibility and motion

- Semantic landmarks, ordered headings and a skip link. Every control is keyboard reachable: the menu, the billing period radio group, the accordion and the permissions switch.
- `prefers-reduced-motion` gets a still 3D render with no rotation or drift, no opening sequence, and fades instead of movement.
- The opening sequence keeps the page inert behind it and never shifts layout when it leaves.

## Credits

- Typefaces: [Funnel Display](https://fonts.google.com/specimen/Funnel+Display), [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) and [Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono), all under the SIL Open Font License 1.1, served through Google Fonts with `next/font`.
- Everything else (the 3D scene, shaders, icons, illustrations and copy) was made for this project. The company names in the "trusted by" row, the documents and the prices are fictional.

---

Concept site by GLAZY: https://glazy-portfolio.vercel.app
