"use client";

import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import Link from "next/link";

import { CustomPasswordInput, CustomTextField } from "@/shared/form-elements";
import { Button, Checkbox, Label } from "@/shared/ui";
import { decrypt } from "@/utils/encryption";

import { SocialButtons } from "../social-buttons/SocialButtons";

import { useAuthLogin } from "./hooks";
import { loginSchema } from "./schema";

import type { LoginFormProps } from "../types";

export const LoginForm = ({ title, subtitle, subtext }: LoginFormProps) => {
  const { handleLogin, isLoading } = useAuthLogin();

  const email = getCookie("email") as string;
  const encryptedPassword = getCookie("password") as string;
  const password = encryptedPassword ? decrypt(encryptedPassword) : "";

  const formik = useFormik({
    initialValues: {
      email: email || "",
      password: password || "",
      rememberMe: !!email,
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <>
      {title && (
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{title}</h1>
      )}

      {subtext}

      <SocialButtons title="Sign in with" />

      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
        <span className="text-sm text-slate-400 dark:text-slate-300 whitespace-nowrap">
          or sign in with
        </span>
        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" className="text-slate-900 dark:text-white mb-1.5 block">
            Email Address
          </Label>
          <CustomTextField
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.email)}
            helperText={formik.submitCount > 0 ? (formik.errors.email as string) : undefined}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="text-slate-900 dark:text-white">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <CustomPasswordInput
            id="password"
            name="password"
            placeholder="Enter password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.password)}
            helperText={formik.submitCount > 0 ? (formik.errors.password as string) : undefined}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onCheckedChange={(checked: boolean) => formik.setFieldValue("rememberMe", checked)}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-300 cursor-pointer"
          >
            Remember this Device
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black font-medium rounded-lg mt-2"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {subtitle}
    </>
  );
};
