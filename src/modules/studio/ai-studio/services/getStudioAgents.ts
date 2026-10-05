import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { MOCK_AGENTS } from "./mock-data";

import type { StudioAgent, UseStudioAgentsListOptions } from "../types";
import type { AxiosError } from "axios";

const MOCK_LIST_DELAY_MS = 300;

// API function — returns mock data for now, swap with axios call later
const getStudioAgents = async (params: { search?: string } = {}): Promise<StudioAgent[]> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LIST_DELAY_MS));

  let agents = [...MOCK_AGENTS];

  if (params.search) {
    const query = params.search.toLowerCase();
    agents = agents.filter(
      (a) => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
    );
  }

  return agents;
};

const useStudioAgentsList = ({ search, enabled = true }: UseStudioAgentsListOptions = {}) => {
  return useQuery<StudioAgent[], AxiosError>({
    queryKey: ["studio-agents-list", { search }],
    queryFn: () => getStudioAgents({ search }),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export { useStudioAgentsList };
