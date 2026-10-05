import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, objectToFormData, toSnakeCase } from "@/utils";

import type { UpdateUserAgentDTO } from "../types";
import type { AxiosError } from "axios";

const UPDATE_AGENT_URL = (id: string) => `/api/ai-agents/v1/user-created-agents/${id}/`;

interface UpdateAgentPayload {
  agentId: string;
  payload: UpdateUserAgentDTO;
}

const updateAgent = async (agentId: string, data: UpdateUserAgentDTO): Promise<void> => {
  const { workflowDefinition, tags, icon, coverImage, ...rest } = data;
  const snaked = toSnakeCase(rest);

  const formData = objectToFormData(snaked);

  if (workflowDefinition !== undefined) {
    formData.append("workflow_definition", workflowDefinition);
  }

  if (tags !== undefined) {
    formData.append("tags", JSON.stringify(tags));
  }

  if (icon !== undefined) {
    formData.append("icon", icon === null ? "null" : icon);
  }
  if (coverImage !== undefined) {
    formData.append("cover_image", coverImage === null ? "null" : coverImage);
  }

  try {
    await axios.put(UPDATE_AGENT_URL(agentId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateAgentPayload>({
    mutationFn: ({ agentId, payload }) => updateAgent(agentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-agent-detail", variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
  });
};

export { useUpdateAgent };
export type { UpdateAgentPayload };
