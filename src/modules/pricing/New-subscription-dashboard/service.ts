"use client";
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

// ----- Subscription History Types and Hook -----
export interface SubscriptionHistory {
  id: string;
  createdAt: string;
  plan: string;
  amount: string;
  status: string;
  invoice: string;
}

const GET_SUBSCRIPTION_HISTORIES_URL = "/api/subscriptions/v1/subscription-histories/";

const getSubscriptionHistories = async (): Promise<SubscriptionHistory[]> => {
  try {
    const response: any = await axios.get(GET_SUBSCRIPTION_HISTORIES_URL);
    // Because of the axios interceptor, `response` might already be the payload body
    const payloadData = response.data?.data ? response.data.data : response.data;
    const rawData = Array.isArray(payloadData)
      ? payloadData
      : Array.isArray(response)
      ? response
      : [];

    if (!Array.isArray(rawData)) return [];

    return rawData.map((item: any) => {
      const eventDate = item.event_date || item.eventDate;
      const planName = item.subscription?.plan?.name || item.details?.plan || "N/A";
      const amount = item.details?.amount ? `$${item.details.amount}` : "-";
      const status = item.subscription?.status || item.details?.status || "Unknown";
      const invoice =
        item.details?.invoice_id || item.details?.invoiceId
          ? `INV-${item.details?.invoice_id || item.details?.invoiceId}`
          : "-";

      return {
        id: String(item.id),
        createdAt: eventDate,
        plan: planName,
        amount: amount,
        status: status,
        invoice: invoice,
      };
    });
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

type UseSubscriptionHistoriesOptions = {
  config?: QueryConfig<typeof getSubscriptionHistories>;
};

const useSubscriptionHistories = ({ config }: UseSubscriptionHistoriesOptions = {}) => {
  return useQuery({
    queryKey: ["subscription-histories"],
    queryFn: getSubscriptionHistories,
    ...config,
  });
};

export { useCurrentSubscription, useSubscriptionHistories };
