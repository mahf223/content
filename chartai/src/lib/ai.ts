import type { ChartType, DataPoint } from "./types";

/**
 * A small heuristic "AI recommender" — picks a chart type appropriate for
 * the shape of the data. This is intentionally lightweight and offline.
 */
export function recommendChartType(data: DataPoint[]): {
  type: ChartType;
  reason: string;
} {
  const n = data.length;
  const hasCompare = data.some(
    (d) => typeof d.compare === "number" && d.compare > 0
  );
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(...data.map((d) => d.value));
  const skew = total === 0 ? 0 : max / total;

  if (n === 1) {
    return {
      type: "circular",
      reason: "Single metric — best shown as a circular progress.",
    };
  }
  if (hasCompare) {
    return {
      type: "comparison",
      reason: "Two values per category — comparison chart fits.",
    };
  }
  if (n <= 5 && skew < 0.6) {
    return {
      type: "doughnut",
      reason: "Few balanced categories — a doughnut reads cleanly.",
    };
  }
  if (n <= 8) {
    return {
      type: "bar",
      reason: "A small set of categories — a bar chart is clearest.",
    };
  }
  return {
    type: "line",
    reason: "Many ordered points — a line shows the trend best.",
  };
}

export function generateInsight(data: DataPoint[]): string {
  if (!data.length) return "Add data to see an AI insight.";
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted[0];
  const last = sorted[sorted.length - 1];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const topShare = ((top.value / total) * 100).toFixed(1);

  if (data.length === 1) {
    return `${top.label} is at ${top.value}.`;
  }
  return `${top.label} leads with ${topShare}% of the total, while ${last.label} trails at ${(
    (last.value / total) *
    100
  ).toFixed(1)}%.`;
}
