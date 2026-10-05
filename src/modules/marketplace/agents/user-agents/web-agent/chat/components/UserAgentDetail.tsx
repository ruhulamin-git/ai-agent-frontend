"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useUserAgentDetails } from "../../settings/services";
import { useAgentChatSocket } from "../hooks";
import {
  useChatHistory,
  useConversationMessages,
  useMarkConversationRead,
  useSendMessage,
  useUpdateConversationStatus,
} from "../services";

import { ChatPanel } from "./ChatPanel";
import { ChatSidebar } from "./ChatSidebar";
import { UserAgentDetailSkeleton } from "./UserAgentDetailSkeleton";

// Workaround for React 19 types compatibility with framer-motion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.ComponentType<any>;

export const UserAgentDetail = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id as string;
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userAgent, isLoading, isError } = useUserAgentDetails({ agentId });

  // Chat history (sidebar)
  const {
    conversations,
    isLoading: isConversationsLoading,
    hasNextPage: hasMoreConversations,
    isFetchingNextPage: isFetchingMoreConversations,
    fetchNextPage: fetchMoreConversations,
  } = useChatHistory({ userAgentId: agentId });

  // Messages for selected conversation
  const {
    messages,
    isLoading: isMessagesLoading,
    hasNextPage: hasMoreMessages,
    isFetchingNextPage: isFetchingMoreMessages,
    fetchNextPage: fetchMoreMessages,
  } = useConversationMessages({
    userAgentId: agentId,
    conversationId: selectedConversationId,
  });

  // WebSocket for real-time inbound updates
  const { isConnected } = useAgentChatSocket({ agentId });

  // Mark conversation as read
  const { mutate: markRead } = useMarkConversationRead({ userAgentId: agentId });

  // Send message via REST API
  const { mutate: sendMessageRest } = useSendMessage({ userAgentId: agentId });

  // Toggle conversation status (active/paused)
  const { mutate: updateStatus } = useUpdateConversationStatus({ userAgentId: agentId });

  // Find the selected conversation object
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const handleSelectConversation = useCallback(
    (conversationId: number) => {
      setSelectedConversationId(conversationId);
      markRead(conversationId);
    },
    [markRead]
  );

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!selectedConversationId) {
        toast.info(t("pages.my_agents.select_conversation_first"));
        return;
      }
      sendMessageRest({ conversationId: selectedConversationId, message });
    },
    [selectedConversationId, sendMessageRest, t]
  );

  const handleToggleStatus = useCallback(
    (paused: boolean) => {
      if (!selectedConversationId) return;
      updateStatus({
        conversationId: selectedConversationId,
        status: paused ? "paused" : "active",
      });
    },
    [selectedConversationId, updateStatus]
  );

  if (isLoading) {
    return <UserAgentDetailSkeleton />;
  }

  if (isError || !userAgent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-4xl text-slate-300">error_outline</span>
        <p className="text-slate-500">{t("pages.my_agents.agent_not_found")}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/my-agents")}>
          {t("pages.my_agents.go_back")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-primary/5 rounded-xl overflow-hidden"
      >
        <div className="flex h-175">
          {/* Left Sidebar */}
          <div className="w-85 shrink-0 border-r bg-card dark:bg-primary/2 border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("pages.my_agents.messages")}
                </h2>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/my-agents/${agentId}/settings`}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                      <span className="material-symbols-outlined text-xl text-slate-500">
                        settings
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-slate-400">
                    search
                  </span>
                  <Input
                    placeholder={t("pages.my_agents.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-0"
                  />
                </div>
                <Button size="icon" className="h-10 w-10 rounded-xl bg-primary">
                  <span className="material-symbols-outlined text-black">edit</span>
                </Button>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-hidden">
              <ChatSidebar
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                isLoading={isConversationsLoading}
                hasNextPage={hasMoreConversations}
                isFetchingNextPage={isFetchingMoreConversations}
                onLoadMore={fetchMoreConversations}
                searchQuery={searchQuery}
              />
            </div>

            {/* Back Button at bottom */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-slate-600 dark:text-slate-400"
                onClick={() => router.push("/dashboard/my-agents")}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {t("pages.my_agents.back_to_my_agents")}
              </Button>
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="flex-1 flex flex-col bg-card dark:bg-primary/2">
            <ChatPanel
              conversation={selectedConversation}
              messages={messages}
              agentName={userAgent.name}
              isLoading={isMessagesLoading}
              hasNextPage={hasMoreMessages}
              isFetchingNextPage={isFetchingMoreMessages}
              onLoadMore={fetchMoreMessages}
              onSendMessage={handleSendMessage}
              onToggleStatus={handleToggleStatus}
              isConnected={isConnected}
            />
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};
