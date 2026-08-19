"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export interface DecisionNodeData {
  label: string;
  prompt: string;
  onChangePrompt?: (id: string, newPrompt: string) => void;
}

export const DecisionNode = memo(({ id, data, selected }: NodeProps<any>) => {
  return (
    <div
      className={`bg-slate-900 border-2 rounded-xl p-4 min-w-[260px] text-white shadow-xl transition-all ${
        selected ? "border-blue-500 ring-2 ring-blue-500/50" : "border-slate-700"
      }`}
    >
      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !w-3 !h-3"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          AI Decision Step
        </span>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">
          {id}
        </span>
      </div>

      {/* Prompt Editor */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-300 font-medium">Prompt Query:</label>
        <textarea
          rows={2}
          value={data.prompt || ""}
          onChange={(e) => data.onChangePrompt?.(id, e.target.value)}
          placeholder="e.g. Is this query related to software technical support?"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Output Handles (Bottom: YES/NO Branching) */}
      <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-800 text-[11px] font-bold">
        {/* YES Branch Handle */}
        <div className="flex items-center gap-1 text-emerald-400">
          <span>YES</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="!bg-emerald-500 !w-3 !h-3 !-bottom-1.5"
            style={{ left: "30%" }}
          />
        </div>

        {/* NO Branch Handle */}
        <div className="flex items-center gap-1 text-rose-400">
          <span>NO</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="!bg-rose-500 !w-3 !h-3 !-bottom-1.5"
            style={{ left: "70%" }}
          />
        </div>
      </div>
    </div>
  );
});

DecisionNode.displayName = "DecisionNode";