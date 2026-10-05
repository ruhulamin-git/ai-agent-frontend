"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Database } from "lucide-react";
import React, { memo } from "react";

export interface VectorDBNodeData {
  label: string;
  collection?: string;
  [key: string]: unknown;
}

const VectorDBNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as VectorDBNodeData;
  return (
    <div
      className={`builder-node builder-node--vectordb ${selected ? "builder-node--selected" : ""}`}
    >
      <Handle type="target" position={Position.Top} className="builder-handle" />
      <div className="builder-node__header">
        <div className="builder-node__header-left">
          <Database size={14} className="text-violet-400" />
          <span className="builder-node__title">{nodeData.label || "Vector DB"}</span>
        </div>
      </div>
      <div className="builder-node__body">
        <div className="builder-node__input-preview">
          <span className="builder-node__meta-text">
            Collection: {nodeData.collection || "default"}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="builder-handle" />
    </div>
  );
});

VectorDBNode.displayName = "VectorDBNode";
export { VectorDBNode };
