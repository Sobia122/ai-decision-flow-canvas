"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";

export const DecisionNode = memo(({ id, data, isConnectable }: NodeProps<any>) => {
  const statusColors = {
    IDLE: "border-slate-300 bg-white",
    RUNNING: "border-amber-500 bg-amber-50 animate-pulse shadow-lg shadow-amber-100",
    YES: "border-emerald-500 bg-emerald-50 shadow-md",
    NO: "border-rose-500 bg-rose-50 shadow-md",
    FAILED: "border-red-600 bg-red-100",
  };

  const currentStatus = (data.status as keyof typeof statusColors) || "IDLE";

  return (
    <div className={`p-4 rounded-xl border-2 w-72 transition-all ${statusColors[currentStatus]}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-slate-400" />

      <div className="flex items-center gap-2 mb-2 border-b pb-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span className="font-semibold text-xs uppercase tracking-wider text-slate-700">
          AI Decision Step
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">Decision Prompt:</label>
        <textarea
          value={data.prompt || ""}
          onChange={(e) => data.onChangePrompt && data.onChangePrompt(id, e.target.value)}
          placeholder="e.g. Is this a support request?"
          className="w-full text-xs p-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-16 bg-white"
        />
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t text-[10px] font-bold">
        <div className="flex items-center gap-1 text-emerald-700">
          <Handle
            type="source"
            position={Position.Bottom}
            id="YES"
            style={{ left: "25%" }}
            isConnectable={isConnectable}
            className="w-3 h-3 !bg-emerald-500"
          />
          <span>YES</span>
        </div>
        <div className="flex items-center gap-1 text-rose-700">
          <Handle
            type="source"
            position={Position.Bottom}
            id="NO"
            style={{ left: "75%" }}
            isConnectable={isConnectable}
            className="w-3 h-3 !bg-rose-500"
          />
          <span>NO</span>
        </div>
      </div>
    </div>
  );
});

DecisionNode.displayName = "DecisionNode";