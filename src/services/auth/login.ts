import { type OptionsType, setCookie } from "cookies-next";

import { recaptchaService, toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";
import { ASSESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";

import type { LoginDTO, LoginResponse } from "@/shared/types";

const LOGIN_URL = "/api/auth/v1/login/";

const login = async (data: LoginDTO): Promise<LoginResponse> => {
  try {
    let config = {};

    if (recaptchaService.isEnabled) {
      const captchaToken = await recaptchaService.getToken("login");

      if (!captchaToken) {
        throw new Error("reCAPTCHA verification failed");
      }

      config = {
        headers: { "X-Captcha-Token": captchaToken },
      };
    }

    const response = await axios.post(
      LOGIN_URL,
      {
        email: data.email,
        password: data.password,
      },
      config
    );

    const transformedData = toCamelCase(response.data);

    if (!transformedData?.mfaRequired) {
      const tokens = transformedData?.tokens;
      if (tokens) {
        const { access: accessToken, refresh: refreshToken } = tokens;

        const secureCookieOptions: OptionsType = {
          path: "/",
          secure: true,
          sameSite: "lax",
        };

        setCookie(REFRESH_TOKEN, refreshToken, secureCookieOptions);
        setCookie(ASSESS_TOKEN, accessToken, secureCookieOptions);
      }
    }

    return transformedData;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export { login };
