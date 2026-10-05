import { getCookie } from "cookies-next";
import { toast } from "sonner";

import { axios } from "@/utils/axios";
import { ASSESS_TOKEN } from "@/utils/constants";

import type { MyAgentSubscription } from "./types";

async function handleSubscriptionRequest(
  subscription: MyAgentSubscription,
  action = "complete_payment"
): Promise<MyAgentSubscription> {
  const pricingPlan = (subscription as any).pricing_plan || (subscription as any).pricingPlan;

  if (!pricingPlan) {
    throw new Error("Pricing plan not found in subscription");
  }

  const token = getCookie(ASSESS_TOKEN);

  const apiUrl = `/api/marketplace/v1/agents/${subscription.agent.id}/subscribe/`;

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload = {
    pricing_plan_id: pricingPlan.id,
    action: action,
  };

  try {
    const response = await axios.post(apiUrl, payload, { headers });
    return response.data;
  } catch (error: any) {
    // Handle the specific error case from the response
    if (error.response?.data?.message === "Failed to create agent checkout session") {
      toast.error("Failed to create agent checkout session. Please try again.");
    }
    throw error;
  }
}

export async function resubscribeToAgent(
  subscription: MyAgentSubscription
): Promise<MyAgentSubscription> {
  return handleSubscriptionRequest(subscription, "resubscribe");
}

export async function completePaymentForSubscription(
  subscription: MyAgentSubscription
): Promise<MyAgentSubscription> {
  return handleSubscriptionRequest(subscription, "complete_payment");
}

export const subscriptionService = {
  /**
   * Cancel the current subscription
   */
  cancelSubscription: async (agentId: number) => {
    try {
      const response = await axios.delete(`/api/marketplace/v1/agents/${agentId}/unsubscribe/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to cancel subscription");
    }
  },
};
