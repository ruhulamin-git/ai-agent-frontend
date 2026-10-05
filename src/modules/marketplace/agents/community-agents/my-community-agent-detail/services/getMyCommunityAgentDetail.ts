import { useQuery } from "@tanstack/react-query";

import { axios } from "@/utils/axios";
import { toCamelCase } from "@/utils/toCamelCase";

// import { getMyCommunityAgentDetailMock } from "./mockData";
import type { MyCommunityAgentDetail } from "../types";
import type { AxiosError } from "axios";

interface UseMyCommunityAgentDetailOptions {
  agentId: string | number;
  enabled?: boolean;
}

const getMyCommunityAgentDetail = async (id: string | number): Promise<MyCommunityAgentDetail> => {
  // Real API call to get subscription details
  const response = await axios.get(`/api/marketplace/v1/my-agents/${id}/`);
  return toCamelCase(response.data);

  // TODO: Remove mock when real API is working
  // const response = await getMyCommunityAgentDetailMock(id);
  // return response.data;
};

export const useMyCommunityAgentDetail = ({
  agentId,
  enabled = true,
}: UseMyCommunityAgentDetailOptions) => {
  return useQuery<MyCommunityAgentDetail, AxiosError>({
    queryKey: ["my-community-agent-detail", agentId],
    queryFn: () => getMyCommunityAgentDetail(agentId),
    enabled: enabled && !!agentId,
  });
};
