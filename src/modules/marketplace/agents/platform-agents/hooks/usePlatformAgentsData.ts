import { useState } from "react";

import { usePlatformAgentsList } from "../services/getPlatformAgentsList";

import type { AgentType, PublishStatus } from "../../shared/types";

export const usePlatformAgentsData = () => {
  const [search, setSearch] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("All");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("All");

  const {
    data: agents = [],
    isLoading,
    isError,
    refetch,
  } = usePlatformAgentsList({
    search,
    agentType,
    publishStatus,
  });

  return {
    agents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    agentType,
    setAgentType,
    publishStatus,
    setPublishStatus,
  };
};
