# ChartAI

Animated chart generator — turn raw data into cinematic charts and export them
as ultra-HD images (PNG / JPG / SVG) or 1080p MP4 videos.

Built with Next.js 14, React 18, Tailwind, Framer Motion, Remotion, and FFmpeg.

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000> for the marketing page or
<http://localhost:3000/dashboard> to launch the studio.

## Architecture

The same chart components are used for the live preview and the server-side
MP4 render. Each chart is a **pure function of `progress` ∈ [0, 1]**, which
means:

- the live preview drives `progress` from a `requestAnimationFrame` loop, and
- Remotion drives `progress` from `useCurrentFrame() / durationInFrames`.

Result: what you see in the preview is exactly what gets rendered into the
MP4, frame for frame.

```
src/
├─ app/
│  ├─ page.tsx                        marketing landing page
│  ├─ dashboard/page.tsx              the studio
│  └─ api/render/                     Remotion render API (start / poll / download)
├─ components/
│  ├─ charts/                         6 chart types (pie/doughnut/bar/line/comparison/circular)
│  ├─ dashboard/                      sidebar / workspace / right panel
│  └─ ui/                             buttons, panels, fields, color pickers, sliders
├─ lib/
│  ├─ exportImage.ts                  PNG / JPG / SVG export via html-to-image
│  ├─ exportVideo.ts                  client-side render lifecycle (start → poll → download)
│  ├─ renderJobs.ts                   in-memory job registry with progress tracking
│  ├─ ai.ts                           offline chart-type recommender + insight text
│  ├─ presets.ts                      defaults, social-media size presets, color helpers
│  └─ types.ts                        shared types
├─ remotion/
│  ├─ Root.tsx                        Remotion root composition
│  ├─ ChartComposition.tsx            maps frame → progress → ChartRenderer
│  └─ webpack-override.ts             teaches Remotion's bundler the `@/*` path alias
└─ store/useChartStore.ts             Zustand store holding the central ChartConfig
```

## Video export

The `/api/render` endpoint:

1. Bundles the Remotion entry once and caches the bundle URL.
2. Spawns headless Chromium per requested frame, captures it, and stitches the
   frames into an H.264 MP4 using the bundled FFmpeg.
3. Tracks progress in an in-memory job registry. The client polls
   `/api/render/[id]` and downloads from `/api/render/[id]/download` when
   `status === "done"`.

### Chromium dependencies

Remotion auto-downloads Chrome Headless Shell on first render. On Linux it
needs the standard headless-Chrome system libs: `nss`, `nss-util`, `nss-softokn`,
`nss-softokn-freebl`, `at-spi2-atk`, `cups-libs`, `libdrm`, `libxkbcommon`,
`libXcomposite`, `libXdamage`, `libXfixes`, `libXrandr`, `mesa-libgbm`,
`alsa-lib`, `pango`, `cairo`, `gtk3`. These are present by default on Vercel,
AWS Lambda (when using `@sparticuz/chromium`), and Docker images based on
`node:*-slim` + the puppeteer install hint.

For container deployments, the simplest option is the Remotion-recommended
base image:

```Dockerfile
FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libasound2 libpango-1.0-0 libcairo2 libgtk-3-0
```

## Brand identity

- **Primary**: `#1FBBE8` (cyan)
- **Surfaces**: `#06080B` (ink-950) base + glass panels
- **Type**: Manrope (400 / 500 / 600 / 700 / 800)

All values live in `tailwind.config.ts` and `src/app/globals.css`.
