"use client";

import * as React from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import { useChartStore } from "@/store/useChartStore";
import { Button } from "@/components/ui/Button";
import { ChartTypePicker } from "./ChartTypePicker";
import { DataEditor } from "./DataEditor";

/**
 * Live preview area. Drives the same ChartRenderer used by Remotion using
 * a requestAnimationFrame-driven `progress` value in [0, 1]. Looping playback
 * lets users see exactly what their MP4 will look like, frame for frame.
 */
export const Workspace = React.forwardRef<HTMLDivElement, {}>(
  function Workspace(_props, ref) {
    const config = useChartStore((s) => s.config);
    const [playing, setPlaying] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const startedAt = React.useRef<number | null>(null);
    const total = config.animation.duration; // seconds

    useAnimationFrame((t) => {
      if (!playing) {
        startedAt.current = null;
        return;
      }
      if (startedAt.current === null) startedAt.current = t;
      const elapsed = (t - startedAt.current) / 1000;
      const cycle = total + 1.5; // brief hold at the end
      const local = elapsed % cycle;
      const next = Math.min(1, local / total);
      setProgress(next);
    });

    const reset = () => {
      startedAt.current = null;
      setProgress(0);
    };

    return (
      <div className="flex-1 min-w-0 px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <ChartTypePicker />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? "Pause" : "Play"}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw size={14} />
              Replay
            </Button>
          </div>
        </div>

        <motion.div
          ref={ref}
          layout
          className="relative w-full aspect-video rounded-3xl overflow-hidden glass-strong"
          style={{ minHeight: 420 }}
        >
          <ChartRenderer config={config} progress={progress} />

          {/* Progress bar overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.05]">
            <div
              className="h-full bg-brand transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </motion.div>

        <DataEditor />
      </div>
    );
  }
);
