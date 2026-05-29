import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { tonalPalette, toPercent } from "@/lib/presets";
import { easeOutCubic } from "./easing";

type Props = {
  config: ChartConfig;
  /** 0..1 — chart entrance progress */
  progress: number;
  doughnut?: boolean;
};

export function PieChart({ config, progress, doughnut = false }: Props) {
  const eased = easeOutCubic(progress);
  const data = toPercent(config.data);
  const colors = tonalPalette(config.palette.primary, data.length);

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;
  const innerRadius = doughnut ? radius * 0.62 : 0;

  let acc = 0;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    >
      <defs>
        <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={doughnut ? radius - innerRadius : 1}
      />

      {data.map((d, i) => {
        const sweep = (d.percent / 100) * 360 * eased;
        const start = acc;
        acc += sweep;
        const end = start + sweep;
        const path = arcPath(cx, cy, radius, innerRadius, start, end);
        return (
          <path
            key={d.id}
            d={path}
            fill={colors[i]}
            opacity={0.92}
            filter="url(#pieShadow)"
          />
        );
      })}

      {doughnut && (
        <g>
          <text
            x={cx}
            y={cy - 6}
            fontSize={42}
            fontWeight={800}
            textAnchor="middle"
            fill={config.palette.text}
            style={{ letterSpacing: "-0.02em" }}
          >
            {Math.round(data.reduce((s, d) => s + d.value, 0) * eased)}
          </text>
          <text
            x={cx}
            y={cy + 28}
            fontSize={16}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontWeight={500}
            style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}
          >
            Total
          </text>
        </g>
      )}

      {/* Legend */}
      <g transform={`translate(${size + 30}, ${cy - data.length * 18})`}>
        {data.map((d, i) => (
          <g key={d.id} transform={`translate(0, ${i * 36})`}>
            <rect
              width={14}
              height={14}
              rx={4}
              fill={colors[i]}
              opacity={Math.max(0, Math.min(1, eased * 1.2 - i * 0.05))}
            />
            <text
              x={22}
              y={12}
              fontSize={16}
              fill={config.palette.text}
              fontWeight={600}
            >
              {d.label}
            </text>
            <text
              x={22}
              y={30}
              fontSize={13}
              fill="rgba(255,255,255,0.45)"
              fontWeight={500}
            >
              {Math.round(d.percent * eased)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Build an SVG arc path. Supports doughnut via inner radius. */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  inner: number,
  startDeg: number,
  endDeg: number
) {
  // -90 so that 0deg is at the top
  const a1 = ((startDeg - 90) * Math.PI) / 180;
  const a2 = ((endDeg - 90) * Math.PI) / 180;
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);

  if (inner <= 0) {
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  const xi1 = cx + inner * Math.cos(a2);
  const yi1 = cy + inner * Math.sin(a2);
  const xi2 = cx + inner * Math.cos(a1);
  const yi2 = cy + inner * Math.sin(a1);

  return [
    `M ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${xi1} ${yi1}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${xi2} ${yi2}`,
    "Z",
  ].join(" ");
}
