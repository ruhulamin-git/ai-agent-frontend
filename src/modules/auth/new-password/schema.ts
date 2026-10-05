import * as yup from "yup";

const MIN_PASSWORD_LENGTH = 8;

const newPasswordSchema = yup.object({
  password: yup
    .string()
    .min(MIN_PASSWORD_LENGTH, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(MIN_PASSWORD_LENGTH, "Confirm Password should be of minimum 8 characters length")
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export { newPasswordSchema };
