import { useMutation } from "@tanstack/react-query";

import { axios, toSnakeCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { CreateReviewDTO, ReviewDTO } from "./types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const CREATE_REVIEW_URL = (agentId: string) => `/api/marketplace/v1/agents/${agentId}/reviews/`;

interface CreateReviewPayload {
  agentId: string;
  data: CreateReviewDTO;
}

const createReview = async ({ agentId, data }: CreateReviewPayload): Promise<ReviewDTO> => {
  const payload = toSnakeCase(data);

  try {
    const response = await axios.post(CREATE_REVIEW_URL(agentId), payload);
    return response.data; // Usually response.data in axios, adjust if data formatting requires it
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type CreateReviewOptions = {
  config?: MutationConfig<typeof createReview>;
};

const useCreateReviewMutation = ({ config }: CreateReviewOptions = {}) => {
  return useMutation<ReviewDTO, AxiosError, CreateReviewPayload>({
    mutationFn: createReview,
    ...config,
  });
};

export { useCreateReviewMutation };
