import { useMutation } from "@tanstack/react-query";

import { axios } from "@/utils/axios";
import { handleApiError } from "@/utils/handleApiError";
import { recaptchaService } from "@/utils/reCaptcha";

import type { NewPasswordDTO } from "@/modules/auth/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";

const NEW_PASSWORD_URL = "/api/auth/v1/password/reset/";

const setNewPassword = async (data: NewPasswordDTO): Promise<void> => {
  try {
    let config = {};

    const payload = {
      new_password: data.password,
      confirm_password: data.confirmPassword,
    };

    const headers: Record<string, string> = {
      "X-Reset-Token": data.token,
    };

    if (recaptchaService.isEnabled) {
      const captchaToken = await recaptchaService.getToken("reset_password");

      if (!captchaToken) {
        throw new Error("reCAPTCHA verification failed");
      }
      headers["X-Captcha-Token"] = captchaToken;
    }

    config = {
      headers,
    };

    await axios.post(NEW_PASSWORD_URL, payload, config);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type setNewPasswordOptions = {
  config?: MutationConfig<typeof setNewPassword>;
};

const useSetNewPassword = ({ config }: setNewPasswordOptions = {}) => {
  return useMutation<void, AxiosError, NewPasswordDTO>({
    mutationFn: setNewPassword,
    ...config,
  });
};

export { useSetNewPassword };
