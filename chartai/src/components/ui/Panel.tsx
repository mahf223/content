import * as React from "react";
import { cn } from "@/lib/cn";

export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-soft",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-white/90">
          {title}
        </h3>
        {hint ? (
          <p className="text-xs text-white/40 mt-0.5">{hint}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
