"use client";

import { useMutation } from "@tanstack/react-query";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { ChangePasswordDTO } from "@/modules/account-settings/types";

const PASSWORD_CHANGE_URL = `/api/auth/v1/password/change/`;

const changePassword = async (data: ChangePasswordDTO): Promise<void> => {
  const { oldPassword, newPassword } = data;
  const promptBody = {
    old_password: oldPassword,
    new_password: newPassword,
  };

  try {
    await axios.put(PASSWORD_CHANGE_URL, promptBody);
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export { useChangePassword };
