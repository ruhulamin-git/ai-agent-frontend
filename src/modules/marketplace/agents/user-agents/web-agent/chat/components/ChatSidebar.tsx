"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { Skeleton } from "@/shared/ui/skeleton";

import type { Conversation } from "../../../user-agents-list/types";

// Time constants
const ONE_MINUTE_MS = 60000;
const ONE_HOUR_MS = 3600000;
const ONE_DAY_MS = 86400000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const AVATAR_COLORS_COUNT = 8;
const NAME_INITIALS_LENGTH = 2;

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
  searchQuery?: string;
}

export const ChatSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  searchQuery = "",
}: ChatSidebarProps) => {
  const { t } = useTranslation();

  // Filter by search
  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.lastMessage?.content ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const stableLoadMore = useCallback(() => {
    onLoadMore();
  }, [onLoadMore]);

  const { handleScroll } = useInfiniteScroll({
    hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore: stableLoadMore,
  });

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / ONE_MINUTE_MS);
    const diffHours = Math.floor(diffMs / ONE_HOUR_MS);
    const diffDays = Math.floor(diffMs / ONE_DAY_MS);

    if (diffMins < MINUTES_PER_HOUR) return t("pages.my_agents.min_ago", { count: diffMins });
    if (diffHours < HOURS_PER_DAY) return t("pages.my_agents.hour_ago", { count: diffHours });
    if (diffDays === 1) return t("pages.my_agents.yesterday");
    if (diffDays < DAYS_PER_WEEK) return t("pages.my_agents.days_ago", { count: diffDays });
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  // Generate consistent color from string
  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-purple-500",
      "bg-cyan-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++)
      hash = id.charCodeAt(i) + ((hash << AVATAR_COLORS_COUNT) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= NAME_INITIALS_LENGTH) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, NAME_INITIALS_LENGTH).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div className="px-5 py-3">
          <Skeleton className="h-4 w-24" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5">
            <Skeleton className="h-11 w-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">
          chat_bubble_outline
        </span>
        <p className="text-sm text-slate-500">{t("pages.my_agents.no_conversations_yet")}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" onScroll={handleScroll}>
      {/* Section Header */}
      <div className="px-5 py-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t("pages.my_agents.conversations")}
        </p>
      </div>

      {filteredConversations.map((conversation) => {
        const isSelected = selectedConversationId === conversation.id;
        const displayTime = conversation.lastMessage?.createdAt ?? conversation.createdAt;
        const lastMessageText =
          conversation.lastMessage?.content ?? t("pages.my_agents.no_messages_yet");
        const lastMessagePreview =
          conversation.lastMessage?.direction === "outbound"
            ? `${t("pages.my_agents.you")}: ${lastMessageText}`
            : lastMessageText;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
              isSelected
                ? "bg-slate-200 dark:bg-slate-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-11 h-11 rounded-full ${getAvatarColor(
                conversation.participantId
              )} flex items-center justify-center text-white font-bold text-sm shrink-0`}
            >
              {getInitials(conversation.participantName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {conversation.participantName}
                </span>
                <span className="text-xs text-slate-400 shrink-0">{formatTime(displayTime)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {lastMessagePreview}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="shrink-0 min-w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center px-1.5">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
};
