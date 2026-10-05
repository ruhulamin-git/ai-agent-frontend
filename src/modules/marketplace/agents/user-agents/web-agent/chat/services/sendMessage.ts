import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type {
  Conversation,
  ConversationListResponse,
  ConversationMessage,
  ConversationMessagesResponse,
} from "../../../user-agents-list/types";

const SEND_MESSAGE_URL = (userAgentId: string | number, conversationId: number) =>
  `/api/ai-agents/v1/user-agents/${userAgentId}/chat-history/${conversationId}/messages/`;

interface SendMessagePayload {
  message: string;
  messageType: string;
}

const sendMessageApi = async (
  userAgentId: string | number,
  conversationId: number,
  payload: SendMessagePayload
): Promise<ConversationMessage> => {
  try {
    const response = await axios.post(SEND_MESSAGE_URL(userAgentId, conversationId), {
      message: payload.message,
      message_type: payload.messageType,
    });
    return toCamelCase(response.data ?? response);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseSendMessageOptions {
  userAgentId: string | number;
}

interface MutationVariables {
  conversationId: number;
  message: string;
  messageType?: string;
}

export const useSendMessage = ({ userAgentId }: UseSendMessageOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, message, messageType = "text" }: MutationVariables) =>
      sendMessageApi(userAgentId, conversationId, { message, messageType }),

    onMutate: async ({ conversationId, message }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["conversation-messages", userAgentId, conversationId],
      });

      // Optimistic message
      const optimisticMessage: ConversationMessage = {
        id: -Date.now(), // temporary negative id
        direction: "outbound",
        messageType: "text",
        content: message,
        senderName: null,
        status: "sending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Prepend to the first page of conversation messages (newest page, descending order)
      queryClient.setQueriesData<{
        pages: ConversationMessagesResponse[];
        pageParams: number[];
      }>({ queryKey: ["conversation-messages", userAgentId, conversationId] }, (oldData) => {
        if (!oldData) return oldData;
        const updatedPages = [...oldData.pages];
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            data: [optimisticMessage, ...updatedPages[0].data],
          };
        }
        return { ...oldData, pages: updatedPages };
      });

      // Update conversation list: bump lastMessage
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
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessageAt: optimisticMessage.createdAt,
                    lastMessage: {
                      id: optimisticMessage.id,
                      content: optimisticMessage.content,
                      direction: optimisticMessage.direction,
                      createdAt: optimisticMessage.createdAt,
                    },
                  }
                : conv
            ),
          })),
        };
      });

      return { optimisticMessage };
    },

    onSuccess: (serverMessage, { conversationId }) => {
      // Replace optimistic message with the server response
      queryClient.setQueriesData<{
        pages: ConversationMessagesResponse[];
        pageParams: number[];
      }>({ queryKey: ["conversation-messages", userAgentId, conversationId] }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((msg) =>
              msg.id < 0 && msg.content === serverMessage.content ? serverMessage : msg
            ),
          })),
        };
      });
    },

    onError: (_error, { conversationId }) => {
      // Remove optimistic message on error
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", userAgentId, conversationId],
      });
    },
  });
};
