"use client";

import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface AgentChatPreviewProps {
  agent: Agent;
}

const ANIMATION_DELAY_MS = 1500;

export const AgentChatPreview = ({ agent }: AgentChatPreviewProps) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when agent changes
    setVisibleMessages(0);

    // Animate messages one by one
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (!agent.mockChat) return prev; // Guard against missing mockChat
        if (prev < agent.mockChat.length) return prev + 1;
        return prev;
      });
    }, ANIMATION_DELAY_MS);

    return () => clearInterval(interval);
  }, [agent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  if (!agent.mockChat) return null; // Handle case where chat data is missing

  return (
    <section id="chat-preview" className="w-full bg-slate-50 dark:bg-background">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <span className="material-symbols-outlined text-base">chat</span>
              Live Preview
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl mb-4">
              See {agent.name} in Action
            </h2>
            <p className="text-lg text-slate-600 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Watch how {agent.name} handles real conversations and automates your workflow.
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-xl overflow-hidden flex flex-col h-[500px]">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border bg-slate-50/50 dark:bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <AgentAvatar agent={agent} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-foreground">
                      {agent.name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-xs text-slate-500 dark:text-muted-foreground">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              {/* Chat Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/30 dark:bg-muted/10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
              >
                {agent.mockChat.map((msg, index) => {
                  if (index >= visibleMessages) return null;

                  const isUser = msg.role === "user";
                  const CONTENT_PREVIEW_LENGTH = 20;
                  const messageKey = `${agent.id}-${msg.role}-${index}-${msg.content.slice(
                    0,
                    CONTENT_PREVIEW_LENGTH
                  )}`;
                  return (
                    <div
                      key={messageKey}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      } animate-fade-in-up`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-white dark:bg-muted border border-slate-100 dark:border-border text-slate-800 dark:text-foreground rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {visibleMessages < agent.mockChat.length && visibleMessages % 2 !== 0 && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="bg-white dark:bg-muted/50 border border-slate-100 dark:border-border rounded-2xl px-4 py-3 rounded-tl-sm flex gap-1 items-center shadow-sm">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area (Mock) */}
              <div className="border-t border-slate-100 dark:border-border p-4 bg-white dark:bg-card">
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    placeholder="Type a message..."
                    className="w-full rounded-xl border border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/50 px-4 py-3 pr-14 text-sm text-slate-500 focus:outline-none cursor-not-allowed shadow-inner"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-md opacity-50 cursor-not-allowed">
                      <IconSend size={18} stroke={2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
