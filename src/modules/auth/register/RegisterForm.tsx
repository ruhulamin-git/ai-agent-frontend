"use client";

import { useFormik } from "formik";

import { CustomPasswordInput, CustomTextField } from "@/shared/form-elements";
import { Button, Label } from "@/shared/ui";

import { SocialButtons } from "../social-buttons/SocialButtons";

import { useAuthRegister } from "./hooks";
import { registerSchema } from "./schema";

import type { RegisterFormProps } from "../types";

export const RegisterForm = ({ title, subtitle, subtext }: RegisterFormProps) => {
  const { handleRegister, isLoading } = useAuthRegister();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  return (
    <>
      {title && (
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{title}</h1>
      )}

      {subtext}

      <SocialButtons title="Sign up with" />

      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
        <span className="text-sm text-slate-400 dark:text-slate-300 whitespace-nowrap">
          or sign up with
        </span>
        <div className="flex-1 border-t border-slate-300 dark:border-slate-700" />
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-slate-900 dark:text-white mb-1.5 block">
              First Name
            </Label>
            <CustomTextField
              type="text"
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.submitCount > 0 && Boolean(formik.errors.firstName)}
              helperText={formik.submitCount > 0 ? (formik.errors.firstName as string) : undefined}
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-slate-900 dark:text-white mb-1.5 block">
              Last Name
            </Label>
            <CustomTextField
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.submitCount > 0 && Boolean(formik.errors.lastName)}
              helperText={formik.submitCount > 0 ? (formik.errors.lastName as string) : undefined}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="companyName" className="text-slate-900 dark:text-white mb-1.5 block">
            Company Name
          </Label>
          <CustomTextField
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Your Company"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.companyName)}
            helperText={formik.submitCount > 0 ? (formik.errors.companyName as string) : undefined}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-slate-900 dark:text-white mb-1.5 block">
            Email
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
          <Label htmlFor="password" className="text-slate-900 dark:text-white mb-1.5 block">
            Password
          </Label>
          <CustomPasswordInput
            id="password"
            name="password"
            placeholder="Create a password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.password)}
            helperText={formik.submitCount > 0 ? (formik.errors.password as string) : undefined}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-white mb-1.5 block">
            Confirm Password
          </Label>
          <CustomPasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.confirmPassword)}
            helperText={
              formik.submitCount > 0 ? (formik.errors.confirmPassword as string) : undefined
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black font-medium rounded-lg mt-2"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      {subtitle}
    </>
  );
};
