import { useQuery } from "@tanstack/react-query";

import { MOCK_AGENT_FLOWS, MOCK_AGENTS } from "./mock-data";

import type { StudioAgentDetail } from "../types";
import type { AxiosError } from "axios";

const MOCK_DETAIL_DELAY_MS = 200;

// API function — returns mock data for now, swap with axios call later
const getStudioAgent = async (agentId: string): Promise<StudioAgentDetail> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DETAIL_DELAY_MS));

  const agent = MOCK_AGENTS.find((a) => a.id === agentId);
  const flow = MOCK_AGENT_FLOWS[agentId];

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  return {
    ...agent,
    nodes: flow?.nodes ?? [],
    edges: flow?.edges ?? [],
  };
};

interface UseStudioAgentDetailOptions {
  agentId: string;
  config?: { enabled?: boolean };
}

const useStudioAgentDetail = ({ agentId, config }: UseStudioAgentDetailOptions) => {
  return useQuery<StudioAgentDetail, AxiosError>({
    queryKey: ["studio-agent-detail", agentId],
    queryFn: () => getStudioAgent(agentId),
    enabled: config?.enabled ?? !!agentId,
  });
};

export { useStudioAgentDetail };
export type { UseStudioAgentDetailOptions };
