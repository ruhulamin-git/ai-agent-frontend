"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useVerifyEmail } from "@/services/auth";

import type { VerifyEmailDTO } from "../types";

const REDIRECT_TIMEOUT_MS = 3000;

export const useVerifyEmailHook = (email: string | null, code: string | null) => {
  const router = useRouter();
  const { mutate, isPending } = useVerifyEmail();
  const hasAttempted = useRef(false);
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "invalid">("verifying");

  useEffect(() => {
    if (!email || !code) {
      setStatus("invalid");
      return;
    }

    if (status === "verifying" && !hasAttempted.current) {
      hasAttempted.current = true;
      const values: VerifyEmailDTO = {
        email,
        code,
        type: "email_otp",
      };

      mutate(values, {
        onSuccess: () => {
          setStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => {
            router.push("/auth/login");
          }, REDIRECT_TIMEOUT_MS);
        },
        onError: () => {
          setStatus("error");
          hasAttempted.current = false; // Allow retrying if it failed
        },
      });
    }
  }, [email, code, mutate, router, status]);

  return {
    status,
    isLoading: isPending,
    handleRetry: () => {
      hasAttempted.current = false;
      setStatus("verifying");
    },
  };
};
