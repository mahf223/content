// Standalone smoke test for the Remotion render pipeline. Runs the same
// bundle + renderMedia path used by /api/render/route.ts.
//
// Usage: node scripts/test-render.mjs

import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const config = {
  type: "bar",
  title: "Q4 Revenue Mix",
  subtitle: "Comparison across business units",
  data: [
    { id: "a", label: "Product", value: 42 },
    { id: "b", label: "Marketing", value: 28 },
    { id: "c", label: "Engineering", value: 18 },
    { id: "d", label: "Support", value: 12 },
  ],
  palette: {
    primary: "#1FBBE8",
    secondary: "#FFFFFF",
    accent: "#0E738B",
    background: "#06080B",
    text: "#E8F0F8",
  },
  animation: { duration: 1.6, easing: "smooth", delay: 0.1 },
  export: {
    imageScale: 3,
    videoFps: 30,
    videoSeconds: 2,
    watermark: true,
    brandLogo: null,
    preset: "landscape",
  },
};

console.log("[test-render] bundling…");
const { bundle } = await import("@remotion/bundler");
const { selectComposition, renderMedia } = await import("@remotion/renderer");

const aliasOverride = (cfg) => ({
  ...cfg,
  resolve: {
    ...cfg.resolve,
    alias: {
      ...(cfg.resolve?.alias ?? {}),
      "@": path.resolve(root, "src"),
    },
    extensions: Array.from(
      new Set([
        ...(cfg.resolve?.extensions ?? []),
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
      ])
    ),
  },
});

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/remotion/index.ts"),
  webpackOverride: aliasOverride,
  onProgress: (p) => process.stdout.write(`\r  bundle ${Math.round(p)}%`),
});
console.log("\n[test-render] bundle ready:", serveUrl);

const composition = await selectComposition({
  serveUrl,
  id: "Chart",
  inputProps: { config },
});

const composed = {
  ...composition,
  durationInFrames: config.export.videoFps * config.export.videoSeconds,
  fps: config.export.videoFps,
  width: 1920,
  height: 1080,
};

const out = path.join(root, "scripts/out.mp4");
await fs.mkdir(path.dirname(out), { recursive: true });

console.log("[test-render] rendering…");
await renderMedia({
  composition: composed,
  serveUrl,
  codec: "h264",
  outputLocation: out,
  inputProps: { config },
  pixelFormat: "yuv420p",
  crf: 18,
  concurrency: null,
  chromiumOptions: { gl: "swangle" },
  onProgress: ({ progress }) => {
    process.stdout.write(`\r  render ${Math.round(progress * 100)}%`);
  },
});

const stat = await fs.stat(out);
console.log(`\n[test-render] OK -> ${out} (${(stat.size / 1024).toFixed(1)} KB)`);
