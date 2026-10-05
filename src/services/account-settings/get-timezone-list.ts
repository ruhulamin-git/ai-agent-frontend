"use client";

import { useQuery } from "@tanstack/react-query";

import { axios } from "@/utils";
import { handleApiError } from "@/utils/handleApiError";

import type { DropdownOption } from "@/modules/account-settings/types";

interface TimezoneAPIData {
  id: number;
  name: string;
  offset: string;
}

const TIMEZONE_URL = "/api/core/v1/timezones/";

const getTimezoneList = async (): Promise<DropdownOption[] | null> => {
  try {
    const response = await axios.get(TIMEZONE_URL);

    const timezoneList = response?.data?.map((timezone: TimezoneAPIData) => ({
      value: timezone.id.toString(),
      label: `(${timezone.offset}) ${timezone.name}`,
    }));

    return timezoneList ?? [];
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

const useTimezoneList = () => {
  return useQuery({
    queryKey: ["timezone-list"],
    queryFn: getTimezoneList,
  });
};

export { useTimezoneList };
