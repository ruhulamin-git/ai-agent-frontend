import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useCommunityAgentsList } from "../community-agents/services/getCommunityAgentsList";

import { useAgentsList } from "./services/getAgentsList";
import { usePublicAgentsList } from "./services/getPublicAgentsList";

import type { AgentType, Category, PublishStatus } from "../shared/types";

interface UseAgentsDataOptions {
  isPublic?: boolean;
}

export const useAgentsData = ({ isPublic = false }: UseAgentsDataOptions = {}) => {
  const searchParams = useSearchParams();

  // Get initial category from URL or default to "internal"
  const initialCategory = (searchParams.get("tab") as Category) || "internal";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>(initialCategory);
  const [agentType, setAgentType] = useState<AgentType>("All");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("All");
  const [page, setPage] = useState(1);

  const isCommunity = category === "user_created";

  const privateQuery = useAgentsList({
    search,
    category,
    agentType,
    publishStatus,
    enabled: !isPublic && !isCommunity,
  });
  const publicQuery = usePublicAgentsList({
    search,
    category,
    agentType,
    publishStatus,
    enabled: isPublic && !isCommunity,
  });

  const communityQuery = useCommunityAgentsList({
    search: search || undefined,
    page,
    pageSize: 12,
    enabled: isCommunity,
  });

  const platformQuery = isPublic ? publicQuery : privateQuery;

  const agents = isCommunity ? communityQuery.data?.agents ?? [] : platformQuery.data ?? [];
  const isLoading = isCommunity ? communityQuery.isLoading : platformQuery.isLoading;
  const isError = isCommunity ? communityQuery.isError : platformQuery.isError;
  const refetch = isCommunity ? communityQuery.refetch : platformQuery.refetch;
  const pagination = communityQuery.data?.pagination ?? {
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  };

  return {
    agents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    category,
    setCategory,
    agentType,
    setAgentType,
    publishStatus,
    setPublishStatus,
    page,
    setPage,
    pagination,
    isCommunity,
  };
};
