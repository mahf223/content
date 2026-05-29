import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import {
  createJob,
  jobOutputDir,
  updateJob,
  cleanupOldJobs,
} from "@/lib/renderJobs";
import { SOCIAL_PRESETS } from "@/lib/presets";
import type { ChartConfig } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // up to 5 minutes for long renders

// Cache the Remotion bundle across requests so subsequent renders are fast.
let bundleUrlPromise: Promise<string> | null = null;

async function getBundle(): Promise<string> {
  if (!bundleUrlPromise) {
    bundleUrlPromise = (async () => {
      const { bundle } = await import("@remotion/bundler");
      const { webpackOverride } = await import(
        "@/remotion/webpack-override"
      );
      const entry = path.join(process.cwd(), "src/remotion/index.ts");
      const out = await bundle({
        entryPoint: entry,
        webpackOverride,
        onProgress: () => undefined,
      });
      return out;
    })();
  }
  return bundleUrlPromise;
}

export async function POST(req: Request) {
  await cleanupOldJobs();

  let config: ChartConfig;
  try {
    const body = await req.json();
    config = body.config;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
  if (!config) {
    return NextResponse.json(
      { error: "Missing `config` in request body" },
      { status: 400 }
    );
  }

  const id =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  createJob(id);

  // Kick off render in the background. We intentionally don't await — the
  // client polls /api/render/[id] for progress and downloads when done.
  void runRender(id, config).catch((err) => {
    console.error("[render]", err);
    updateJob(id, {
      status: "error",
      error: err instanceof Error ? err.message : String(err),
      finishedAt: Date.now(),
    });
  });

  return NextResponse.json({ id });
}

async function runRender(id: string, config: ChartConfig) {
  updateJob(id, { status: "rendering", progress: 0.02 });

  const { selectComposition, renderMedia } = await import(
    "@remotion/renderer"
  );

  const serveUrl = await getBundle();
  updateJob(id, { progress: 0.1 });

  const preset = SOCIAL_PRESETS[config.export.preset];
  const fps = config.export.videoFps;
  const seconds = Math.max(1, config.export.videoSeconds);
  const durationInFrames = Math.round(seconds * fps);

  const composition = await selectComposition({
    serveUrl,
    id: "Chart",
    inputProps: { config },
  });

  // Override composition metadata to match the user's chosen size/length.
  const composed = {
    ...composition,
    durationInFrames,
    fps,
    width: preset.width,
    height: preset.height,
  };

  const dir = await jobOutputDir(id);
  const outputLocation = path.join(dir, "chart.mp4");

  await renderMedia({
    composition: composed,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps: { config },
    // Smoother motion + smaller files; broadly compatible.
    pixelFormat: "yuv420p",
    crf: 18,
    // Use as many cores as the host has — typically Lambda or a server VM.
    concurrency: null,
    chromiumOptions: {
      // Headless Chrome args to reduce flakiness inside containers.
      gl: "swangle",
    },
    onProgress: ({ progress }) => {
      updateJob(id, {
        progress: 0.1 + progress * 0.85,
      });
    },
  });

  updateJob(id, {
    status: "done",
    progress: 1,
    outputPath: outputLocation,
    finishedAt: Date.now(),
  });
}

// Confirm we exist, useful for sanity-checks.
export async function GET() {
  const exists = await fs
    .stat(path.join(process.cwd(), "src/remotion/index.ts"))
    .then(() => true)
    .catch(() => false);
  return NextResponse.json({ ok: exists });
}
