"use client";

import { ArrowLeft, Check, Download, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { AgentKitLogo } from "@/shared/ui";

interface BuilderHeaderProps {
  agentName?: string;
  agentId?: string;
  backUrl?: string;
  isEditMode?: boolean;
  onSave?: () => void;
  onNameChange?: (name: string) => void;
  isPending?: boolean;
  onImport?: (file: File) => void;
  onExport?: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  agentName,
  agentId,
  backUrl,
  isEditMode = false,
  onSave,
  onNameChange,
  isPending = false,
  onImport,
  onExport,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(agentName || "New Agent");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external name changes
  useEffect(() => {
    if (agentName) {
      setEditValue(agentName);
    }
  }, [agentName]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = () => {
    const trimmed = editValue.trim();
    const finalName = trimmed || "New Agent";
    setEditValue(finalName);
    setIsEditing(false);
    onNameChange?.(finalName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      commitEdit();
    } else if (e.key === "Escape") {
      setEditValue(agentName || "New Agent");
      setIsEditing(false);
    }
  };

  return (
    <header className="h-14 px-6 border-b border-border bg-card flex items-center justify-between shrink-0">
      <div className="flex items-center gap-6">
        {backUrl && (
          <Link
            href={backUrl}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
        )}
        <div className="flex items-center gap-2">
          <AgentKitLogo size="sm" showText={false} />
          <h2 className="text-base font-bold tracking-tight text-foreground">AI Agent Studio</h2>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-[0.8125rem] text-muted-foreground">Projects /</span>
          {isEditing ? (
            <div className="inline-flex items-center gap-1.5">
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-b border-primary text-foreground text-sm font-semibold outline-none px-0.5 py-0 min-w-[120px] max-w-[280px]"
                style={{ width: `${Math.max(editValue.length, 8)}ch` }}
              />
              <Check
                size={12}
                className="text-primary cursor-pointer hover:scale-110 transition-transform"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commitEdit();
                }}
              />
            </div>
          ) : (
            <span
              className="text-[0.8125rem] font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isEditMode && agentId) {
                  router.push(`/dashboard/ai-studio/${agentId}/settings`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (isEditMode && agentId) {
                    router.push(`/dashboard/ai-studio/${agentId}/settings`);
                  }
                }
              }}
            >
              {editValue}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-5">
          <button
            className="text-[0.8125rem] font-medium text-foreground bg-none border-none cursor-pointer p-0"
            type="button"
          >
            Editor
          </button>
        </nav>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-[0.8125rem] font-semibold cursor-pointer transition-all border-none bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            type="button"
            title="Import workflow from JSON"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImport?.(file);
                e.target.value = "";
              }
            }}
          />
          <button
            className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-[0.8125rem] font-semibold cursor-pointer transition-all border-none bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            type="button"
            title="Export workflow as JSON"
            onClick={onExport}
          >
            <Download size={14} />
            Export
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[0.8125rem] font-semibold cursor-pointer transition-all border border-primary/30 bg-primary/15 text-primary hover:bg-primary/25">
            Test Run
          </button>
          <button
            className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[0.8125rem] font-semibold cursor-pointer transition-all border-none bg-primary text-primary-foreground hover:shadow-[0_0_15px_rgba(var(--primary)/0.5)]"
            onClick={onSave}
            disabled={isPending}
          >
            {isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
            {isEditMode ? "Update Agent" : "Create Agent"}
          </button>
        </div>
      </div>
    </header>
  );
};
