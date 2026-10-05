"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Globe } from "lucide-react";
import React, { memo } from "react";

export interface APIToolNodeData {
  label: string;
  endpoint?: string;
  method?: string;
  [key: string]: unknown;
}

const APIToolNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as APIToolNodeData;
  return (
    <div
      className={`min-w-56 max-w-[18rem] bg-card border-2 rounded-xl shadow-xl transition-all ${
        selected
          ? "border-primary! shadow-[0_0_0_4px_rgba(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          : "border-emerald-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Globe size={14} className="text-emerald-400" />
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-foreground">
            {nodeData.label || "API Tool"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="flex items-center justify-between min-h-6 px-2 py-1.5 bg-background border border-border rounded-md">
          <span className="text-[0.625rem] text-muted-foreground font-medium">
            {nodeData.method || "GET"} {nodeData.endpoint || "/api/endpoint"}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
    </div>
  );
});

APIToolNode.displayName = "APIToolNode";
export { APIToolNode };
