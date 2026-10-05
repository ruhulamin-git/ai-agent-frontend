import { useState } from "react";

import { useStudioAgentsList } from "./services/getStudioAgents";

import type { StudioAgent } from "./types";

interface UseStudioAgentsDataOptions {
  initialSearch?: string;
}

const useStudioAgentsData = ({ initialSearch = "" }: UseStudioAgentsDataOptions = {}) => {
  const [search, setSearch] = useState(initialSearch);

  const {
    data: studioAgents = [] as StudioAgent[],
    isLoading,
    isError,
    refetch,
  } = useStudioAgentsList({ search });

  return {
    studioAgents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
  };
};

export { useStudioAgentsData };
