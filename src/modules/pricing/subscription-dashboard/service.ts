import { useQuery } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { CurrentSubscription } from "../types";
import type { QueryConfig } from "@/utils/reactQuery";

const GET_CURRENT_SUBSCRIPTION_URL = "/api/subscriptions/v1/subscriptions/current/";

const getCurrentSubscription = async (): Promise<CurrentSubscription | null> => {
  try {
    const response = await axios.get(GET_CURRENT_SUBSCRIPTION_URL);
    
    // Handle different response structures
    let subscriptionData = response.data?.data || response.data;
    
    // If no subscription data at all
    if (!subscriptionData) return null;
    
    // If response is an error or no actual subscription
    if (subscriptionData.status === "error" || !subscriptionData.id) return null;
    
    // Convert to camelCase and return
    const camelData = toCamelCase(subscriptionData) as CurrentSubscription;
    
    // Additional safety check - ensure subscription has required fields
    if (!camelData.isActive || camelData.isExpired) {
      return null;
    }
    
    return camelData;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

type UseCurrentSubscriptionOptions = {
  config?: QueryConfig<typeof getCurrentSubscription>;
};

const useCurrentSubscription = ({ config }: UseCurrentSubscriptionOptions = {}) => {
  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: getCurrentSubscription,
    ...config,
  });
};

export { useCurrentSubscription };
