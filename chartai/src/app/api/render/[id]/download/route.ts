import path from "node:path";
import fs from "node:fs";
import { getJob } from "@/lib/renderJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const job = getJob(params.id);
  if (!job || job.status !== "done" || !job.outputPath) {
    return new Response("Not ready", { status: 404 });
  }

  const stat = await fs.promises.stat(job.outputPath).catch(() => null);
  if (!stat) {
    return new Response("File missing", { status: 404 });
  }

  const stream = fs.createReadStream(job.outputPath);
  // ReadableStream<Uint8Array> wrapper so Next can pipe Node streams in App Router.
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="chartai-${path.basename(
        path.dirname(job.outputPath)
      )}.mp4"`,
      "Cache-Control": "no-store",
    },
  });
}
