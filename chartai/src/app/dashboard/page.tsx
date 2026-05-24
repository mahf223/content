"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Workspace } from "@/components/dashboard/Workspace";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { useChartStore } from "@/store/useChartStore";
import { exportImage, type ImageFormat } from "@/lib/exportImage";
import { renderVideo } from "@/lib/exportVideo";

export default function DashboardPage() {
  const config = useChartStore((s) => s.config);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const [videoBusy, setVideoBusy] = React.useState(false);
  const [videoProgress, setVideoProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleExportImage = React.useCallback(
    async (format: ImageFormat = "png") => {
      const node = previewRef.current?.querySelector(
        "[data-chart-frame]"
      ) as HTMLElement | null;
      if (!node) return;
      try {
        await exportImage({
          node,
          format,
          scale: config.export.imageScale,
          filename: slugify(config.title),
        });
      } catch (e) {
        console.error(e);
        setError(
          e instanceof Error ? e.message : "Image export failed."
        );
      }
    },
    [config.export.imageScale, config.title]
  );

  const handleExportVideo = React.useCallback(async () => {
    setError(null);
    setVideoBusy(true);
    setVideoProgress(0);
    try {
      await renderVideo(config, (p) => setVideoProgress(p));
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error ? e.message : "Video export failed."
      );
    } finally {
      setVideoBusy(false);
    }
  }, [config]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onExportImage={() => handleExportImage("png")}
          onExportVideo={handleExportVideo}
        />
        {error && (
          <div className="mx-6 lg:mx-8 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <div className="flex flex-1 min-w-0">
          <Workspace ref={previewRef} />
          <RightPanel
            onExportImage={handleExportImage}
            onExportVideo={handleExportVideo}
            videoBusy={videoBusy}
            videoProgress={videoProgress}
          />
        </div>
      </main>
    </div>
  );
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
