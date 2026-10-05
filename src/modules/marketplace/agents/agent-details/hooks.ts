import { useCommunityAgentDetails } from "../community-agents/services/getCommunityAgentDetails";
import { useExternalAgentDetails } from "../external-agents/services/getExternalAgentDetails";
import { usePlatformAgentDetails } from "../platform-agents/services/getPlatformAgentDetails";

type AgentType = "platform" | "community" | "external";

export const useAgentDetail = (id: string | number, agentType: AgentType = "platform") => {
  const platformQuery = usePlatformAgentDetails({ id, enabled: agentType === "platform" });
  const communityQuery = useCommunityAgentDetails({ id, enabled: agentType === "community" });
  const externalQuery = useExternalAgentDetails({ id, enabled: agentType === "external" });

  const query =
    agentType === "community"
      ? communityQuery
      : agentType === "external"
      ? externalQuery
      : platformQuery;

  const { data: agent, isLoading, isError, refetch, error } = query;

  return {
    agent,
    isLoading,
    isError,
    refetch,
    error,
  };
};

// Backward compatibility - keep the old function signature
export const useAgentDetailLegacy = (id: string | number, isPublic = false) => {
  return useAgentDetail(id, isPublic ? "community" : "platform");
};
