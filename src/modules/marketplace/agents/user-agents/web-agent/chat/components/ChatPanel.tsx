"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

import type { Conversation, ConversationMessage } from "../../../user-agents-list/types";

const SCROLL_THRESHOLD = 50;

interface ChatPanelProps {
  conversation: Conversation | null;
  messages: ConversationMessage[];
  agentName: string;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
  onSendMessage?: (message: string) => void;
  onToggleStatus?: (paused: boolean) => void;
  isConnected?: boolean;
}

export const ChatPanel = ({
  conversation,
  messages,
  agentName,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onSendMessage,
  onToggleStatus,
}: ChatPanelProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLenRef = useRef(0);
  const prevScrollHeightRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive (not when loading older pages)
  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesLenRef.current;
    prevMessagesLenRef.current = messages.length;

    if (isNewMessage && !isFetchingNextPage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isFetchingNextPage]);

  // Scroll to bottom on initial load / conversation switch
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [conversation?.id, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preserve scroll position when older messages are loaded at the top
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isFetchingNextPage) {
      // Save scroll height before new older messages are inserted
      prevScrollHeightRef.current = container.scrollHeight;
    } else if (prevScrollHeightRef.current > 0) {
      // After older messages rendered, restore relative scroll position
      const newScrollHeight = container.scrollHeight;
      container.scrollTop += newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [isFetchingNextPage, messages.length]);

  // Upward infinite scroll — load older messages when near top
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const isNearTop = container.scrollTop < SCROLL_THRESHOLD;

    if (isNearTop) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage?.(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  // Group messages by date
  const groupByDate = (msgs: ConversationMessage[]) => {
    const groups: Array<{ date: string; messages: ConversationMessage[] }> = [];
    msgs.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      const existing = groups.find((g) => g.date === date);
      if (existing) {
        existing.messages.push(msg);
      } else {
        groups.push({ date, messages: [msg] });
      }
    });
    return groups;
  };

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-card dark:bg-primary/5 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">forum</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {t("pages.my_agents.select_conversation")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("pages.my_agents.choose_chat_from_sidebar")}
        </p>
      </div>
    );
  }

  const messageGroups = groupByDate(messages);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-card dark:bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-400 dark:bg-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-white">person</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {conversation.participantName}
            </h3>
            <p className="text-xs text-slate-400">
              {conversation.conversationType} ·{" "}
              {t("pages.my_agents.messages_count", { count: conversation.messageCount })}
            </p>
          </div>

          {/* Auto-reply toggle */}
          {onToggleStatus && (
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 dark:border-slate-700">
              <label
                htmlFor="auto-reply-switch"
                className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                {conversation.status === "paused"
                  ? t("pages.my_agents.manual")
                  : t("pages.my_agents.auto")}
              </label>
              <Switch
                id="auto-reply-switch"
                checked={conversation.status !== "paused"}
                onCheckedChange={(checked) => onToggleStatus(!checked)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex-1 p-6 space-y-6 overflow-hidden">
            <div className="flex justify-start">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64 rounded-2xl rounded-tl-none" />
                <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-none" />
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-72 rounded-2xl rounded-tr-none" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-20 w-80 rounded-2xl rounded-tl-none" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-40 rounded-2xl rounded-tr-none" />
            </div>
          </div>
        ) : (
          <>
            {/* Older messages loader */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              </div>
            )}
            {messageGroups.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-6">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs font-medium text-slate-400 px-4">
                    {group.date ===
                    new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                      ? t("pages.my_agents.today")
                      : group.date}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                {/* Messages in this date group */}
                {group.messages.map((msg) => {
                  const isOutbound = msg.direction === "outbound";

                  if (isOutbound) {
                    // Outbound (agent reply) — RIGHT SIDE
                    return (
                      <div key={msg.id} className="flex justify-end mb-4">
                        <div className="max-w-[65%] flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-baseline justify-end gap-2 mb-1">
                              <span className="text-xs text-slate-400">
                                {formatTime(msg.createdAt)}
                              </span>
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                {agentName}
                              </span>
                            </div>
                            <div className="bg-linear-to-br from-primary/70 to-primary/50 text-black px-4 py-3 rounded-2xl rounded-tr-sm shadow-md">
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-base">smart_toy</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Inbound (visitor message) — LEFT SIDE
                  return (
                    <div key={msg.id} className="flex justify-start mb-4">
                      <div className="max-w-[65%] flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-400 dark:bg-primary/30 flex items-center justify-center text-white shrink-0">
                          <span className="material-symbols-outlined text-base">person</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                              {msg.senderName ?? conversation.participantName}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          <div className="bg-slate-300 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-card dark:bg-primary/2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0 text-slate-400">
            <span className="material-symbols-outlined">add_circle</span>
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("pages.my_agents.type_message")}
            className="flex-1 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-0"
          />
          <Button variant="ghost" size="icon" className="shrink-0 text-slate-400">
            <span className="material-symbols-outlined">sentiment_satisfied</span>
          </Button>
          <Button
            onClick={handleSend}
            size="icon"
            className="shrink-0 h-10 w-10 rounded-xl bg-primary"
          >
            <span className="material-symbols-outlined text-white">send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
