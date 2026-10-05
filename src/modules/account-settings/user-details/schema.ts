import * as yup from "yup";

import type { TFunction } from "i18next";

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const accountSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup
      .string()
      .required(t("validation.field_is_required", { field: t("fields.first_name") })),
    lastName: yup.string().optional(),
    phone: yup
      .string()
      .matches(phoneRegExp, t("validation.field_must_be_valid_phone", { field: t("fields.phone") }))
      .optional(),
    email: yup.string().optional(),
    profilePicture: yup.string().optional(),
    gender: yup.string().optional(),
    birthDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : null;
      })
      .max(
        new Date(),
        t("validation.field_cannot_be_future_date", {
          field: t("fields.date_of_birth"),
        })
      )
      .optional(),
    address: yup.string().optional(),
    country: yup.string().optional(),
    designation: yup.string().optional(),
    timezone: yup.string().optional(),
  });
};

export default accountSchema;
