"use client";

import {
  Bot,
  Database,
  GitBranch,
  Globe,
  LogIn,
  Mail,
  Search,
  Settings,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface BlockItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: "core" | "integrations";
}

const BLOCKS: BlockItem[] = [
  {
    type: "entry",
    label: "Entry Point",
    icon: <LogIn size={18} className="text-primary" />,
    category: "core",
  },
  {
    type: "prompt",
    label: "Prompt Block",
    icon: <Terminal size={18} className="text-primary" />,
    category: "core",
  },
  {
    type: "logic",
    label: "Logic Switch",
    icon: <GitBranch size={18} className="text-orange-400" />,
    category: "core",
  },
  {
    type: "apiTool",
    label: "API Tool",
    icon: <Globe size={18} className="text-emerald-400" />,
    category: "core",
  },
  {
    type: "model",
    label: "Model Selector",
    icon: <Bot size={18} className="text-blue-400" />,
    category: "core",
  },
  {
    type: "vectorDB",
    label: "Vector DB",
    icon: <Database size={18} className="text-violet-400" />,
    category: "integrations",
  },
  {
    type: "email",
    label: "Email Out",
    icon: <Mail size={18} className="text-sky-400" />,
    category: "integrations",
  },
];

const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
  event.dataTransfer.setData("application/reactflow-type", nodeType);
  event.dataTransfer.setData("application/reactflow-label", label);
  event.dataTransfer.effectAllowed = "move";
};

interface BlockPaletteProps {
  agentId?: string;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ agentId }) => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const coreBlocks = BLOCKS.filter(
    (b) => b.category === "core" && b.label.toLowerCase().includes(search.toLowerCase())
  );
  const integrationBlocks = BLOCKS.filter(
    (b) => b.category === "integrations" && b.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex flex-col border-r border-border bg-card shrink-0 w-64">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            className="w-full bg-background border border-border rounded-lg py-2 pr-3 pl-8 text-xs outline-none text-foreground transition-colors focus:border-primary placeholder:text-muted-foreground"
            placeholder="Search components..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5">
        {/* Core Blocks */}
        {coreBlocks.length > 0 && (
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Core Blocks
            </h3>
            <div className="flex flex-col gap-1.5">
              {coreBlocks.map((block) => (
                <div
                  key={block.type}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-border/30 border border-border cursor-grab transition-all hover:border-primary/50 hover:bg-primary/10 active:cursor-grabbing"
                  role="button"
                  tabIndex={0}
                  draggable
                  onDragStart={(e) => onDragStart(e, block.type, block.label)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") e.preventDefault();
                  }}
                >
                  {block.icon}
                  <span className="text-[0.8125rem] text-foreground">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {integrationBlocks.length > 0 && (
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Integrations
            </h3>
            <div className="flex flex-col gap-1.5">
              {integrationBlocks.map((block) => (
                <div
                  key={block.type}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-border/30 border border-border cursor-grab transition-all hover:border-primary/50 hover:bg-primary/10 active:cursor-grabbing"
                  role="button"
                  tabIndex={0}
                  draggable
                  onDragStart={(e) => onDragStart(e, block.type, block.label)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") e.preventDefault();
                  }}
                >
                  {block.icon}
                  <span className="text-[0.8125rem] text-foreground">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Agents placeholder */}
        <div>
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Sub-Agents
          </h3>
          <div className="p-3 rounded-lg border border-dashed border-border text-center">
            <p className="text-[0.7rem] text-muted-foreground">
              Drag existing agents here to chain workflows
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border mt-auto">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-background border border-border text-[0.8125rem] text-foreground cursor-pointer transition-colors hover:bg-accent"
          onClick={() => {
            if (agentId) {
              router.push(`/dashboard/ai-studio/${agentId}/settings`);
            }
          }}
        >
          <Settings size={14} />
          Project Settings
        </button>
      </div>
    </aside>
  );
};
