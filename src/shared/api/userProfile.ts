import { useQuery } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { UserProfile } from "@/shared/types";
import type { ExtractFnReturnType, QueryConfig } from "@/utils/reactQuery";

const GET_PROFILE_URL = `/api/users/v1/users/me`;

export const getUser = async (): Promise<UserProfile | null> => {
  try {
    const response = await axios.get(GET_PROFILE_URL);
    const profile = toCamelCase(response.data);
    return profile;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

type UseUserProfileOptions = {
  config?: QueryConfig<typeof getUser>;
};

const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const STALE_TIME_MINUTES = 5;
const GC_TIME_MINUTES = 10;
const STALE_TIME_MS = STALE_TIME_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
const GC_TIME_MS = GC_TIME_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
const RETRY_COUNT = 1;

const useUserProfile = ({ config }: UseUserProfileOptions = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery<ExtractFnReturnType<any>>({
    ...config,
    queryKey: ["user-profile"],
    queryFn: getUser,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: RETRY_COUNT,
  });
};

export { useUserProfile };
