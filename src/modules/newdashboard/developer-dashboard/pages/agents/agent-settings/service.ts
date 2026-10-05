import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, toCamelCase, toSnakeCase } from "@/utils";

import type { AxiosError } from "axios";

const GET_AGENT_DETAIL_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;
const PUBLISH_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/publish/`;
const UNPUBLISH_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/publish/`;
const DELETE_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;
const GET_PRICING_PLANS_URL = (agentId: string) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/`;
const CREATE_PRICING_PLAN_URL = (agentId: string) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/`;
const UPDATE_PRICING_PLAN_URL = (agentId: string, planId: number) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/${planId}/`;
const DELETE_PRICING_PLAN_URL = (agentId: string, planId: number) =>
  `/api/marketplace/v1/agents/${agentId}/pricing-plans/${planId}/`;

export interface UserAgent {
  id: number;
  name: string;
  description: string;
  agentType: string;
  welcomeMessage: string;
  sourceType: string;
  publishStatus: "draft" | "published" | "pending_review";
  isPublished: boolean;
  tags: string[];
  iconUrl: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  shortDescription?: string;
  longDescription?: string;
  demoUrl?: string;
  workflowDefinition?: Record<string, unknown>;
}
export interface PublishAgentResponse {
  message: string;
  data: {
    id: number;
    name: string;
    publishStatus: "published" | "draft" | "pending_review";
    isPublished: boolean;
    publishedAt: string | null;
  };
}

export type PricingType = "free" | "monthly" | "yearly" | "lifetime";

export interface AgentPricingPlan {
  id: number;
  agent: number;
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  stripePriceId: string | null;
  stripeProductId: string | null;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingPlanDTO {
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
  features?: string[];
}

export type UpdatePricingPlanDTO = Partial<CreatePricingPlanDTO>;

export interface CreatePricingPlanParams {
  agentId: string;
  payload: CreatePricingPlanDTO;
}

export interface UpdatePricingPlanParams {
  agentId: string;
  planId: number;
  payload: UpdatePricingPlanDTO;
}

export interface DeletePricingPlanParams {
  agentId: string;
  planId: number;
}

// Get Agent Detail
const getAgentDetail = async (agentId: string): Promise<UserAgent> => {
  try {
    const response = await axios.get(GET_AGENT_DETAIL_URL(agentId));
    return toCamelCase(response.data?.data ?? response.data) as UserAgent;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useGetAgentDetail = (agentId: string) => {
  return useQuery<UserAgent, AxiosError>({
    queryKey: ["user-agent-detail", agentId],
    queryFn: () => getAgentDetail(agentId),
    enabled: !!agentId,
    refetchOnMount: true,
    staleTime: 0,
  });
};

// Publish Agent
const publishAgent = async (agentId: string): Promise<PublishAgentResponse> => {
  try {
    const response = await axios.post(PUBLISH_AGENT_URL(agentId));
    return toCamelCase(response.data) as PublishAgentResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const usePublishAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishAgentResponse, AxiosError, string>({
    mutationFn: publishAgent,
    onSuccess: (_data, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
  });
};

// Unpublish Agent
const unpublishAgent = async (agentId: string): Promise<PublishAgentResponse> => {
  try {
    const response = await axios.delete(UNPUBLISH_AGENT_URL(agentId));
    return toCamelCase(response.data) as PublishAgentResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useUnpublishAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<PublishAgentResponse, AxiosError, string>({
    mutationFn: unpublishAgent,
    onSuccess: (_data, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
  });
};

// Delete Agent
const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await axios.delete(DELETE_AGENT_URL(agentId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteAgent,
    onSuccess: (_data, agentId) => {
      queryClient.removeQueries({ queryKey: ["user-agent-detail", agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
  });
};

// Get Pricing Plans
const getPricingPlans = async (agentId: string): Promise<AgentPricingPlan[]> => {
  try {
    const response = await axios.get(GET_PRICING_PLANS_URL(agentId));
    const raw = response.data?.data ?? response.data;
    return (Array.isArray(raw) ? raw : []).map(
      (item: Record<string, unknown>) => toCamelCase(item) as AgentPricingPlan
    );
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useGetPricingPlans = (agentId: string) => {
  return useQuery<AgentPricingPlan[], AxiosError>({
    queryKey: ["agent-pricing-plans", agentId],
    queryFn: () => getPricingPlans(agentId),
    enabled: !!agentId,
  });
};

// Create Pricing Plan
const createPricingPlan = async ({
  agentId,
  payload,
}: CreatePricingPlanParams): Promise<AgentPricingPlan> => {
  try {
    const response = await axios.post(CREATE_PRICING_PLAN_URL(agentId), toSnakeCase(payload));
    return toCamelCase(response.data?.data ?? response.data) as AgentPricingPlan;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useCreatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<AgentPricingPlan, AxiosError, CreatePricingPlanParams>({
    mutationFn: createPricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
  });
};

// Update Pricing Plan
const updatePricingPlan = async ({
  agentId,
  planId,
  payload,
}: UpdatePricingPlanParams): Promise<AgentPricingPlan> => {
  try {
    const response = await axios.put(
      UPDATE_PRICING_PLAN_URL(agentId, planId),
      toSnakeCase(payload)
    );
    return toCamelCase(response.data?.data ?? response.data) as AgentPricingPlan;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useUpdatePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<AgentPricingPlan, AxiosError, UpdatePricingPlanParams>({
    mutationFn: updatePricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
  });
};

// Delete Pricing Plan
const deletePricingPlan = async ({ agentId, planId }: DeletePricingPlanParams): Promise<void> => {
  try {
    await axios.delete(DELETE_PRICING_PLAN_URL(agentId, planId));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export const useDeletePricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, DeletePricingPlanParams>({
    mutationFn: deletePricingPlan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent-pricing-plans", variables.agentId],
      });
    },
  });
};
