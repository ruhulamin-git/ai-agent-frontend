"use client";

import { useMutation } from "@tanstack/react-query";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";
import { objectToFormData } from "@/utils/objectToFormData";
import { toSnakeCase } from "@/utils/toSnakeCase";

import type { ProfileUpdatePayload } from "@/modules/account-settings/types";

const PROFILE_UPDATE_URL = `/api/users/v1/users/update-profile/`;

const profileUpdate = async (data: ProfileUpdatePayload): Promise<unknown> => {
  const payload = toSnakeCase(data as unknown as Record<string, unknown>);
  const formData = objectToFormData(payload);

  try {
    const response = await axios.put(PROFILE_UPDATE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
    return Promise.reject(error);
  }
};

const useProfileUpdate = () => {
  return useMutation({
    mutationFn: profileUpdate,
  });
};

export { useProfileUpdate };
