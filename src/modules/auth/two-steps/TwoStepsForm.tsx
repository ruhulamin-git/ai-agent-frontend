"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useResendVerifyEmail } from "@/services/auth";
import { useResendMail } from "@/shared/hooks/useResendMail";
import { Button, Label } from "@/shared/ui";

import { useTwoSteps } from "./hooks";

import type { ResendVerifyEmailDTO } from "../types";

const MAX_OTP_INDEX = 5;
const OTP_LENGTH = 6;

const TwoStepsForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const { mutate: resendMutate } = useResendVerifyEmail();
  const valuesFormatter = (email: string): ResendVerifyEmailDTO => ({ email, type: "email_otp" });

  const { handleVerifyEmail, isLoading, otp, setOtp } = useTwoSteps(email);

  const {
    coolDown,
    handleResendEmail,
    isLoading: isResendLoading,
    isCoolDownActive,
    formatTime,
  } = useResendMail(email, resendMutate, valuesFormatter);

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    if (value.length > 1) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    const otpString = newOtpValues.join("");
    setOtp(otpString);

    if (value && index < MAX_OTP_INDEX) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < MAX_OTP_INDEX) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasteData) return;

    const newOtpValues = [...otpValues];
    pasteData.split("").forEach((char, i) => {
      if (i < OTP_LENGTH) newOtpValues[i] = char;
    });

    setOtpValues(newOtpValues);
    const otpString = newOtpValues.join("");
    setOtp(otpString);

    // Focus the next empty slot or the last one
    const nextSlot = Math.min(pasteData.length, MAX_OTP_INDEX);
    inputRefs.current[nextSlot]?.focus();
  };

  const onSubmit = () => {
    if (otp.length === OTP_LENGTH) {
      handleVerifyEmail();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="otp-0" className="mb-1.5 block text-center">
          Enter your 6-digit security code
        </Label>
        <div className="flex space-x-2 justify-center" onPaste={handlePaste}>
          {otpValues.map((value, index) => (
            <input
              key={`otp-input-${index}-${value || "empty"}`} // eslint-disable-line react/no-array-index-key
              id={`otp-${index}`}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-white dark:text-black"
        onClick={onSubmit}
        disabled={isLoading || otp.length !== OTP_LENGTH}
      >
        {isLoading ? "Verifying..." : "Verify My Account"}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-gray-600 dark:text-slate-400">Didn&apos;t get the code?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResendEmail}
          disabled={isResendLoading || isCoolDownActive}
          className="h-auto p-0 font-medium text-primary hover:text-primary/90"
        >
          {isResendLoading
            ? "Sending..."
            : isCoolDownActive
            ? `Resend in ${formatTime(coolDown)}`
            : "Resend"}
        </Button>
      </div>
    </div>
  );
};

export { TwoStepsForm };
