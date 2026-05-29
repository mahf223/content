"use client";

import { Wand2, Image as ImageIcon, Film } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useChartStore } from "@/store/useChartStore";
import { recommendChartType } from "@/lib/ai";

export function Topbar({
  onExportImage,
  onExportVideo,
}: {
  onExportImage: () => void;
  onExportVideo: () => void;
}) {
  const { config, setType } = useChartStore();
  const recommendation = recommendChartType(config.data);

  return (
    <header className="flex items-center justify-between gap-4 px-6 lg:px-8 py-4 sticky top-0 z-20 backdrop-blur-xl bg-ink-950/60 border-b border-white/[0.04]">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          Workspace
        </div>
        <h1 className="text-lg lg:text-xl font-bold tracking-tight truncate">
          {config.title || "Untitled chart"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setType(recommendation.type)}
          title={recommendation.reason}
          className="hidden sm:inline-flex"
        >
          <Wand2 size={14} className="text-brand" />
          AI suggests: <span className="capitalize">{recommendation.type}</span>
        </Button>

        <Button variant="soft" size="md" onClick={onExportImage}>
          <ImageIcon size={14} />
          Export image
        </Button>

        <Button variant="primary" size="md" onClick={onExportVideo}>
          <Film size={14} />
          Export MP4
        </Button>
      </div>
    </header>
  );
}
