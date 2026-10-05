import { useMutation } from "@tanstack/react-query";

import { axios, handleApiError } from "@/utils";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELETE_USER_INTEGRATION_URL = (id: number) => `/api/integration/v1/user-integrations/${id}/`;

const deleteUserIntegration = async (id: number): Promise<void> => {
  try {
    await axios.delete(DELETE_USER_INTEGRATION_URL(id));
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type DeleteUserIntegrationOptions = {
  config?: MutationConfig<typeof deleteUserIntegration>;
};

const useDeleteUserIntegration = ({ config }: DeleteUserIntegrationOptions = {}) => {
  return useMutation<void, AxiosError, number>({
    mutationFn: deleteUserIntegration,
    ...config,
  });
};

export { useDeleteUserIntegration };
