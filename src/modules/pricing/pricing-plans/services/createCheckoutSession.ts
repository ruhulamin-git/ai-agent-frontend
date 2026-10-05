import { useMutation } from "@tanstack/react-query";

import { axios, toCamelCase } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const CREATE_CHECKOUT_SESSION_URL = "/api/subscriptions/v1/create-checkout-session/";

interface CheckoutSessionDTO {
  planId: number;
}

interface CheckoutSessionResponse {
  checkoutSessionId: string;
  checkoutUrl: string;
  subscription: {
    id: number;
    status: string;
    plan: string;
    startDate: string;
    endDate: string;
  };
  invoice: {
    id: number;
    invoiceNumber: string;
    status: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
  };
}

const createCheckoutSession = async (
  data: CheckoutSessionDTO
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await axios.post(CREATE_CHECKOUT_SESSION_URL, {
      plan_id: data.planId,
    });
    return toCamelCase(response.data) as CheckoutSessionResponse;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type CreateCheckoutSessionOptions = {
  config?: MutationConfig<typeof createCheckoutSession>;
};

const useCreateCheckoutSession = ({ config }: CreateCheckoutSessionOptions = {}) => {
  return useMutation<CheckoutSessionResponse, AxiosError, CheckoutSessionDTO>({
    mutationFn: createCheckoutSession,
    ...config,
  });
};

export { useCreateCheckoutSession };
export type { CheckoutSessionDTO, CheckoutSessionResponse };
