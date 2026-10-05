import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/utils/delay";

import { getConnectedAccountsData, setConnectedAccountsData } from "./getConnectedAccounts";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELAY_MEDIUM = 500;

const disconnectAccount = async (accountId: string): Promise<void> => {
  await delay(DELAY_MEDIUM);
  const accounts = getConnectedAccountsData();
  const filteredAccounts = accounts.filter((acc) => acc.id !== accountId);
  setConnectedAccountsData(filteredAccounts);
};

interface UseDisconnectAccountOptions {
  config?: MutationConfig<typeof disconnectAccount>;
}

export const useDisconnectAccount = ({ config }: UseDisconnectAccountOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: disconnectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-agent", "accounts"] });
    },
    ...config,
  });
};
