"use client";

import { useQuery } from "@tanstack/react-query";

import type { AgentPlan } from "../agent-settings/types";

const MOCK_AGENT_PLANS: Record<string, AgentPlan[]> = {
  "agent-1": [
    {
      id: "plan-1",
      name: "Basic",
      price: 20,
      duration: "1 month",
      usageLimit: "500,000",
      freeTrialDays: 7,
      features: [],
    },
    {
      id: "plan-2",
      name: "Pro",
      price: 50,
      duration: "6 months",
      usageLimit: "5,000,000",
      freeTrialDays: 14,
      features: [],
    },
  ],
  "agent-2": [],
  "agent-3": [],
  "agent-4": [
    {
      id: "plan-1",
      name: "Business Team Plan",
      price: 999,
      duration: "1 year",
      usageLimit: "20,000,000",
      freeTrialDays: 30,
      features: [],
    },
  ],
};

const MOCK_DELAY_MS = 500;

const fetchAgentPlans = async (agentId: string): Promise<AgentPlan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AGENT_PLANS[agentId] ?? []);
    }, MOCK_DELAY_MS);
  });
};

const useGetAgentPlans = (agentId: string) => {
  return useQuery<AgentPlan[]>({
    queryKey: ["agent-plans", agentId],
    queryFn: () => fetchAgentPlans(agentId),
  });
};

export { useGetAgentPlans };
