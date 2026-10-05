import { useState } from "react";

import { usePlatformAgentsList } from "../services/getPlatformAgentsList";

const DEFAULT_PAGE_SIZE = 12;

export const usePlatformAgentsData = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = usePlatformAgentsList({
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
