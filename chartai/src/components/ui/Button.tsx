"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "soft";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand text-ink-950 hover:bg-brand-400 active:bg-brand-600 shadow-glow font-semibold",
  ghost:
    "bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
  outline:
    "border border-white/10 bg-white/[0.02] text-white/85 hover:border-brand/50 hover:text-white hover:bg-white/[0.04]",
  soft:
    "bg-white/[0.04] text-white/90 hover:bg-white/[0.08] border border-white/[0.06]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-sm rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "soft", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
