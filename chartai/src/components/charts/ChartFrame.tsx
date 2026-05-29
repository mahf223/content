import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { generateInsight } from "@/lib/ai";

/**
 * A consistent presentational frame around every chart. The frame is what gets
 * captured for image/video export — it includes title, subtitle, AI insight,
 * and watermark / brand logo (when enabled).
 */
export function ChartFrame({
  config,
  children,
  width,
  height,
}: {
  config: ChartConfig;
  children: React.ReactNode;
  width?: number;
  height?: number;
}) {
  const insight = generateInsight(config.data);

  return (
    <div
      data-chart-frame
      className="relative overflow-hidden rounded-3xl"
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
        background:
          "radial-gradient(120% 80% at 80% -10%, rgba(31,187,232,0.18), transparent 55%), radial-gradient(80% 60% at -10% 110%, rgba(31,187,232,0.10), transparent 60%), #06080B",
        color: config.palette.text,
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      {/* subtle border */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      />

      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 flex items-start justify-between"
        style={{ padding: "5% 5% 0 5%" }}
      >
        <div style={{ maxWidth: "70%" }}>
          <div
            style={{
              fontSize: "0.85em",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 500,
            }}
          >
            {config.subtitle || "Chart"}
          </div>
          <div
            style={{
              fontSize: "2.4em",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: "0.4em",
            }}
          >
            {config.title || "Untitled"}
          </div>
        </div>

        {config.export.brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.export.brandLogo}
            alt="brand"
            style={{
              maxHeight: 48,
              maxWidth: 140,
              objectFit: "contain",
              opacity: 0.95,
            }}
          />
        ) : (
          <BrandMark color={config.palette.primary} />
        )}
      </div>

      {/* Chart body */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: "16% 6% 14% 6%" }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
        style={{ padding: "0 5% 5% 5%" }}
      >
        <p
          style={{
            fontSize: "0.95em",
            color: "rgba(255,255,255,0.55)",
            maxWidth: "75%",
            lineHeight: 1.5,
          }}
        >
          {insight}
        </p>
        {config.export.watermark && (
          <div
            style={{
              fontSize: "0.75em",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Made with{" "}
            <span style={{ color: config.palette.primary }}>ChartAI</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BrandMark({ color }: { color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      <span style={{ fontSize: "0.95em" }}>ChartAI</span>
    </div>
  );
}
