import type { ChartConfig, DataPoint } from "./types";

export const SOCIAL_PRESETS: Record<
  ChartConfig["export"]["preset"],
  { width: number; height: number; label: string }
> = {
  square: { width: 1080, height: 1080, label: "Square 1:1" },
  portrait: { width: 1080, height: 1350, label: "Portrait 4:5" },
  landscape: { width: 1920, height: 1080, label: "Landscape 16:9" },
  story: { width: 1080, height: 1920, label: "Story 9:16" },
};

export const DEFAULT_DATA: DataPoint[] = [
  { id: "a", label: "Product", value: 42, compare: 30 },
  { id: "b", label: "Marketing", value: 28, compare: 22 },
  { id: "c", label: "Engineering", value: 18, compare: 25 },
  { id: "d", label: "Support", value: 12, compare: 14 },
];

export const DEFAULT_CONFIG: ChartConfig = {
  type: "bar",
  title: "Q4 Revenue Mix",
  subtitle: "Comparison across business units",
  data: DEFAULT_DATA,
  palette: {
    primary: "#1FBBE8",
    secondary: "#FFFFFF",
    accent: "#0E738B",
    background: "#06080B",
    text: "#E8F0F8",
  },
  animation: {
    duration: 1.6,
    easing: "smooth",
    delay: 0.1,
  },
  export: {
    imageScale: 3,
    videoFps: 60,
    videoSeconds: 5,
    watermark: false,
    brandLogo: null,
    preset: "landscape",
  },
};

/** Hint a value-to-percentage transform, used by pie/doughnut. */
export function toPercent(data: DataPoint[]) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  return data.map((d) => ({ ...d, percent: (d.value / total) * 100 }));
}

/** Generate a tonal palette from the brand primary. */
export function tonalPalette(primary: string, count: number): string[] {
  // Lightness ramp using HSL approximation derived from the hex.
  const out: string[] = [];
  const { h, s, l } = hexToHsl(primary);
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * 8;
    out.push(hslToHex(h, Math.min(95, s), clamp(l + offset, 25, 80)));
  }
  return out;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToHsl(hex: string) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
