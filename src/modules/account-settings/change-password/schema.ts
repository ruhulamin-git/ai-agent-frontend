import * as yup from "yup";

import type { TFunction } from "i18next";

const MIN_PASSWORD_LENGTH = 8;

const changePasswordSchema = (t: TFunction) => {
  return yup.object({
    oldPassword: yup
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        t("validation.field_must_be_at_least_min_characters", {
          field: t("fields.current_password"),
          min: MIN_PASSWORD_LENGTH,
        })
      )
      .required(t("validation.field_is_required", { field: t("fields.current_password") })),
    newPassword: yup
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        t("validation.field_must_be_at_least_min_characters", {
          field: t("fields.new_password"),
          min: MIN_PASSWORD_LENGTH,
        })
      )
      .required(t("validation.field_is_required", { field: t("fields.new_password") })),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], t("validation.passwords_must_match"))
      .required(
        t("validation.field_is_required", {
          field: t("fields.confirm_password"),
        })
      ),
  });
};

export default changePasswordSchema;
