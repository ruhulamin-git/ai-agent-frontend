"use client";

import { useQuery } from "@tanstack/react-query";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { DropdownOption } from "@/modules/account-settings/types";

interface CountryAPIData {
  id: number;
  name: string;
  phoneCode?: string;
  capital?: string;
}

const COUNTRY_URL = "/api/core/v1/countries/";

const getCountryList = async (): Promise<DropdownOption[] | null> => {
  try {
    const response = await axios.get(COUNTRY_URL);

    const countryList = response?.data?.map((country: CountryAPIData) => ({
      value: country.id.toString(),
      label: country.name,
    }));

    return countryList;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

const useCountryList = (enabled = true) => {
  return useQuery({
    queryKey: ["country-list"],
    queryFn: getCountryList,
    enabled,
  });
};

export { useCountryList };
