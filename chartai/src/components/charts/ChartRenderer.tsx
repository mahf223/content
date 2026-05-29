import * as React from "react";
import type { ChartConfig } from "@/lib/types";
import { ChartFrame } from "./ChartFrame";
import { PieChart } from "./PieChart";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";
import { ComparisonChart } from "./ComparisonChart";
import { CircularChart } from "./CircularChart";

/**
 * Pure-function chart renderer driven by `progress` (0..1).
 * Used both in the web preview (driven by Framer Motion / requestAnimationFrame)
 * and in the Remotion server-side composition.
 */
export function ChartRenderer({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  return (
    <ChartFrame config={config}>
      <ChartBody config={config} progress={progress} />
    </ChartFrame>
  );
}

function ChartBody({
  config,
  progress,
}: {
  config: ChartConfig;
  progress: number;
}) {
  switch (config.type) {
    case "pie":
      return <PieChart config={config} progress={progress} />;
    case "doughnut":
      return <PieChart config={config} progress={progress} doughnut />;
    case "bar":
      return <BarChart config={config} progress={progress} />;
    case "line":
      return <LineChart config={config} progress={progress} />;
    case "comparison":
      return <ComparisonChart config={config} progress={progress} />;
    case "circular":
      return <CircularChart config={config} progress={progress} />;
    default:
      return null;
  }
}
