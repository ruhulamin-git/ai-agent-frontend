"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { LogIn } from "lucide-react";
import React, { memo } from "react";

export interface EntryNodeData {
  label: string;
  trigger?: string;
  [key: string]: unknown;
}

const EntryNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as EntryNodeData;
  return (
    <div
      className={`min-w-56 max-w-[18rem] bg-card border-2 rounded-xl shadow-xl transition-all ${
        selected
          ? "border-primary! shadow-[0_0_0_4px_rgba(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          : "border-primary"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <LogIn size={14} className="text-primary" />
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-foreground">
            Entry Point
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="text-[0.6875rem] text-muted-foreground">
          {nodeData.trigger || "Triggers on User Input via Chat Widget"}
        </div>
        <div className="flex items-center justify-between min-h-6 px-2 py-1.5 bg-background border border-border rounded-md">
          <span className="text-[0.625rem] italic text-muted-foreground">
            {nodeData.label || "User Query"}
          </span>
          <div className="w-2 h-2 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" />
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

EntryNode.displayName = "EntryNode";
export { EntryNode };
