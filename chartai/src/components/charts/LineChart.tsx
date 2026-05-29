import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { easeOutCubic } from "./easing";

/**
 * Line chart with a "drawing" entrance — uses the classic SVG
 * `pathLength` + `stroke-dashoffset` technique so the line literally
 * draws itself across the canvas. Filled area fades in on top.
 */
export function LineChart({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  const data = config.data;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(0, ...data.map((d) => d.value));

  const W = 900;
  const H = 480;
  const pad = { l: 60, r: 40, t: 30, b: 60 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const points = data.map((d, i) => {
    const x = pad.l + (innerW * i) / Math.max(1, data.length - 1);
    const y = pad.t + innerH - ((d.value - min) / (max - min || 1)) * innerH;
    return { x, y, d };
  });

  const linePath = smoothPath(points.map((p) => [p.x, p.y]));
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${pad.t + innerH}` +
    ` L ${points[0].x} ${pad.t + innerH} Z`;

  const eased = easeOutCubic(progress);
  // Line draws over the first 70% of the timeline, points/area fade in last 30%.
  const drawProgress = Math.min(1, progress / 0.7);
  const fadeProgress = Math.max(0, (progress - 0.7) / 0.3);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    >
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={config.palette.primary} stopOpacity={0.45} />
          <stop offset="100%" stopColor={config.palette.primary} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + innerH * (1 - t);
        return (
          <g key={t}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
            <text
              x={pad.l - 10}
              y={y + 4}
              fontSize={12}
              fill="rgba(255,255,255,0.35)"
              textAnchor="end"
              fontWeight={500}
            >
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}

      {/* area */}
      <path
        d={areaPath}
        fill="url(#lineFill)"
        opacity={fadeProgress}
      />

      {/* line — drawn via stroke-dasharray trick */}
      <DrawnPath
        d={linePath}
        color={config.palette.primary}
        progress={drawProgress}
      />

      {/* points */}
      {points.map((p, i) => {
        const localFade = Math.max(
          0,
          Math.min(1, (eased - 0.55 - i * 0.04) / 0.4)
        );
        return (
          <g key={p.d.id} opacity={localFade}>
            <circle
              cx={p.x}
              cy={p.y}
              r={6}
              fill={config.palette.primary}
              stroke="#06080B"
              strokeWidth={3}
            />
            <text
              x={p.x}
              y={p.y - 14}
              fontSize={12}
              textAnchor="middle"
              fill={config.palette.text}
              fontWeight={700}
            >
              {p.d.value}
            </text>
            <text
              x={p.x}
              y={H - pad.b + 24}
              fontSize={12}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontWeight={500}
            >
              {p.d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DrawnPath({
  d,
  color,
  progress,
}: {
  d: string;
  color: string;
  progress: number;
}) {
  // We use stroke-dasharray with `pathLength=1` so we can drive the
  // visible portion using a unit progress value — same on web preview
  // and Remotion server render, no measureLength dance required.
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      style={{
        filter: `drop-shadow(0 0 12px ${color}66)`,
      }}
    />
  );
}

/** Convert points into a smooth bezier path (Catmull-Rom approximation). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
  const d: string[] = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`);
  }
  return d.join(" ");
}
