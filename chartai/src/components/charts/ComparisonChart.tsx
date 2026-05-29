import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { easeOutCubic } from "./easing";

/**
 * Side-by-side bar comparison: each row shows `value` vs `compare`.
 * Bars grow horizontally; values count up.
 */
export function ComparisonChart({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  const data = config.data;
  const max = Math.max(
    ...data.map((d) => Math.max(d.value, d.compare ?? 0)),
    1
  );

  const W = 900;
  const H = 480;
  const pad = { l: 140, r: 40, t: 30, b: 30 };
  const innerW = W - pad.l - pad.r;
  const rowH = (H - pad.t - pad.b) / data.length;
  const barH = Math.min(22, rowH * 0.32);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    >
      {/* Legend */}
      <g transform={`translate(${pad.l}, ${10})`}>
        <rect width={10} height={10} rx={2} fill={config.palette.primary} />
        <text
          x={16}
          y={9}
          fontSize={12}
          fill="rgba(255,255,255,0.65)"
          fontWeight={600}
        >
          Current
        </text>
        <rect
          x={90}
          width={10}
          height={10}
          rx={2}
          fill="rgba(255,255,255,0.35)"
        />
        <text
          x={106}
          y={9}
          fontSize={12}
          fill="rgba(255,255,255,0.65)"
          fontWeight={600}
        >
          Previous
        </text>
      </g>

      {data.map((d, i) => {
        const stagger = data.length > 1 ? i / (data.length - 1) : 0;
        const local = Math.max(
          0,
          Math.min(1, (progress - stagger * 0.3) / 0.7)
        );
        const eased = easeOutCubic(local);
        const yA = pad.t + rowH * i + rowH / 2 - barH - 2;
        const yB = pad.t + rowH * i + rowH / 2 + 2;
        const wA = (d.value / max) * innerW * eased;
        const wB = ((d.compare ?? 0) / max) * innerW * eased;

        return (
          <g key={d.id}>
            <text
              x={pad.l - 16}
              y={yA + barH / 2 + 5}
              fontSize={14}
              fill="rgba(255,255,255,0.8)"
              textAnchor="end"
              fontWeight={600}
            >
              {d.label}
            </text>

            {/* current */}
            <rect
              x={pad.l}
              y={yA}
              width={Math.max(0, wA)}
              height={barH}
              rx={barH / 2}
              fill={config.palette.primary}
              opacity={0.95}
            />
            {eased > 0.5 && (
              <text
                x={pad.l + wA + 8}
                y={yA + barH / 2 + 5}
                fontSize={12}
                fill={config.palette.text}
                fontWeight={700}
                opacity={(eased - 0.5) * 2}
              >
                {Math.round(d.value * eased)}
              </text>
            )}

            {/* previous */}
            <rect
              x={pad.l}
              y={yB}
              width={Math.max(0, wB)}
              height={barH}
              rx={barH / 2}
              fill="rgba(255,255,255,0.3)"
            />
            {eased > 0.5 && (
              <text
                x={pad.l + wB + 8}
                y={yB + barH / 2 + 5}
                fontSize={12}
                fill="rgba(255,255,255,0.55)"
                fontWeight={600}
                opacity={(eased - 0.5) * 2}
              >
                {Math.round((d.compare ?? 0) * eased)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
