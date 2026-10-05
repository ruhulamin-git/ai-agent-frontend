import { useQuery } from "@tanstack/react-query";

import { delay } from "@/utils/delay";

import type { ConnectedAccount } from "./types";
import type { QueryConfig } from "@/utils/reactQuery";

const DELAY_MEDIUM = 500;

// Mock database - will be replaced with API calls
let connectedAccounts: ConnectedAccount[] = [
  {
    id: "1",
    email: "demo@gmail.com",
    provider: "gmail",
    connectedAt: new Date().toISOString(),
  },
];

export const getConnectedAccountsData = () => connectedAccounts;
export const setConnectedAccountsData = (accounts: ConnectedAccount[]) => {
  connectedAccounts = accounts;
};

const getConnectedAccounts = async (): Promise<ConnectedAccount[]> => {
  await delay(DELAY_MEDIUM);
  return [...connectedAccounts];
};

interface UseConnectedAccountsOptions {
  enabled?: boolean;
  config?: QueryConfig<() => Promise<ConnectedAccount[]>>;
}

export const useConnectedAccounts = ({
  enabled = true,
  config,
}: UseConnectedAccountsOptions = {}) => {
  return useQuery<ConnectedAccount[], Error>({
    queryKey: ["email-agent", "accounts"],
    queryFn: getConnectedAccounts,
    enabled,
    ...config,
  });
};
