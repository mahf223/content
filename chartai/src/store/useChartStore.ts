"use client";

import { create } from "zustand";
import { DEFAULT_CONFIG } from "@/lib/presets";
import type { ChartConfig, DataPoint } from "@/lib/types";

type Store = {
  config: ChartConfig;
  setType: (type: ChartConfig["type"]) => void;
  setTitle: (s: string) => void;
  setSubtitle: (s: string) => void;
  setPalette: (patch: Partial<ChartConfig["palette"]>) => void;
  setAnimation: (patch: Partial<ChartConfig["animation"]>) => void;
  setExport: (patch: Partial<ChartConfig["export"]>) => void;
  updateData: (id: string, patch: Partial<DataPoint>) => void;
  addRow: () => void;
  removeRow: (id: string) => void;
  resetData: (data: DataPoint[]) => void;
};

export const useChartStore = create<Store>((set) => ({
  config: DEFAULT_CONFIG,
  setType: (type) =>
    set((s) => ({ config: { ...s.config, type } })),
  setTitle: (title) =>
    set((s) => ({ config: { ...s.config, title } })),
  setSubtitle: (subtitle) =>
    set((s) => ({ config: { ...s.config, subtitle } })),
  setPalette: (patch) =>
    set((s) => ({
      config: { ...s.config, palette: { ...s.config.palette, ...patch } },
    })),
  setAnimation: (patch) =>
    set((s) => ({
      config: { ...s.config, animation: { ...s.config.animation, ...patch } },
    })),
  setExport: (patch) =>
    set((s) => ({
      config: { ...s.config, export: { ...s.config.export, ...patch } },
    })),
  updateData: (id, patch) =>
    set((s) => ({
      config: {
        ...s.config,
        data: s.config.data.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      },
    })),
  addRow: () =>
    set((s) => ({
      config: {
        ...s.config,
        data: [
          ...s.config.data,
          {
            id: Math.random().toString(36).slice(2, 8),
            label: `Item ${s.config.data.length + 1}`,
            value: 10,
            compare: 8,
          },
        ],
      },
    })),
  removeRow: (id) =>
    set((s) => ({
      config: {
        ...s.config,
        data: s.config.data.filter((d) => d.id !== id),
      },
    })),
  resetData: (data) =>
    set((s) => ({ config: { ...s.config, data } })),
}));
