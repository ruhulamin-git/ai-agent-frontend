import { QueryClient } from "@tanstack/react-query";

import type { DefaultOptions, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const MINUTES_TO_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;
const STALE_TIME_MINUTES = 5;
const GC_TIME_MINUTES = 10;

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: false,
    staleTime: STALE_TIME_MINUTES * MINUTES_TO_MS, // 5 minutes - data stays fresh
    gcTime: GC_TIME_MINUTES * MINUTES_TO_MS, // 10 minutes - data stays in cache
    networkMode: "online", // Only run queries when online
  },
  mutations: {
    retry: false, // Don't retry mutations on error
    networkMode: "online",
  },
};

const queryClient = new QueryClient({ defaultOptions: queryConfig });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractFnReturnType<FnType extends (...args: any[]) => any> =
  ReturnType<FnType> extends Promise<infer T> ? T : ReturnType<FnType>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryConfig<QueryFnType extends (...args: any[]) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MutationConfig<MutationFnType extends (...args: any[]) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;

export { queryClient };
export type { ExtractFnReturnType, MutationConfig, QueryConfig };
