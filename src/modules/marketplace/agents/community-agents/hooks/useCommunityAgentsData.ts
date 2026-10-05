import { useState } from "react";

import { useCommunityAgentsList } from "../services/getCommunityAgentsList";

const DEFAULT_PAGE_SIZE = 12;

export const useCommunityAgentsData = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCommunityAgentsList({
    search,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const agents = data?.agents ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  };

  return {
    agents,
    pagination,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    page,
    setPage,
  };
};
