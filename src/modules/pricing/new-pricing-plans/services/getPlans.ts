import { useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

import { axios, toCamelCase } from "@/utils";
import { ASSESS_TOKEN } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";

import type { AuthenticatedPlan, CurrentSubscription } from "../../types";
import type { QueryConfig } from "@/utils/reactQuery";

const GET_PLANS_URL = "/api/plans/v1/subscription-plans/";
const GET_PUBLIC_PLANS_URL = "/api/plans/v1/subscription-plans/public/";
const GET_CURRENT_SUBSCRIPTION_URL = "/api/subscriptions/v1/subscriptions/current/";

const getPlans = async (): Promise<AuthenticatedPlan[]> => {
  const token = getCookie(ASSESS_TOKEN);

  try {
    // Fetch plans using the appropriate endpoint based on authentication status
    const plansResponse = await axios.get(token ? GET_PLANS_URL : GET_PUBLIC_PLANS_URL);

    // Some endpoints return { data: [...] }, others return the array directly
    const rawPlans = (plansResponse as any)?.data || plansResponse;
    const plans = toCamelCase(rawPlans) as AuthenticatedPlan[];

    // If no plans found, return empty array
    if (!Array.isArray(plans)) return [];

    // Fetch current subscription only if authenticated
    let currentPlanId: number | null = null;
    if (token) {
      try {
        const subscriptionResponse = await axios.get(GET_CURRENT_SUBSCRIPTION_URL);
        const subscriptionData = (subscriptionResponse as any)?.data || subscriptionResponse;

        if (subscriptionData) {
          const subscription = toCamelCase(subscriptionData) as CurrentSubscription;
          
          // Only mark as current plan if subscription is active and not expired
          const isActive = subscription?.isActive && !subscription?.isExpired;
          const statusIsActive = subscription?.status?.status === "active";
          
          if (isActive && statusIsActive) {
            currentPlanId = subscription?.plan?.id || null;
          }
        }
      } catch (error) {
        // Log error but don't fail the whole plans request if subscription fetch fails
        console.error("Error fetching current subscription:", error);
      }
    }

    // Mark the current plan
    return plans.map((plan) => ({
      ...plan,
      isCurrentPlan: currentPlanId !== null && plan.id === currentPlanId,
    }));
  } catch (error: any) {
    // Suppress 401 errors for unauthenticated users to avoid the "Authentication credentials" toast
    if (token || (Axios.isAxiosError(error) && error.response?.status !== 401)) {
      handleApiError(error);
    }
    return [];
  }
};

type UsePlansOptions = {
  config?: QueryConfig<typeof getPlans>;
};

const usePlans = ({ config }: UsePlansOptions = {}) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => getCookie(ASSESS_TOKEN));

  useEffect(() => {
    const handleAuthChange = () => {
      const newToken = getCookie(ASSESS_TOKEN);
      setToken(newToken);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [queryClient]);

  return useQuery({
    queryKey: ["plans", token],
    queryFn: getPlans,
    ...config,
  });
};

export { usePlans };
