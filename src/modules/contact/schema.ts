import * as yup from "yup";

const MIN_MESSAGE_LENGTH = 10;

export const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .min(MIN_MESSAGE_LENGTH, `Message should be at least ${MIN_MESSAGE_LENGTH} characters`)
    .required("Message is required"),
});

export type ContactFormValues = yup.InferType<typeof contactSchema>;
