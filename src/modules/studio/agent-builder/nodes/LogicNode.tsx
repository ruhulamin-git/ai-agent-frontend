"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import React, { memo } from "react";

export interface LogicNodeData {
  label: string;
  conditions?: string[];
  [key: string]: unknown;
}

const LogicNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as LogicNodeData;
  const conditions = nodeData.conditions || ['If "Angry"', "Else"];

  return (
    <div
      className={`min-w-56 max-w-[18rem] bg-card border-2 rounded-xl shadow-xl transition-all ${
        selected
          ? "border-primary! shadow-[0_0_0_4px_rgba(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          : "border-orange-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <GitBranch size={14} className="text-orange-400" />
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-foreground">
            {nodeData.label || "Routing Logic"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5">
        {conditions.map((condition, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-2 py-1.5 bg-background border border-border rounded-md"
          >
            <span className="text-[0.625rem] font-medium text-foreground">{condition}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
    </div>
  );
});

LogicNode.displayName = "LogicNode";
export { LogicNode };
