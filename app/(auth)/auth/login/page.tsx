import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/modules/auth/login/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="w-full rounded-xl">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm title="Log in" subtext={null} />
        </Suspense>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
