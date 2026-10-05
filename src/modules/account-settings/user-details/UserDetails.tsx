"use client";

import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  CustomCountrySelect,
  CustomSelect,
  CustomTextField,
  CustomTimezoneSelect,
} from "@/shared/form-elements";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { SelectItem } from "@/shared/ui/select";

import { useProfile } from "./hooks";
import accountSchema from "./schema";
import { UserDetailsSkeleton } from "./UserDetailsSkeleton";

import type { DropdownOption } from "../types";

// Helper component for form field wrapper
const FormField = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Label htmlFor={id} className="mb-1.5 block text-gray-700 dark:text-gray-300">
      {label}
    </Label>
    {children}
  </div>
);

// Helper component for text field with error handling
const TextFieldWithError = ({
  id,
  name,
  value,
  onChange,
  formik,
  ...props
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => (
  <CustomTextField
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={formik.touched[name] ? (formik.errors[name] as string) : undefined}
    {...props}
  />
);

// eslint-disable-next-line complexity
const UserDetails = () => {
  const {
    user,
    genderList,
    countryList,
    timezoneList,
    handleUpdateUser,
    profilePicture,
    setProfilePicture,
    isPending,
    isLoading,
  } = useProfile();
  const { t } = useTranslation();
  const schema = accountSchema(t);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      profilePicture: user?.profile?.profilePictureUrl ?? "",
      gender: user?.profile?.gender?.id?.toString() ?? "",
      birthDate: user?.profile?.dateOfBirth
        ? dayjs(user?.profile?.dateOfBirth).format("YYYY-MM-DD")
        : "",
      address: user?.profile?.address ?? "",
      country: user?.profile?.country?.id?.toString() ?? "",
      designation: user?.profile?.designation ?? "",
      timezone: user?.preferences?.timezone?.id?.toString() ?? "",
    },

    enableReinitialize: true,
    validationSchema: schema,

    onSubmit: (values) => {
      handleUpdateUser(values);
    },
  });

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={formik.handleSubmit}>
        {/* Profile Picture Section */}
        <div className="mb-8">
          <div className="pt-6">
            <h5 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("pages.account_settings.change_profile")}
            </h5>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("pages.account_settings.change_your_profile_picture_from_here")}
            </p>
            <div className="flex flex-col items-center justify-center text-center">
              <Avatar className="mb-4 h-28 w-28">
                <AvatarImage src={formik.values.profilePicture} alt="user" />
                <AvatarFallback className="text-4xl">
                  {user?.firstName ? user.firstName.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="my-3 flex justify-center gap-2">
                <Button variant="default" asChild>
                  <label className="cursor-pointer">
                    {t("button.upload")}
                    <input
                      hidden
                      accept="image/*"
                      name="profilePicture"
                      type="file"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setProfilePicture(file);
                          const imageUrl = URL.createObjectURL(file);
                          formik.setFieldValue("profilePicture", imageUrl);
                        }
                      }}
                    />
                  </label>
                </Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                  disabled={!profilePicture}
                  onClick={() => {
                    setProfilePicture(null);
                    formik.resetForm();
                  }}
                  type="button"
                >
                  {t("button.reset")}
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {t("validation.allowed_jpg_gif_or_png_max_size_of_800kb")}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div>
          <div className="pt-6">
            <h5 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("pages.account_settings.personal_details")}
            </h5>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("pages.account_settings.to_change_your_personal_details_edit_and_save_from_here")}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField id="firstName" label={t("fields.first_name")}>
                <TextFieldWithError
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  formik={formik}
                />
              </FormField>

              <FormField id="lastName" label={t("fields.last_name")}>
                <TextFieldWithError
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  formik={formik}
                />
              </FormField>

              <FormField id="email" label="Email">
                <CustomTextField
                  id="email"
                  name="email"
                  value={formik.values.email}
                  readOnly
                  className="cursor-not-allowed bg-gray-200 dark:bg-gray-800/50 text-gray-600 dark:text-gray-500"
                />
              </FormField>

              <FormField id="phone" label={t("fields.phone")}>
                <TextFieldWithError
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  formik={formik}
                />
              </FormField>

              <FormField id="birthDate" label={t("fields.date_of_birth")}>
                <CustomTextField
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formik.values.birthDate ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formik.setFieldValue("birthDate", e.target.value);
                  }}
                  error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                  helperText={
                    formik.touched.birthDate ? (formik.errors.birthDate as string) : undefined
                  }
                />
              </FormField>

              <FormField id="gender" label={t("fields.gender")}>
                <CustomSelect
                  id="gender"
                  value={formik.values.gender}
                  onValueChange={(value) => formik.setFieldValue("gender", value)}
                  placeholder={t("placeholders.select_gender")}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  helperText={formik.touched.gender ? (formik.errors.gender as string) : undefined}
                >
                  {genderList?.map((option: DropdownOption) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </CustomSelect>
              </FormField>

              <FormField id="designation" label={t("fields.designation")}>
                <TextFieldWithError
                  id="designation"
                  name="designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  formik={formik}
                />
              </FormField>

              <FormField id="address" label={t("fields.address")}>
                <TextFieldWithError
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  formik={formik}
                />
              </FormField>

              <FormField id="country" label={t("fields.country")}>
                <CustomCountrySelect
                  id="country"
                  value={formik.values.country}
                  onChange={(value) => formik.setFieldValue("country", value)}
                  options={countryList ?? []}
                  placeholder={t("placeholders.choose_a_country")}
                  error={formik.touched.country && Boolean(formik.errors.country)}
                  helperText={
                    formik.touched.country ? (formik.errors.country as string) : undefined
                  }
                />
              </FormField>

              <FormField id="timezone" label={t("fields.timezone")}>
                <CustomTimezoneSelect
                  id="timezone"
                  value={formik.values.timezone}
                  onChange={(value) => formik.setFieldValue("timezone", value)}
                  options={timezoneList ?? []}
                  placeholder={t("placeholders.choose_a_timezone")}
                  error={formik.touched.timezone && Boolean(formik.errors.timezone)}
                  helperText={
                    formik.touched.timezone ? (formik.errors.timezone as string) : undefined
                  }
                />
              </FormField>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="submit" disabled={isPending || !formik.dirty}>
                {isPending ? "Saving..." : t("button.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => formik.resetForm()}
                disabled={isPending || !formik.dirty}
              >
                {t("button.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export { UserDetails };
