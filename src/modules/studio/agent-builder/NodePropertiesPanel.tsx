"use client";

import { Copy, Terminal, Trash2, X } from "lucide-react";
import React from "react";

import type { Node } from "@xyflow/react";

interface NodePropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onClose,
  onUpdate,
}) => {
  if (!node) return null;

  const data = node.data as Record<string, unknown>;

  const handleChange = (key: string, value: unknown) => {
    onUpdate(node.id, { ...data, [key]: value });
  };

  return (
    <aside className="border-l border-border bg-card shrink-0 w-72 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="text-[0.8125rem] font-bold text-foreground">Node Properties</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground cursor-pointer bg-transparent border-none p-1 rounded transition-colors hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Node Identity */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Terminal size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-[0.8125rem] font-semibold text-foreground capitalize">
                {node.type || "Node"}
              </h3>
              <p className="text-[0.6875rem] text-muted-foreground">ID: {node.id.slice(0, 12)}</p>
            </div>
          </div>

          {/* Node Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="node-name" className="text-[0.7rem] font-medium text-muted-foreground">
              Node Name
            </label>
            <input
              id="node-name"
              className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] text-foreground outline-none transition-colors focus:border-primary"
              type="text"
              value={(data.label as string) || ""}
              onChange={(e) => handleChange("label", e.target.value)}
            />
          </div>

          {/* Model Selection - only for prompt and model nodes */}
          {(node.type === "prompt" || node.type === "model") && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="model-select"
                className="text-[0.7rem] font-medium text-muted-foreground"
              >
                Model Selection
              </label>
              <select
                id="model-select"
                className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] text-foreground outline-none transition-colors cursor-pointer focus:border-primary"
                value={(data.model as string) || "GPT-4o"}
                onChange={(e) => handleChange("model", e.target.value)}
              >
                <option>GPT-4o (Recommended)</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Llama 3 70B</option>
                <option>Gemini 1.5 Pro</option>
              </select>
            </div>
          )}

          {/* Temperature - only for prompt and model nodes */}
          {(node.type === "prompt" || node.type === "model") && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="temperature"
                  className="text-[0.7rem] font-medium text-muted-foreground"
                >
                  Temperature
                </label>
                <span className="text-xs font-mono text-primary">
                  {((data.temperature as number) ?? 0.7).toFixed(1)}
                </span>
              </div>
              <input
                id="temperature"
                className="w-full accent-primary h-1 bg-background rounded-full cursor-pointer"
                type="range"
                min={0}
                max={100}
                value={((data.temperature as number) ?? 0.7) * 100}
                onChange={(e) => handleChange("temperature", Number(e.target.value) / 100)}
              />
              <div className="flex justify-between text-[0.6rem] text-muted-foreground mt-0.5">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          )}

          {/* System Prompt - only for prompt nodes */}
          {node.type === "prompt" && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="system-message"
                className="text-[0.7rem] font-medium text-muted-foreground"
              >
                System Message
              </label>
              <textarea
                id="system-message"
                className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] font-mono text-foreground outline-none resize-none transition-colors focus:border-primary"
                rows={4}
                value={(data.prompt as string) || ""}
                onChange={(e) => handleChange("prompt", e.target.value)}
              />
            </div>
          )}

          {/* Output Variable - for prompt nodes */}
          {node.type === "prompt" && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="output-var"
                className="text-[0.7rem] font-medium text-muted-foreground"
              >
                Output Variable
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-primary">res_</span>
                <input
                  id="output-var"
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] text-foreground outline-none transition-colors focus:border-primary font-mono"
                  type="text"
                  value={(data.outputVar as string) || "output"}
                  onChange={(e) => handleChange("outputVar", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* API endpoint - for api nodes */}
          {node.type === "apiTool" && (
            <>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="http-method"
                  className="text-[0.7rem] font-medium text-muted-foreground"
                >
                  HTTP Method
                </label>
                <select
                  id="http-method"
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] text-foreground outline-none transition-colors cursor-pointer focus:border-primary"
                  value={(data.method as string) || "GET"}
                  onChange={(e) => handleChange("method", e.target.value)}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="endpoint"
                  className="text-[0.7rem] font-medium text-muted-foreground"
                >
                  Endpoint
                </label>
                <input
                  id="endpoint"
                  className="w-full bg-background border border-border rounded-lg px-2.5 py-2 text-[0.8125rem] text-foreground outline-none transition-colors focus:border-primary font-mono"
                  type="text"
                  value={(data.endpoint as string) || "/api/endpoint"}
                  onChange={(e) => handleChange("endpoint", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Advanced Settings */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[0.65rem] font-bold uppercase text-muted-foreground">
            Advanced Settings
          </h4>
          <div className="flex items-center justify-between text-[0.8125rem] text-foreground">
            <span>Retry on failure</span>
            <button
              className={`relative w-9 h-5 rounded-full cursor-pointer border-none transition-colors ${
                (data.retry as boolean) ? "bg-primary" : "bg-border"
              }`}
              onClick={() => handleChange("retry", !(data.retry as boolean))}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform ${
                  (data.retry as boolean) ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between text-[0.8125rem] text-foreground">
            <span>Streaming</span>
            <button
              className={`relative w-9 h-5 rounded-full cursor-pointer border-none transition-colors ${
                (data.streaming as boolean) ? "bg-primary" : "bg-border"
              }`}
              onClick={() => handleChange("streaming", !(data.streaming as boolean))}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform ${
                  (data.streaming as boolean) ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-border grid grid-cols-2 gap-2 mt-auto">
        <button className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-[0.7rem] font-semibold cursor-pointer transition-colors border border-border bg-transparent text-foreground hover:bg-accent">
          <Copy size={12} />
          Duplicate
        </button>
        <button className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-[0.7rem] font-semibold cursor-pointer transition-colors border border-red-500/30 bg-transparent text-red-500 hover:bg-red-500/10">
          <Trash2 size={12} />
          Delete Node
        </button>
      </div>
    </aside>
  );
};
