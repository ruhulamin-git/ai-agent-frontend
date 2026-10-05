import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios, handleApiError, objectToFormData, toCamelCase, toSnakeCase } from "@/utils";

import type { CreateUserAgentDTO, UserAgent } from "../types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const CREATE_AGENT_URL = "/api/ai-agents/v1/user-created-agents/";

const createAgent = async (data: CreateUserAgentDTO): Promise<UserAgent> => {
  const { workflowDefinition, tags, icon, coverImage, ...rest } = data;
  const snaked = toSnakeCase(rest);

  const formData = objectToFormData(snaked);

  // Append workflow_definition as JSON string
  formData.append("workflow_definition", workflowDefinition);

  // Append tags as JSON string
  formData.append("tags", JSON.stringify(tags));

  // Append file fields
  if (icon) {
    formData.append("icon", icon);
  }
  if (coverImage) {
    formData.append("cover_image", coverImage);
  }

  try {
    const response = await axios.post(CREATE_AGENT_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return toCamelCase(response.data?.data ?? response.data) as UserAgent;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type CreateAgentOptions = {
  config?: MutationConfig<typeof createAgent>;
};

const useCreateAgent = ({ config }: CreateAgentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<UserAgent, AxiosError, CreateUserAgentDTO>({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-created-agents-list"] });
    },
    ...config,
  });
};

export { useCreateAgent };
