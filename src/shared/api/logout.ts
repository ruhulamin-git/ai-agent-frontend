"use client";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { LogoutResponse } from "@/shared/types";

const LOG_OUT_URL = "/api/auth/v1/logout/";

const logOut = async (token: string): Promise<LogoutResponse> => {
  try {
    const refreshToken = { refresh_token: token };

    const { data } = await axios.post<LogoutResponse>(LOG_OUT_URL, refreshToken);
    return data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

export { logOut };
