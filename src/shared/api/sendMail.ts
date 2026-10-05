import { useMutation } from "@tanstack/react-query";

import { handleApiError, recaptchaService } from "@/utils";
import { axios } from "@/utils/axios";

import type { ForgotPasswordDTO, ForgotPasswordResponse } from "@/shared/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const SEND_MAIL_URL = "/api/auth/v1/password/forgot/";

const sendMail = async (data: ForgotPasswordDTO): Promise<ForgotPasswordResponse | null> => {
  try {
    let config = {};

    if (recaptchaService.isEnabled) {
      const captchaToken = await recaptchaService.getToken("forgot_password");

      if (!captchaToken) {
        throw new Error("reCAPTCHA verification failed");
      }

      config = {
        headers: { "X-Captcha-Token": captchaToken },
      };
    }

    const response = await axios.post(SEND_MAIL_URL, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type SendMailOptions = {
  config?: MutationConfig<typeof sendMail>;
};

const useSendMail = ({ config }: SendMailOptions = {}) => {
  return useMutation<ForgotPasswordResponse | null, AxiosError, ForgotPasswordDTO>({
    mutationFn: sendMail,
    ...config,
  });
};

export { sendMail, useSendMail };
