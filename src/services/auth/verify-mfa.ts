import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";

import { axios } from "@/utils/axios";
import { ASSESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { handleApiError } from "@/utils/handleApiError";
import { toCamelCase } from "@/utils/toCamelCase";

import type { MFAVerifyDTO, MFAVerifyResponse } from "@/modules/auth/types";
import type { AxiosError } from "axios";
import type { OptionsType } from "cookies-next";

const MFA_VERIFY_URL = "/api/users/v1/mfa/verify/";

const verifyMFA = async (data: MFAVerifyDTO): Promise<MFAVerifyResponse> => {
  try {
    const response = await axios.post(MFA_VERIFY_URL, {
      code: data.code,
      mfa_token: data.mfaToken,
    });
    const transformedData = toCamelCase(response.data);

    const tokens = transformedData.tokens;
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
    return transformedData;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const useMFAVerify = () => {
  return useMutation<MFAVerifyResponse, AxiosError, MFAVerifyDTO>({
    mutationFn: verifyMFA,
  });
};

export { useMFAVerify, verifyMFA };
