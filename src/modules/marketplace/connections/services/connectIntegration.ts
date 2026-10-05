import { useMutation } from "@tanstack/react-query";

import { axios, handleApiError, toSnakeCase } from "@/utils";

import type { ConnectIntegrationDTO } from "../types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const CONNECT_INTEGRATION_URL = "/api/integration/v1/user-integrations/connect/";

const connectIntegration = async (data: ConnectIntegrationDTO): Promise<void> => {
  const payload = toSnakeCase(data);

  try {
    await axios.post(CONNECT_INTEGRATION_URL, payload);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type ConnectIntegrationOptions = {
  config?: MutationConfig<typeof connectIntegration>;
};

const useConnectIntegration = ({ config }: ConnectIntegrationOptions = {}) => {
  return useMutation<void, AxiosError, ConnectIntegrationDTO>({
    mutationFn: connectIntegration,
    ...config,
  });
};

export { useConnectIntegration };
