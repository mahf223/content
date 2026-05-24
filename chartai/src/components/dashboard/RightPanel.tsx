"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { useChartStore } from "@/store/useChartStore";
import {
  Field,
  Input,
  ColorInput,
  SegmentedControl,
  Slider,
  Toggle,
} from "@/components/ui/Field";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

export function RightPanel({
  onExportImage,
  onExportVideo,
  videoBusy,
  videoProgress,
}: {
  onExportImage: (format: "png" | "jpg" | "svg") => void;
  onExportVideo: () => void;
  videoBusy: boolean;
  videoProgress: number;
}) {
  const {
    config,
    setTitle,
    setSubtitle,
    setPalette,
    setAnimation,
    setExport,
  } = useChartStore();

  return (
    <aside className="hidden lg:flex flex-col w-[340px] shrink-0 h-screen sticky top-0 px-5 py-5 border-l border-white/[0.04] gap-4 overflow-y-auto">
      <Panel>
        <PanelHeader title="Branding" hint="Title, logo, watermark" />
        <div className="px-5 pb-5 mt-3 space-y-3">
          <Field label="Title">
            <Input
              value={config.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Q4 Revenue Mix"
            />
          </Field>
          <Field label="Subtitle">
            <Input
              value={config.subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Comparison across business units"
            />
          </Field>

          <BrandLogoUploader />

          <Toggle
            checked={config.export.watermark}
            onChange={(v) => setExport({ watermark: v })}
            label="Show ChartAI watermark"
          />
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Colors" />
        <div className="px-5 pb-5 mt-3 space-y-3">
          <Field label="Primary">
            <ColorInput
              value={config.palette.primary}
              onChange={(v) => setPalette({ primary: v })}
            />
          </Field>
          <Field label="Text">
            <ColorInput
              value={config.palette.text}
              onChange={(v) => setPalette({ text: v })}
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Animation" />
        <div className="px-5 pb-5 mt-3 space-y-4">
          <Field label="Easing">
            <SegmentedControl
              options={[
                { value: "smooth", label: "Smooth" },
                { value: "spring", label: "Spring" },
                { value: "linear", label: "Linear" },
              ]}
              value={config.animation.easing}
              onChange={(v) => setAnimation({ easing: v })}
            />
          </Field>
          <Field
            label="Duration"
            hint={`${config.animation.duration.toFixed(1)}s`}
          >
            <Slider
              min={0.6}
              max={4}
              step={0.1}
              value={config.animation.duration}
              onChange={(v) => setAnimation({ duration: v })}
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Export" hint="Image and video settings" />
        <div className="px-5 pb-5 mt-3 space-y-4">
          <Field label="Aspect / size">
            <SegmentedControl
              options={[
                { value: "landscape", label: "16:9" },
                { value: "square", label: "1:1" },
                { value: "portrait", label: "4:5" },
                { value: "story", label: "9:16" },
              ]}
              value={config.export.preset}
              onChange={(v) => setExport({ preset: v })}
            />
          </Field>
          <Field
            label="Image quality"
            hint={`${config.export.imageScale}x scale`}
          >
            <SegmentedControl
              options={[
                { value: "1", label: "1x" },
                { value: "2", label: "2x" },
                { value: "3", label: "3x HD" },
              ]}
              value={String(config.export.imageScale)}
              onChange={(v) =>
                setExport({ imageScale: Number(v) as 1 | 2 | 3 })
              }
            />
          </Field>
          <Field
            label="Video FPS"
            hint={`${config.export.videoFps} fps`}
          >
            <SegmentedControl
              options={[
                { value: "30", label: "30 fps" },
                { value: "60", label: "60 fps" },
              ]}
              value={String(config.export.videoFps)}
              onChange={(v) =>
                setExport({ videoFps: Number(v) as 30 | 60 })
              }
            />
          </Field>
          <Field
            label="Video length"
            hint={`${config.export.videoSeconds.toFixed(1)}s`}
          >
            <Slider
              min={2}
              max={10}
              step={0.5}
              value={config.export.videoSeconds}
              onChange={(v) => setExport({ videoSeconds: v })}
            />
          </Field>

          <div className="pt-2 grid grid-cols-3 gap-2">
            <Button
              variant="soft"
              size="sm"
              onClick={() => onExportImage("png")}
              className="text-[11px]"
            >
              PNG
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() => onExportImage("jpg")}
              className="text-[11px]"
            >
              JPG
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() => onExportImage("svg")}
              className="text-[11px]"
            >
              SVG
            </Button>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onExportVideo}
            disabled={videoBusy}
            className="w-full"
          >
            {videoBusy ? (
              <>Rendering… {Math.round(videoProgress * 100)}%</>
            ) : (
              <>Render MP4 (1080p)</>
            )}
          </Button>

          {videoBusy && (
            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-[width] duration-150"
                style={{ width: `${videoProgress * 100}%` }}
              />
            </div>
          )}
        </div>
      </Panel>
    </aside>
  );
}

function BrandLogoUploader() {
  const { config, setExport } = useChartStore();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setExport({ brandLogo: reader.result as string });
    };
    reader.readAsDataURL(f);
  };

  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
        Brand logo
      </div>
      {config.export.brandLogo ? (
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-ink-900/60 border border-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.export.brandLogo}
            alt="logo"
            className="h-8 max-w-[140px] object-contain"
          />
          <button
            onClick={() => setExport({ brandLogo: null })}
            className="h-8 w-8 grid place-items-center text-white/50 hover:text-white rounded-md hover:bg-white/[0.05]"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 w-full h-9 px-3 rounded-lg bg-ink-900/60 border border-dashed border-white/[0.1] text-white/60 hover:text-white hover:border-brand/50 text-sm transition-colors"
        >
          <Upload size={14} />
          Upload PNG / SVG
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
