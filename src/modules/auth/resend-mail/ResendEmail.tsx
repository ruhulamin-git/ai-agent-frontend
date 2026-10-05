"use client";

import { useSearchParams } from "next/navigation";

import { useSendMail } from "@/shared/api/sendMail";
import { useResendMail } from "@/shared/hooks/useResendMail";
import { Button } from "@/shared/ui/button";

import type { ForgotPasswordDTO } from "@/shared/types";

const ResendEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { mutate } = useSendMail();
  const valuesFormatter = (email: string): ForgotPasswordDTO => ({ email });

  const { coolDown, handleResendEmail, isLoading, isCoolDownActive, formatTime } = useResendMail(
    email,
    mutate,
    valuesFormatter
  );

  return (
    <div className="mt-8 space-y-4">
      <Button
        className="w-full"
        size="lg"
        onClick={handleResendEmail}
        disabled={isLoading || isCoolDownActive}
      >
        {isLoading
          ? "Sending..."
          : isCoolDownActive
          ? `Resend in ${formatTime(coolDown)}`
          : "Resend Email"}
      </Button>
    </div>
  );
};

export { ResendEmail };
