import * as React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import type { ChartConfig } from "@/lib/types";

export type ChartCompositionProps = {
  config: ChartConfig;
};

/**
 * Remotion composition. Maps `frame` to a `progress` value in [0, 1] using
 * the same interpolation our preview uses, so the rendered MP4 looks
 * identical to the live preview.
 */
export const ChartComposition: React.FC<ChartCompositionProps> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();

  // Reserve the last 0.4s as a "hold" so the chart sits still at the end.
  const animFrames = Math.max(1, durationInFrames - Math.round(fps * 0.4));
  const progress = interpolate(frame, [0, animFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing:
      config.animation.easing === "linear"
        ? Easing.linear
        : config.animation.easing === "spring"
          ? Easing.bezier(0.34, 1.56, 0.64, 1)
          : Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.palette.background ?? "#06080B",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      <div style={{ width, height, position: "relative" }}>
        <ChartRenderer config={config} progress={progress} />
      </div>
    </AbsoluteFill>
  );
};
