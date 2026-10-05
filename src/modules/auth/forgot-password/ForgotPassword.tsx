"use client";

import { Form, Formik } from "formik";
import * as React from "react";

import { CustomTextField } from "@/shared/form-elements";
import { Button, Label } from "@/shared/ui";

import { useForgotPassword } from "./hooks";
import { forgotPasswordSchema } from "./schema";

import type { ForgotPasswordDTO } from "@/shared/types";

const ForgotPassword = ({
  title,
  subtext,
  subtitle,
}: {
  title?: string;
  subtext?: string;
  subtitle?: React.ReactNode;
}) => {
  const { handleForgotPassword, isLoading } = useForgotPassword();

  const initialValues: ForgotPasswordDTO = { email: "" };

  return (
    <>
      {title && (
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{title}</h1>
      )}

      {subtext}

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Forgot Password
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={(values) => handleForgotPassword(values)}
        >
          {(formik) => (
            <Form className="flex flex-col gap-4">
              <div className="mt-6">
                <Label htmlFor="email" className="mb-1.5 block text-slate-700 dark:text-slate-300">
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
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full mt-2 text-white dark:text-black"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      {subtitle}
    </>
  );
};

export { ForgotPassword };
