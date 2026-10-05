"use client";

import { deleteCookie, setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useLogin } from "@/utils/auth";
import { encrypt } from "@/utils/encryption";

import type { LoginDTO } from "@/shared/types";

const useAuthLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/marketplace";

  const { mutate, isPending } = useLogin();

  const [isDisabled, setIsDisabled] = useState(false);

  const handleLogin = (values: LoginDTO) => {
    if (values?.rememberMe) {
      setCookie("email", values.email);
      setCookie("password", encrypt(values.password));
    } else {
      deleteCookie("email");
      deleteCookie("password");
    }

    mutate(values, {
      onSuccess: () => {
        // Notify other components about the authentication change
        window.dispatchEvent(new Event("auth-change"));
        router.push(returnTo);
        toast.success("Welcome! You're now logged in.");
        setIsDisabled(true);
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  };

  return { handleLogin, isLoading: isDisabled || isPending };
};

export { useAuthLogin };
