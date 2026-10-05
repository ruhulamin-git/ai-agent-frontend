import { useMutation } from "@tanstack/react-query";

import { axios } from "@/utils/axios";
import { handleApiError } from "@/utils/handleApiError";

import type { ResendVerifyEmailDTO, VerifyEmailResponse } from "@/modules/auth/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const RESEND_VERIFY_EMAIL_URL = "/api/auth/v1/verification/email/resend/";

const resendVerifyEmail = async (data: ResendVerifyEmailDTO): Promise<VerifyEmailResponse> => {
  try {
    const response = await axios.post(RESEND_VERIFY_EMAIL_URL, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type UseResendVerifyEmailOptions = {
  config?: MutationConfig<typeof resendVerifyEmail>;
};

const useResendVerifyEmail = ({ config }: UseResendVerifyEmailOptions = {}) => {
  return useMutation<VerifyEmailResponse, AxiosError, ResendVerifyEmailDTO>({
    mutationFn: resendVerifyEmail,
    ...config,
  });
};

export { useResendVerifyEmail };
