import { useState } from "react";

import { useUserAgentList } from "../services/getAgentList";

import type { UserAgent } from "../types";

interface UseAgentListDataOptions {
  initialSearch?: string;
}

const useAgentListData = ({ initialSearch = "" }: UseAgentListDataOptions = {}) => {
  const [search, setSearch] = useState(initialSearch);

  const {
    data: agents = [] as UserAgent[],
    isLoading,
    isError,
    refetch,
  } = useUserAgentList({ search });

  return {
    agents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
  };
};

export { useAgentListData };
