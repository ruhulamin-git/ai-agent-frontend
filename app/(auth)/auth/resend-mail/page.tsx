import Link from "next/link";

import { ResendEmail } from "@/modules/auth/resend-mail/ResendEmail";

const ResendMailPage = async ({ searchParams }: { searchParams: Promise<{ email?: string }> }) => {
  const params = await searchParams;
  const email = params?.email ?? "";

  return (
    <>
      <div className="w-full rounded-xl text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Password Reset Instructions Sent
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We have sent password recovery instructions to your email <strong>{email}</strong>.
        </p>
        <ResendEmail />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already remember your password?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </>
  );
};

export default ResendMailPage;
