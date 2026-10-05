"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { CheckCircle, Terminal } from "lucide-react";
import React, { memo } from "react";

export interface PromptNodeData {
  label: string;
  prompt?: string;
  model?: string;
  outputVar?: string;
  [key: string]: unknown;
}

const PromptNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as PromptNodeData;
  return (
    <div
      className={`min-w-56 max-w-[18rem] bg-card border-2 rounded-xl shadow-xl transition-all ${
        selected
          ? "border-primary! shadow-[0_0_0_4px_rgba(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          : "border-indigo-500"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! bg-primary! border-2! border-card! rounded-full! transition-all hover:scale-150 hover:shadow-[0_0_8px_rgba(var(--primary)/0.6)]"
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Terminal size={14} className="text-primary" />
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-foreground">
            {nodeData.label || "Prompt Block"}
          </span>
        </div>
        <CheckCircle size={12} className="text-emerald-400" />
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="p-2 bg-muted/50 text-[0.625rem] font-mono whitespace-pre-wrap rounded break-all border border-border/50 text-foreground">
          {nodeData.prompt ||
            "You are an analyzer. Determine the tone of the following text: {{user_query}}. Return JSON."}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[0.625rem] text-muted-foreground font-medium">
            Output: {nodeData.outputVar || "sentiment_json"}
          </span>
          <span className="text-[0.625rem] text-muted-foreground font-medium">
            {nodeData.model || "GPT-4o"}
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

PromptNode.displayName = "PromptNode";
export { PromptNode };
