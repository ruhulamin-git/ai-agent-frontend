import type { Agent } from "../../shared/types";
import type { ApiAgent } from "../../shared/utils/mapping";

export interface UseAgentsOptions {
  search?: string;
  category?: string;
  agentType?: string;
  publishStatus?: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<Agent[], import("axios").AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export interface AgentsApiResponse {
  data: ApiAgent[];
  pagination: {
    currentPage: number;
    numPages: number;
    pageSize: number;
    totalCount: number;
  };
}
