"use client";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { useChangeUserPassword } from "./hooks";
import changePasswordSchema from "./schema";

import type { ChangePasswordDTO } from "../types";

const ChangePassword = () => {
  const { handleChangePassword, isPending } = useChangeUserPassword();
  const { t } = useTranslation();
  const schema = changePasswordSchema(t);

  const formik = useFormik<ChangePasswordDTO>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: schema,

    onSubmit: (values, formik) => {
      handleChangePassword(values, formik);
    },
  });

  return (
    <div className="pt-6">
      <h5 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("pages.account_settings.change_password")}</h5>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t("pages.account_settings.to_change_your_password_please_confirm_here")}
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-cpwd" className="text-gray-700 dark:text-gray-300">{t("fields.current_password")}</Label>
            <Input
              id="text-cpwd"
              autoComplete="current-password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              name="oldPassword"
              type="password"
              className={cn(
                "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500",
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
                  ? "border-destructive"
                  : ""
              )}
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <p className="text-destructive text-sm">{formik.errors.oldPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-npwd" className="text-gray-700 dark:text-gray-300">{t("fields.new_password")}</Label>
            <Input
              id="text-npwd"
              autoComplete="new-password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              name="newPassword"
              type="password"
              className={cn(
                "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500",
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
                  ? "border-destructive"
                  : ""
              )}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-destructive text-sm">{formik.errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-conpwd" className="text-gray-700 dark:text-gray-300">{t("fields.confirm_password")}</Label>
            <Input
              id="text-conpwd"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              name="confirmPassword"
              type="password"
              className={cn(
                "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500",
                formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                  ? "border-destructive"
                  : ""
              )}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-destructive text-sm">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : t("button.save")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { ChangePassword };
