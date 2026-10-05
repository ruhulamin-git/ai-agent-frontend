"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useSendMail } from "@/shared/api/sendMail";

import type { ForgotPasswordDTO } from "@/shared/types";

const useForgotPassword = () => {
  const router = useRouter();

  const { mutate, isPending } = useSendMail();

  const [isDisabled, setIsDisabled] = useState(false);

  const handleForgotPassword = (values: ForgotPasswordDTO) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Password reset instructions has been sent to your email");
        router.push(`/auth/resend-mail?email=${values.email}`);
        setIsDisabled(true);
      },
      onError: () => {
        setIsDisabled(false);
      },
    });
  };

  return { handleForgotPassword, isLoading: isDisabled || isPending };
};

export { useForgotPassword };
