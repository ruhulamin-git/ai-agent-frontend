import Link from "next/link";

import { ForgotPassword } from "@/modules/auth/forgot-password/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <>
      <div className="w-full rounded-xl">
        <ForgotPassword />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remember your password?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </>
  );
};

export default ForgotPasswordPage;
