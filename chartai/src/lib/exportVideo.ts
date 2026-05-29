"use client";

import type { ChartConfig } from "./types";

export type RenderProgress = {
  status: "queued" | "rendering" | "done" | "error";
  progress: number;
  error?: string | null;
};

export async function startRender(config: ChartConfig): Promise<string> {
  const res = await fetch("/api/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Render request failed (${res.status})`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

export async function pollRender(id: string): Promise<RenderProgress> {
  const res = await fetch(`/api/render/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Status fetch failed (${res.status})`);
  return (await res.json()) as RenderProgress;
}

export function downloadRender(id: string, filename = "chartai") {
  const a = document.createElement("a");
  a.href = `/api/render/${id}/download`;
  a.download = `${filename}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Drive a full render lifecycle: start → poll → download.
 * Calls `onProgress` with values in [0, 1].
 */
export async function renderVideo(
  config: ChartConfig,
  onProgress: (n: number) => void
): Promise<string> {
  const id = await startRender(config);
  onProgress(0.02);

  // Poll every 800ms.
  while (true) {
    await new Promise((r) => setTimeout(r, 800));
    const p = await pollRender(id);
    onProgress(p.progress);
    if (p.status === "done") {
      downloadRender(id, slugify(config.title));
      return id;
    }
    if (p.status === "error") {
      throw new Error(p.error || "Render failed");
    }
  }
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "chart"
  );
}
