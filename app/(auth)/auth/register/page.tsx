import Link from "next/link";
import { Suspense } from "react";

import { RegisterForm } from "@/modules/auth";

const RegisterPage = () => {
  return (
    <>
      <div className="w-full rounded-xl">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm title="Create account" subtext={null} />
        </Suspense>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
