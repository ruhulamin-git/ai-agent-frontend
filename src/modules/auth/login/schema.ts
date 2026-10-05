import * as yup from "yup";

const MIN_PASSWORD_LENGTH = 8;

export const loginSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(MIN_PASSWORD_LENGTH, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  rememberMe: yup.boolean().optional(),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
