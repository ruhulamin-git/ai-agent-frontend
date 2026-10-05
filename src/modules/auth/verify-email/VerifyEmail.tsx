"use client";

import { useSearchParams } from "next/navigation";

import { Button, Spinner } from "@/shared/ui";

import { useVerifyEmailHook } from "./hooks";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const { status, handleRetry } = useVerifyEmailHook(email, code);

  if (status === "invalid") {
    return (
      <div className="text-center p-4">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Invalid Verification Link
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          The link you used is missing required information. Please check your email inbox and try
          clicking the link again.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center p-4">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500 animate-in zoom-in duration-300">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Verification Failed
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          We couldn&apos;t verify your account. The link may have expired or the security code is
          incorrect.
        </p>
        <Button onClick={handleRetry} className="w-full text-white dark:text-black">
          Try Again
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center p-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-500 animate-in zoom-in duration-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-950/40">
            <svg
              className="w-12 h-12 animate-in slide-in-from-bottom-2 duration-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Account Verified!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 animate-pulse">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        <Spinner size="xl" className="text-primary h-16 w-16" />
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <AgentKitLogo size="sm" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Identifying Account
        </h2>
        <p className="text-slate-600 dark:text-slate-400 animate-pulse">
          Please wait while we secure your access...
        </p>
      </div>
    </div>
  );
};

// Helper internal component
const AgentKitLogo = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center bg-primary rounded-lg shadow-sm text-white`}
    >
      <span className="font-bold">A</span>
    </div>
  );
};

export { VerifyEmail };
