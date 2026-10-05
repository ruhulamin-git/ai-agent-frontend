import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { Conversation, ConversationListResponse } from "../../../user-agents-list/types";

const STATUS_URL = (userAgentId: string | number, conversationId: number) =>
  `/api/ai-agents/v1/user-agents/${userAgentId}/chat-history/${conversationId}/status/`;

interface UpdateStatusPayload {
  status: "active" | "paused";
}

const updateConversationStatus = async (
  userAgentId: string | number,
  conversationId: number,
  payload: UpdateStatusPayload
): Promise<void> => {
  try {
    await axios.patch(STATUS_URL(userAgentId, conversationId), payload);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseUpdateConversationStatusOptions {
  userAgentId: string | number;
}

interface MutationVariables {
  conversationId: number;
  status: "active" | "paused";
}

export const useUpdateConversationStatus = ({
  userAgentId,
}: UseUpdateConversationStatusOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, status }: MutationVariables) =>
      updateConversationStatus(userAgentId, conversationId, { status }),

    onMutate: async ({ conversationId, status }) => {
      // Optimistically update the conversation status in the cache
      queryClient.setQueriesData<{
        pages: ConversationListResponse[];
        pageParams: number[];
      }>({ queryKey: ["chat-history", userAgentId] }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((conv: Conversation) =>
              conv.id === conversationId ? { ...conv, status } : conv
            ),
          })),
        };
      });
    },

    onError: () => {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ["chat-history", userAgentId] });
    },
  });
};
