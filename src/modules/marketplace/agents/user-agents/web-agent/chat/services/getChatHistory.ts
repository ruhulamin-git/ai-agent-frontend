import { useInfiniteQuery } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase } from "@/utils";

import type { Conversation, ConversationListResponse } from "../../../user-agents-list/types";

const DEFAULT_PAGE_SIZE = 20;

const CHAT_HISTORY_URL = (userAgentId: string | number, page: number, pageSize: number) =>
  `/api/ai-agents/v1/user-agents/${userAgentId}/chat-history/?page=${page}&page_size=${pageSize}`;

const getChatHistory = async (
  userAgentId: string | number,
  page: number,
  pageSize: number
): Promise<ConversationListResponse> => {
  try {
    const response = await axios.get(CHAT_HISTORY_URL(userAgentId, page, pageSize));
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

interface UseChatHistoryOptions {
  userAgentId: string | number;
  enabled?: boolean;
  pageSize?: number;
}

export const useChatHistory = ({
  userAgentId,
  enabled = true,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseChatHistoryOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["chat-history", userAgentId],
    queryFn: ({ pageParam = 1 }) => getChatHistory(userAgentId, pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      const { currentPage, numPages } = lastPage.pagination;
      return currentPage < numPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!userAgentId,
  });

  // Flatten all pages into a single conversations array
  const conversations: Conversation[] = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    conversations,
  };
};
