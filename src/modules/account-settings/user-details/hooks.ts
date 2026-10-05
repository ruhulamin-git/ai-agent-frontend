import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCountryList,
  useGenderList,
  useProfileUpdate,
  useTimezoneList,
} from "@/services/account-settings";
import { useUserProfile } from "@/shared/api";
import { queryClient } from "@/utils";

import type { ProfileFormValues, ProfileUpdatePayload } from "../types";

const useProfile = () => {
  const { data: user, isLoading } = useUserProfile();
  const { data: genderList, isLoading: isGenderListLoading } = useGenderList();
  const { data: countryList, isLoading: isCountryListLoading } = useCountryList();
  const { data: timezoneList, isLoading: isTimezoneListLoading } = useTimezoneList();
  const { mutate, isPending } = useProfileUpdate();

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleUpdateUser = (values: ProfileFormValues) => {
    const updatedValues: ProfileUpdatePayload = {
      ...values,
      profilePicture: profilePicture,
      dateOfBirth: values.birthDate ? dayjs(values.birthDate).format("YYYY-MM-DD") : null,
    };

    mutate(updatedValues, {
      onSuccess: () => {
        toast.success("User profile has been successfully updated.");
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      },
      onError: () => {
        toast.error("Something went wrong!");
      },
    });
  };

  return {
    user,
    genderList,
    countryList,
    timezoneList,
    handleUpdateUser,
    profilePicture,
    setProfilePicture,
    isPending,

    isLoading: isLoading || isGenderListLoading || isCountryListLoading || isTimezoneListLoading,
  };
};

export { useProfile };
