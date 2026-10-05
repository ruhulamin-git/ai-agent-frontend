import { useState } from "react";

import { useUserAgentsList } from "./service";

import type { UserAgent } from "./types";

interface UseUserAgentsDataOptions {
  initialStatus?: string;
}

export const useUserAgentsData = ({ initialStatus = "all" }: UseUserAgentsDataOptions = {}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(initialStatus);

  const {
    data: userAgents = [] as UserAgent[],
    isLoading,
    isError,
    refetch,
  } = useUserAgentsList({
    search,
    status: status === "all" ? undefined : status,
  });

  // Filter agents based on search locally for better UX
  const filteredAgents = userAgents.filter((agent: UserAgent) => {
    const matchesSearch = search
      ? agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.agent.description.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesSearch;
  });

  return {
    userAgents: filteredAgents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    status,
    setStatus,
  };
};
