import { useInfiniteQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type {
  ConversationMessage,
  ConversationMessagesResponse,
} from "../../../user-agents-list/types";

const DEFAULT_PAGE_SIZE = 20;

const MESSAGES_URL = (
  userAgentId: string | number,
  conversationId: number,
  page: number,
  pageSize: number
) =>
  `/api/ai-agents/v1/user-agents/${userAgentId}/chat-history/${conversationId}/messages/?page=${page}&page_size=${pageSize}`;

const getConversationMessages = async (
  userAgentId: string | number,
  conversationId: number,
  page: number,
  pageSize: number
): Promise<ConversationMessagesResponse> => {
  try {
    const response = await axios.get(MESSAGES_URL(userAgentId, conversationId, page, pageSize));
    const data = toCamelCase(response);
    return {
      data: data.data ?? [],
      pagination: data.pagination ?? {
        currentPage: 1,
        numPages: 1,
        pageSize,
        totalCount: 0,
      },
    };
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

interface UseConversationMessagesOptions {
  userAgentId: string | number;
  conversationId: number | null;
  enabled?: boolean;
  pageSize?: number;
}

export const useConversationMessages = ({
  userAgentId,
  conversationId,
  enabled = true,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseConversationMessagesOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["conversation-messages", userAgentId, conversationId],
    queryFn: ({ pageParam = 1 }) =>
      getConversationMessages(userAgentId, conversationId as number, pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      const { currentPage, numPages } = lastPage.pagination;
      return currentPage < numPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!userAgentId && conversationId !== null,
  });

  // Deduplicate by id (pages can overlap when new messages shift offsets)
  // then reverse so oldest appear first (API returns newest-first)
  const messages: ConversationMessage[] = Array.from(
    new Map(
      (query.data?.pages ?? []).flatMap((page) => page.data).map((m) => [String(m.id), m])
    ).values()
  ).reverse();

  return {
    ...query,
    messages,
  };
};
