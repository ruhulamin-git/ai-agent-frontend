import { useMutation, useQuery } from "@tanstack/react-query";

import { toCamelCase, toSnakeCase } from "@/utils";
import { axios } from "@/utils/axios";

import type { CreateExternalAgentDTO, ExternalAgent, UpdateExternalAgentDTO } from "./types";
import type { MutationConfig, QueryConfig } from "@/utils/reactQuery";

const EXTERNAL_AGENTS_BASE_URL = "/api/external-agents/v1/external-agents";

const getExternalAgentsList = async (): Promise<ExternalAgent[]> => {
  try {
    const response = await axios.get(`${EXTERNAL_AGENTS_BASE_URL}/`);
    return toCamelCase(response).data;
  } catch (_error) {
    return [];
  }
};

interface UseExternalAgentsListOptions {
  config?: QueryConfig<typeof getExternalAgentsList>;
}

export const useExternalAgentsList = ({ config }: UseExternalAgentsListOptions = {}) => {
  return useQuery({
    queryKey: ["external-agents"],
    queryFn: getExternalAgentsList,
    retry: false, // Don't retry if backend is not ready
    ...config,
  });
};

const getExternalAgentDetails = async (id: number): Promise<ExternalAgent> => {
  const response = await axios.get(`${EXTERNAL_AGENTS_BASE_URL}/${id}/`);
  return toCamelCase(response).data;
};

interface UseExternalAgentDetailsOptions {
  id: number;
  config?: QueryConfig<typeof getExternalAgentDetails>;
}

export const useExternalAgentDetails = ({ id, config }: UseExternalAgentDetailsOptions) => {
  return useQuery({
    queryKey: ["external-agents", id],
    queryFn: () => getExternalAgentDetails(id),
    ...config,
  });
};

const createExternalAgent = async (data: CreateExternalAgentDTO): Promise<ExternalAgent> => {
  const formData = new FormData();
  const snakeCaseData = toSnakeCase(data);

  // Add all fields to FormData
  Object.entries(snakeCaseData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === "object") {
        // Convert objects to JSON string
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await axios.post(`${EXTERNAL_AGENTS_BASE_URL}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return toCamelCase(response).data;
};

interface UseCreateExternalAgentOptions {
  config?: MutationConfig<typeof createExternalAgent>;
}

export const useCreateExternalAgent = ({ config }: UseCreateExternalAgentOptions = {}) => {
  return useMutation({
    mutationFn: createExternalAgent,
    ...config,
  });
};

const updateExternalAgent = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateExternalAgentDTO;
}): Promise<ExternalAgent> => {
  const response = await axios.put(`${EXTERNAL_AGENTS_BASE_URL}/${id}/`, toSnakeCase(data));
  return toCamelCase(response).data;
};

const updateExternalAgentWithFiles = async (
  id: number,
  formData: FormData
): Promise<ExternalAgent> => {
  const response = await axios.put(`${EXTERNAL_AGENTS_BASE_URL}/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
  return toCamelCase(response).data;
};

interface UseUpdateExternalAgentOptions {
  config?: MutationConfig<typeof updateExternalAgent>;
}

export const useUpdateExternalAgent = ({ config }: UseUpdateExternalAgentOptions = {}) => {
  return useMutation({
    mutationFn: updateExternalAgent,
    ...config,
  });
};

const deleteExternalAgent = async (id: number): Promise<void> => {
  await axios.delete(`${EXTERNAL_AGENTS_BASE_URL}/${id}/`);
};

interface UseDeleteExternalAgentOptions {
  config?: MutationConfig<typeof deleteExternalAgent>;
}

export const useDeleteExternalAgent = ({ config }: UseDeleteExternalAgentOptions = {}) => {
  return useMutation({
    mutationFn: deleteExternalAgent,
    ...config,
  });
};

const verifyExternalAgent = async (id: number): Promise<ExternalAgent> => {
  const response = await axios.post(`${EXTERNAL_AGENTS_BASE_URL}/${id}/verify/`);
  return toCamelCase(response).data;
};

interface UseVerifyExternalAgentOptions {
  config?: MutationConfig<typeof verifyExternalAgent>;
}

export const useVerifyExternalAgent = ({ config }: UseVerifyExternalAgentOptions = {}) => {
  return useMutation({
    mutationFn: verifyExternalAgent,
    ...config,
  });
};

interface HealthStatus {
  healthStatus: "healthy" | "degraded" | "down" | "unknown";
  isVerified: boolean;
  lastHealthCheck?: string;
}

const getHealthStatus = async (id: number): Promise<HealthStatus> => {
  const response = await axios.get(`${EXTERNAL_AGENTS_BASE_URL}/${id}/health/`);
  return toCamelCase(response).data;
};

interface UseHealthStatusOptions {
  id: number;
  config?: QueryConfig<typeof getHealthStatus>;
}

export const useHealthStatus = ({ id, config }: UseHealthStatusOptions) => {
  return useQuery({
    queryKey: ["external-agents", id, "health"],
    queryFn: () => getHealthStatus(id),
    ...config,
  });
};

export { updateExternalAgentWithFiles };
