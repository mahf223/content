"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { useChartStore } from "@/store/useChartStore";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

/**
 * Inline data editor. Drag-handle is decorative for now (full DnD reorder
 * is intentionally out of scope; rows can be removed/added trivially).
 */
export function DataEditor() {
  const { config, updateData, addRow, removeRow } = useChartStore();
  const showCompare = config.type === "comparison";

  return (
    <Panel className="mt-6">
      <PanelHeader
        title="Chart data"
        hint="Edit values inline. Changes preview instantly."
        action={
          <Button size="sm" variant="outline" onClick={addRow}>
            <Plus size={14} />
            Add row
          </Button>
        }
      />

      <div className="px-5 pb-5 mt-3">
        <div className="grid grid-cols-12 gap-2 px-2 mb-2 text-[10px] uppercase tracking-wider text-white/40">
          <span className="col-span-1" />
          <span className="col-span-5">Label</span>
          <span className="col-span-3">Value</span>
          {showCompare ? <span className="col-span-2">Previous</span> : null}
          <span className={showCompare ? "col-span-1" : "col-span-3"} />
        </div>

        <div className="flex flex-col gap-1.5">
          {config.data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="col-span-1 text-white/30">
                <GripVertical size={14} />
              </div>
              <input
                value={row.label}
                onChange={(e) =>
                  updateData(row.id, { label: e.target.value })
                }
                className="col-span-5 h-9 px-3 rounded-lg bg-ink-900/60 border border-white/[0.06] text-sm text-white/90 focus:outline-none focus:border-brand/60"
              />
              <input
                type="number"
                value={row.value}
                onChange={(e) =>
                  updateData(row.id, { value: Number(e.target.value) })
                }
                className="col-span-3 h-9 px-3 rounded-lg bg-ink-900/60 border border-white/[0.06] text-sm text-white/90 focus:outline-none focus:border-brand/60"
              />
              {showCompare ? (
                <input
                  type="number"
                  value={row.compare ?? 0}
                  onChange={(e) =>
                    updateData(row.id, { compare: Number(e.target.value) })
                  }
                  className="col-span-2 h-9 px-3 rounded-lg bg-ink-900/60 border border-white/[0.06] text-sm text-white/90 focus:outline-none focus:border-brand/60"
                />
              ) : null}
              <button
                onClick={() => removeRow(row.id)}
                disabled={config.data.length <= 1}
                className={
                  showCompare
                    ? "col-span-1 h-9 grid place-items-center text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    : "col-span-3 h-9 grid place-items-center text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed justify-self-end w-9"
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
