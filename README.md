# Prism

A launch site for a fictional AI product that turns messy company docs into cited, permission-aware answers. A concept site by [GLAZY](https://glazy-portfolio.vercel.app), a freelance web & SaaS agency.

**Live:** https://prism-glazy.vercel.app

## Technically interesting

- **Glass prism hero.** A procedural, bevelled prism in React Three Fiber using drei's `MeshTransmissionMaterial` (chromatic aberration, thickness, back-face refraction). It is lit by `Lightformer` panels, so no HDR file is downloaded, and custom shaders draw the beam and the spectrum.
- **No first-frame freeze.** Every glass shader variant is compiled in parallel with `compileAsync` before the first frame: the front faces and the back-face pass into a linear buffer. The 3D chunk starts downloading as soon as the hero module runs.
- **Opening sequence driven by real loading** (fonts, the 3D chunk, the first GPU frames, window load). Its beam lands on the hero prism. It plays once per session, `Esc` skips it, and reduced motion turns it off.
- **Fallbacks that keep the scene.** WebGL is checked before the canvas mounts. Software renderers, data saver, low memory and two-core devices get a static SVG of the same scene, which also serves as the poster while the 3D loads. Rendering stops off screen, and the pixel ratio drops if frames do.
- **Live mock-ups in HTML and CSS** in the feature grid, plus a sticky "How it works" panel, a pricing toggle and an accessible FAQ.
- **Test flags:** `?intro=1` / `?intro=0` force the opening on or off; `?hero=3d` / `?hero=static` force the hero mode.

## Stack

Next.js 16 (App Router, inlined CSS), React 19, TypeScript, Tailwind CSS 4, three.js, @react-three/fiber, @react-three/drei, Motion.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Credits and licences

- [Funnel Display](https://fonts.google.com/specimen/Funnel+Display), [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) and [Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono): SIL Open Font License 1.1, self-hosted through `next/font`.
- Everything else (the 3D scene, shaders, icons, illustrations and copy) was made for this project. Prism, the "trusted by" companies, the documents and the prices are fictional.
