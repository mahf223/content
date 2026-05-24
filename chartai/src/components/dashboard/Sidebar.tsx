"use client";

import { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  LayoutTemplate,
  Download,
  Clock4,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "templates", label: "Templates", icon: LayoutTemplate },
  { key: "export", label: "Export", icon: Download },
  { key: "history", label: "History", icon: Clock4 },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [active, setActive] = useState("dashboard");
  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 px-4 py-5 border-r border-white/[0.04]">
      <Brand />

      <nav className="mt-8 flex flex-col gap-1">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "group flex items-center gap-3 px-3 h-10 rounded-xl text-sm transition-colors",
                isActive
                  ? "bg-white/[0.04] text-white border border-white/[0.06]"
                  : "text-white/55 hover:text-white hover:bg-white/[0.025]"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  isActive ? "text-brand" : "text-white/40 group-hover:text-white/70"
                )}
              />
              <span className="font-medium">{label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_2px_rgba(31,187,232,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <UpgradeCard />
      </div>
    </aside>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-brand-700 grid place-items-center shadow-glow">
        <Sparkles size={16} className="text-ink-950" />
      </div>
      <div className="leading-none">
        <div className="text-sm font-bold tracking-tight">ChartAI</div>
        <div className="text-[10px] text-white/40 mt-0.5">v1.0 · 2026</div>
      </div>
    </div>
  );
}

function UpgradeCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 glass">
      <div className="absolute -top-12 -right-10 h-32 w-32 rounded-full bg-brand/30 blur-3xl" />
      <div className="relative">
        <div className="text-xs font-semibold text-white">Pro tip</div>
        <p className="text-[11px] leading-relaxed text-white/55 mt-1">
          Use{" "}
          <span className="text-brand font-medium">AI Recommend</span> to pick
          the best chart type from your data.
        </p>
      </div>
    </div>
  );
}
