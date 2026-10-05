import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";

import { handleApiError, toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";
import { ASSESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";

import type { SocialLoginDTO } from "@/modules/oauth/types";
import type { LoginResponse } from "@/shared/types";
import type { MutationConfig } from "@/utils/reactQuery";
import type { AxiosError } from "axios";
import type { OptionsType } from "cookies-next";

const SOCIAL_LOGIN_URL = (platform: string) => `/api/users/v1/social/${platform}/`;

const socialLogin = async (data: SocialLoginDTO): Promise<LoginResponse> => {
  const { platform, code, redirect_uri } = data;

  try {
    const url = SOCIAL_LOGIN_URL(platform);
    const payload = redirect_uri ? { code, redirect_uri } : { code };
    const response = await axios.post(url, payload);

    const tokens = response.data?.tokens;
    const { access: accessToken, refresh: refreshToken } = tokens;
    const secureCookieOptions: OptionsType = {
      path: "/",
      secure: true,
      sameSite: "lax",
    };

    setCookie(REFRESH_TOKEN, refreshToken, secureCookieOptions);
    setCookie(ASSESS_TOKEN, accessToken, secureCookieOptions);

    return toCamelCase(response.data);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

type useSocialLoginOptions = {
  config?: MutationConfig<typeof socialLogin>;
};

export const useSocialLogin = ({ config }: useSocialLoginOptions = {}) => {
  return useMutation<LoginResponse, AxiosError, SocialLoginDTO>({
    mutationFn: socialLogin,
    ...config,
  });
};

export { socialLogin };
