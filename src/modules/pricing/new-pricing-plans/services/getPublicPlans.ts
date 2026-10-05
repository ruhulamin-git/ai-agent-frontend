import { useQuery } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { PublicPlan } from "../../types";
import type { QueryConfig } from "@/utils/reactQuery";

const GET_PUBLIC_PLANS_URL = "/api/plans/v1/subscription-plans/public/";

const getPublicPlans = async (): Promise<PublicPlan[]> => {
  try {
    const response = await axios.get(GET_PUBLIC_PLANS_URL);
    return toCamelCase(response.data) as PublicPlan[];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

type UsePublicPlansOptions = {
  config?: QueryConfig<typeof getPublicPlans>;
};

const usePublicPlans = ({ config }: UsePublicPlansOptions = {}) => {
  return useQuery({
    queryKey: ["public-plans"],
    queryFn: getPublicPlans,
    ...config,
  });
};

export { usePublicPlans };
