import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { Conversation, ConversationListResponse } from "../../../user-agents-list/types";

const MARK_READ_URL = (userAgentId: string | number, conversationId: number) =>
  `/api/ai-agents/v1/user-agents/${userAgentId}/chat-history/${conversationId}/mark-read/`;

const markConversationRead = async (
  userAgentId: string | number,
  conversationId: number
): Promise<void> => {
  try {
    await axios.post(MARK_READ_URL(userAgentId, conversationId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseMarkConversationReadOptions {
  userAgentId: string | number;
}

export const useMarkConversationRead = ({ userAgentId }: UseMarkConversationReadOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: number) => markConversationRead(userAgentId, conversationId),
    onMutate: async (conversationId: number) => {
      // Optimistically set unreadCount to 0 for this conversation
      queryClient.setQueriesData<{ pages: ConversationListResponse[]; pageParams: number[] }>(
        { queryKey: ["chat-history", userAgentId] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((conv: Conversation) =>
                conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
              ),
            })),
          };
        }
      );
    },
  });
};
