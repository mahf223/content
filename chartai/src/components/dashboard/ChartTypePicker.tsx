"use client";

import {
  PieChart as PieIcon,
  Donut,
  BarChart3,
  LineChart as LineIcon,
  GitCompareArrows,
  CircleDashed,
} from "lucide-react";
import { useChartStore } from "@/store/useChartStore";
import type { ChartType } from "@/lib/types";
import { cn } from "@/lib/cn";

const TYPES: { type: ChartType; label: string; Icon: any }[] = [
  { type: "pie", label: "Pie", Icon: PieIcon },
  { type: "doughnut", label: "Doughnut", Icon: Donut },
  { type: "bar", label: "Bar", Icon: BarChart3 },
  { type: "line", label: "Line", Icon: LineIcon },
  { type: "comparison", label: "Comparison", Icon: GitCompareArrows },
  { type: "circular", label: "Circular", Icon: CircleDashed },
];

export function ChartTypePicker() {
  const { config, setType } = useChartStore();
  return (
    <div className="flex items-center gap-1.5 p-1 bg-ink-900/70 rounded-xl border border-white/[0.05] overflow-x-auto max-w-full">
      {TYPES.map(({ type, label, Icon }) => {
        const active = config.type === type;
        return (
          <button
            key={type}
            onClick={() => setType(type)}
            className={cn(
              "flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              active
                ? "bg-brand text-ink-950 shadow-[0_0_0_1px_rgba(31,187,232,0.4),0_8px_24px_-12px_rgba(31,187,232,0.6)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
