import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/utils/delay";

import { getConnectedAccountsData, setConnectedAccountsData } from "./getConnectedAccounts";

import type { ConnectedAccount } from "./types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const DELAY_SLOW = 800;
const RADIX_BASE = 36;
const ID_START = 2;
const ID_LENGTH = 9;

const connectAccount = async (email: string): Promise<ConnectedAccount> => {
  await delay(DELAY_SLOW);
  const newAccount: ConnectedAccount = {
    id: Math.random()
      .toString(RADIX_BASE)
      .slice(ID_START, ID_START + ID_LENGTH),
    email,
    provider: "gmail",
    connectedAt: new Date().toISOString(),
  };
  const accounts = getConnectedAccountsData();
  accounts.push(newAccount);
  setConnectedAccountsData(accounts);
  return newAccount;
};

interface UseConnectAccountOptions {
  config?: MutationConfig<typeof connectAccount>;
}

export const useConnectAccount = ({ config }: UseConnectAccountOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation<ConnectedAccount, AxiosError, string>({
    mutationFn: connectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-agent", "accounts"] });
    },
    ...config,
  });
};
