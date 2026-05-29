import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";

/**
 * In-memory job registry. Keeps progress/status for active and recently
 * completed renders so the client can poll. Also responsible for tmp dir
 * housekeeping.
 */

export type JobStatus = "queued" | "rendering" | "done" | "error";

export type RenderJob = {
  id: string;
  status: JobStatus;
  progress: number; // 0..1
  startedAt: number;
  finishedAt?: number;
  outputPath?: string;
  error?: string;
};

const jobs = new Map<string, RenderJob>();

export function createJob(id: string): RenderJob {
  const job: RenderJob = {
    id,
    status: "queued",
    progress: 0,
    startedAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): RenderJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<RenderJob>) {
  const j = jobs.get(id);
  if (!j) return;
  Object.assign(j, patch);
  jobs.set(id, j);
}

export async function jobOutputDir(id: string) {
  const dir = path.join(os.tmpdir(), "chartai-renders", id);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/** Best-effort cleanup. Called on process exit / when re-rendering. */
export async function cleanupOldJobs(maxAgeMs = 1000 * 60 * 30) {
  const now = Date.now();
  for (const [id, job] of jobs.entries()) {
    if (now - job.startedAt > maxAgeMs) {
      try {
        const dir = path.join(os.tmpdir(), "chartai-renders", id);
        await fs.rm(dir, { recursive: true, force: true });
      } catch {}
      jobs.delete(id);
    }
  }
}
