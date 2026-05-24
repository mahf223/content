import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { tonalPalette } from "@/lib/presets";
import { easeOutCubic } from "./easing";

/**
 * Concentric circular progress rings — one per data point. Treats `value`
 * as a percent, capped at 100, so this works well as a "stats" widget.
 */
export function CircularChart({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  const eased = easeOutCubic(progress);
  const data = config.data.slice(0, 6);
  const colors = tonalPalette(config.palette.primary, data.length);

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const baseR = size * 0.42;
  const ringGap = 12;
  const ringW = Math.max(8, (baseR * 0.7) / Math.max(1, data.length));

  return (
    <svg
      viewBox={`0 0 ${size + 240} ${size}`}
      width="100%"
      height="100%"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    >
      {data.map((d, i) => {
        const r = baseR - i * (ringW + ringGap);
        const stagger = data.length > 1 ? i / data.length : 0;
        const local = Math.max(
          0,
          Math.min(1, (progress - stagger * 0.2) / 0.8)
        );
        const ringEase = easeOutCubic(local);
        const pct = Math.max(0, Math.min(100, d.value)) / 100;
        const c = 2 * Math.PI * r;
        const offset = c * (1 - pct * ringEase);
        return (
          <g
            key={d.id}
            transform={`translate(${cx} ${cy}) rotate(-90)`}
          >
            <circle
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={ringW}
            />
            <circle
              r={r}
              fill="none"
              stroke={colors[i]}
              strokeWidth={ringW}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{
                filter: `drop-shadow(0 0 8px ${colors[i]}66)`,
              }}
            />
          </g>
        );
      })}

      {/* Center text */}
      <g transform={`translate(${cx}, ${cy})`}>
        <text
          textAnchor="middle"
          fontSize={48}
          fontWeight={800}
          fill={config.palette.text}
          y={-4}
          style={{ letterSpacing: "-0.02em" }}
        >
          {Math.round((data[0]?.value ?? 0) * eased)}%
        </text>
        <text
          textAnchor="middle"
          fontSize={14}
          fill="rgba(255,255,255,0.45)"
          y={28}
          fontWeight={500}
          style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}
        >
          {data[0]?.label ?? ""}
        </text>
      </g>

      {/* Legend on the right */}
      <g transform={`translate(${size + 30}, ${cy - data.length * 22})`}>
        {data.map((d, i) => (
          <g key={d.id} transform={`translate(0, ${i * 44})`}>
            <circle r={6} cy={6} cx={6} fill={colors[i]} />
            <text
              x={22}
              y={11}
              fontSize={15}
              fill={config.palette.text}
              fontWeight={600}
            >
              {d.label}
            </text>
            <text
              x={22}
              y={29}
              fontSize={12}
              fill="rgba(255,255,255,0.45)"
              fontWeight={500}
            >
              {Math.round(d.value * eased)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
