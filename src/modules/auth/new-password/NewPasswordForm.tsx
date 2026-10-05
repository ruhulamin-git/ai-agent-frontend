"use client";

import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";

import { CustomPasswordInput } from "@/shared/form-elements";
import { Button, Label } from "@/shared/ui";

import { useNewPassword } from "./hooks";
import { newPasswordSchema } from "./schema";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const { handleSetNewPassword, isLoading } = useNewPassword();

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Set New Password</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-white">
          Entering a new password for {email ? <strong>{email}</strong> : "your account"}
        </p>
      </div>

      <Formik
        initialValues={{
          token,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={newPasswordSchema}
        onSubmit={(values) => {
          handleSetNewPassword(values);
        }}
      >
        {(formik) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="password" className="text-slate-900 dark:text-white mb-1.5 block">
                New Password
              </Label>
              <CustomPasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.submitCount > 0 && Boolean(formik.errors.password)}
                helperText={formik.submitCount > 0 ? (formik.errors.password as string) : undefined}
              />
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-slate-900 dark:text-white mb-1.5 block"
              >
                Confirm New Password
              </Label>
              <CustomPasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
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
              className="text-white dark:text-black w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export { NewPasswordForm };
