import Link from "next/link";
import { Suspense } from "react";

import { TwoStepsForm } from "@/modules/auth/two-steps/TwoStepsForm";

const TwoStepsPage = () => {
  return (
    <>
      <div className="w-full rounded-xl">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-8">
          We&apos;ve sent a verification code to your email address. Please enter the 6-digit code
          below.
        </p>
        <Suspense fallback={<div className="text-slate-500 dark:text-slate-400">Loading...</div>}>
          <TwoStepsForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Changed your mind?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </>
  );
};

export default TwoStepsPage;
