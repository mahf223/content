import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { tonalPalette } from "@/lib/presets";
import { easeOutCubic } from "./easing";

export function BarChart({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  const data = config.data;
  const colors = tonalPalette(config.palette.primary, data.length);
  const max = Math.max(...data.map((d) => d.value), 1);

  const W = 900;
  const H = 480;
  const pad = { l: 60, r: 40, t: 30, b: 60 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const slot = innerW / data.length;
  const barW = Math.min(72, slot * 0.55);

  // Stagger so bars enter sequentially, then settle.
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    >
      {/* Y gridlines */}
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

      {data.map((d, i) => {
        const stagger = data.length > 1 ? i / (data.length - 1) : 0;
        const local = Math.max(
          0,
          Math.min(1, (progress - stagger * 0.35) / 0.65)
        );
        const eased = easeOutCubic(local);
        const fullH = (d.value / max) * innerH;
        const h = fullH * eased;
        const x = pad.l + slot * i + (slot - barW) / 2;
        const y = pad.t + innerH - h;
        return (
          <g key={d.id}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={10}
              fill={colors[i]}
              opacity={0.95}
            />
            <text
              x={x + barW / 2}
              y={H - pad.b + 24}
              fontSize={14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.75)"
              fontWeight={600}
            >
              {d.label}
            </text>
            {eased > 0.4 && (
              <text
                x={x + barW / 2}
                y={y - 10}
                fontSize={14}
                textAnchor="middle"
                fill={config.palette.text}
                fontWeight={700}
                opacity={(eased - 0.4) / 0.6}
              >
                {Math.round(d.value * eased)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
