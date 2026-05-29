"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wider text-white/50">
          {label}
        </span>
        {hint ? (
          <span className="text-[11px] text-white/30">{hint}</span>
        ) : null}
      </div>
      {children}
    </label>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-9 px-3 text-sm rounded-lg",
      "bg-ink-900/60 border border-white/[0.06] text-white/90",
      "placeholder:text-white/30",
      "focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/40",
      "transition-colors",
      className
    )}
    {...rest}
  />
));
Input.displayName = "Input";

export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/10"
        style={{ background: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <Input
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono uppercase tracking-wider text-xs"
      />
    </div>
  );
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 rounded-full bg-white/[0.07] accent-brand cursor-pointer"
    />
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-1 p-1 bg-ink-900/70 rounded-xl border border-white/[0.05]">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-8 rounded-lg text-xs font-medium transition-all",
            value === o.value
              ? "bg-brand text-ink-950 shadow-[0_0_0_1px_rgba(31,187,232,0.4),0_8px_24px_-12px_rgba(31,187,232,0.6)]"
              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full group"
    >
      <span className="text-sm text-white/80 group-hover:text-white">
        {label}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-white/[0.1]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
