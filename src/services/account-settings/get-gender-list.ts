"use client";

import { useQuery } from "@tanstack/react-query";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { DropdownOption } from "@/modules/account-settings/types";

interface GenderAPIData {
  id: number;
  name: string;
}

const GENDER_URL = "/api/core/v1/genders/";

const getGenderList = async (): Promise<DropdownOption[] | null> => {
  try {
    const response = await axios.get(GENDER_URL);

    const genderList = response?.data?.map((gender: GenderAPIData) => ({
      value: gender.id.toString(),
      label: gender.name,
    }));

    return genderList;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

const useGenderList = () => {
  return useQuery({
    queryKey: ["gender-list"],
    queryFn: getGenderList,
  });
};

export { useGenderList };
