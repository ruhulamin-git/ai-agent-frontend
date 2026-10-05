"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useSetNewPassword } from "@/services/auth";

import type { NewPasswordDTO } from "@/modules/auth/types";

const useNewPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { mutate, isPending } = useSetNewPassword();

  const [isDisabled, setIsDisabled] = useState(false);

  const handleSetNewPassword = (values: NewPasswordDTO) => {
    const modifiedValues = { ...values, token };

    mutate(modifiedValues, {
      onSuccess: () => {
        toast.success("Password has been successfully reset.");
        router.push("/auth/login");
        setIsDisabled(true);
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  };

  return {
    handleSetNewPassword,
    isLoading: isDisabled || isPending,
  };
};

export { useNewPassword };
