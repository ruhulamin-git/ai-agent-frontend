"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useCallback, useEffect, useState } from "react";

import { useSocket } from "@/shared/hooks/useSocket";
import { ASSESS_TOKEN, buildWebSocketUrl } from "@/utils";

import type {
  Conversation,
  ConversationListResponse,
  ConversationMessage,
  ConversationMessagesResponse,
  NewMessageSocketEvent,
} from "../../../user-agents-list/types";
import type { UseAgentChatSocketOptions } from "./types";
import type { WebSocketMessage } from "@/types/websocket";

export const useAgentChatSocket = ({ agentId, enabled = true }: UseAgentChatSocketOptions) => {
  const token = getCookie(ASSESS_TOKEN) as string;
  const queryClient = useQueryClient();
  const [isPageVisible, setIsPageVisible] = useState(true);

  const handleSocketMessage = useCallback(
    (raw: WebSocketMessage) => {
      // Dispatch based on event type
      if (raw.type === "conversation_updated") {
        const data = raw.data as { conversationId: number; status: string; isActive: boolean };
        if (!data?.conversationId) return;

        const conversationId = Number(data.conversationId);

        // Update conversation status in the chat-history cache
        queryClient.setQueriesData<{ pages: ConversationListResponse[]; pageParams: number[] }>(
          { queryKey: ["chat-history", agentId] },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((conv: Conversation) =>
                  conv.id === conversationId ? { ...conv, status: data.status } : conv
                ),
              })),
            };
          }
        );
        return;
      }

      // Handle new_message events
      const payload = raw.data as NewMessageSocketEvent["data"];
      if (!payload?.conversationId) return;

      // Only process actual new-message events — must have required fields
      if (!payload.messageId || !payload.content || !payload.createdAt) return;

      // Coerce IDs to numbers — WS JSON values may arrive as strings
      payload.messageId = Number(payload.messageId);
      payload.conversationId = Number(payload.conversationId);

      // Check if this conversation already exists in the cache
      const historyEntries =
        queryClient.getQueriesData<{ pages: ConversationListResponse[]; pageParams: number[] }>({
          queryKey: ["chat-history", agentId],
        }) ?? [];

      const existsInCache = historyEntries
        .flatMap(([, data]) => data?.pages?.flatMap((p) => p.data) ?? [])
        .some((conv) => conv.id === payload.conversationId);

      if (!existsInCache) {
        // New conversation — refetch from server to get the real entry.
        // The server response will already include the latest message,
        // so we skip the manual message append below.
        queryClient.invalidateQueries({ queryKey: ["chat-history", agentId] });
        return;
      }

      // 1. Update the conversation list cache: bump unread_count & last_message
      queryClient.setQueriesData<{ pages: ConversationListResponse[]; pageParams: number[] }>(
        { queryKey: ["chat-history", agentId] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((conv: Conversation) =>
                conv.id === payload.conversationId
                  ? {
                      ...conv,
                      unreadCount: conv.unreadCount + 1,
                      messageCount: conv.messageCount + 1,
                      lastMessageAt: payload.createdAt,
                      lastMessage: {
                        id: payload.messageId,
                        content: payload.content,
                        direction: payload.direction,
                        createdAt: payload.createdAt,
                      },
                    }
                  : conv
              ),
            })),
          };
        }
      );

      // 2. Append the new message to the conversation messages cache (deduplicated)
      queryClient.setQueriesData<{
        pages: ConversationMessagesResponse[];
        pageParams: number[];
      }>({ queryKey: ["conversation-messages", agentId, payload.conversationId] }, (oldData) => {
        if (!oldData) return oldData;

        const newMessage: ConversationMessage = {
          id: payload.messageId,
          direction: payload.direction,
          messageType: payload.messageType,
          content: payload.content,
          senderName: null,
          status: payload.status,
          createdAt: payload.createdAt,
          updatedAt: payload.createdAt,
        };

        // Check if this message already exists (by server id) or if there's
        // an optimistic placeholder (negative id, same content & direction)
        const allMessages = oldData.pages.flatMap((p) => p.data);
        const alreadyExists = allMessages.some((m) => m.id === payload.messageId);
        const hasOptimistic = allMessages.some(
          (m) => m.id < 0 && m.content === payload.content && m.direction === payload.direction
        );

        if (alreadyExists) return oldData;

        // Replace optimistic message with the real one, or append
        const updatedPages = oldData.pages.map((page, idx) => {
          if (hasOptimistic) {
            let replaced = false;
            return {
              ...page,
              data: page.data.map((m) => {
                if (
                  !replaced &&
                  m.id < 0 &&
                  m.content === payload.content &&
                  m.direction === payload.direction
                ) {
                  replaced = true;
                  return newMessage;
                }
                return m;
              }),
            };
          }
          // No optimistic — prepend to first page (newest, descending order)
          if (idx === 0) {
            return { ...page, data: [newMessage, ...page.data] };
          }
          return page;
        });

        return { ...oldData, pages: updatedPages };
      });
    },
    [agentId, queryClient]
  );

  const wsUrl = enabled && agentId ? buildWebSocketUrl(`agent-chat/${agentId}`, token) : "";

  const { isConnected, isConnecting, error, connect, disconnect, sendMessage } = useSocket({
    url: wsUrl,
    onOpen: () => {
      // eslint-disable-next-line no-console
      console.log(`✅ WebSocket connected — /ws/agent-chat/${agentId}/`);
    },
    onMessage: handleSocketMessage,
    onClose: () => {
      // eslint-disable-next-line no-console
      console.log("❌ WebSocket disconnected for agent", agentId);
    },
    onError: (event) => {
      console.error("⚠️ WebSocket error:", event);
    },
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  });

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Auto-connect / disconnect based on visibility
  useEffect(() => {
    if (!enabled || !agentId) return;

    if (isPageVisible) {
      connect();
    } else if (isConnected) {
      disconnect();
    }
  }, [isPageVisible, agentId, enabled, isConnected, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};
