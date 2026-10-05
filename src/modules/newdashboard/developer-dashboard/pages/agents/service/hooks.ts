import { useQuery } from "@tanstack/react-query";

import { getAgentList } from "./getAgentList";

import type { UserAgent, UseUserAgentListOptions } from "./types";
import type { AxiosError } from "axios";

export const useUserAgentList = ({
  search,
  enabled = true,
  config,
}: UseUserAgentListOptions = {}) => {
  return useQuery<UserAgent[], AxiosError>({
    queryKey: ["user-created-agents-list", { search }],
    queryFn: () => getAgentList({ search }),
    enabled,
    refetchOnMount: true,
    ...config,
  });
};
