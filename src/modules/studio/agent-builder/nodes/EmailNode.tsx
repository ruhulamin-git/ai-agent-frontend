"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Mail } from "lucide-react";
import React, { memo } from "react";

export interface EmailNodeData {
  label: string;
  recipient?: string;
  [key: string]: unknown;
}

const EmailNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as EmailNodeData;
  return (
    <div
      className={`min-w-56 max-w-[18rem] bg-card border-2 rounded-xl shadow-xl transition-all ${
        selected
          ? "border-primary! shadow-[0_0_0_4px_rgba(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          : "border-sky-400"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Mail size={14} className="text-sky-400" />
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-foreground">
            {nodeData.label || "Email Out"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="flex items-center justify-between min-h-6 px-2 py-1.5 bg-background border border-border rounded-md">
          <span className="text-[0.625rem] text-muted-foreground font-medium">
            To: {nodeData.recipient || "{{recipient}}"}
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

EmailNode.displayName = "EmailNode";
export { EmailNode };
