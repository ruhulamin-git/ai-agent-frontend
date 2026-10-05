"use client";

import { useFormik } from "formik";

import { CustomTextArea, CustomTextField } from "@/shared/form-elements";
import { Button, Label } from "@/shared/ui";

import { useContact } from "./hooks";
import { contactSchema } from "./schema";

export const ContactForm = () => {
  const { handleContactSubmit, isLoading } = useContact();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
      handleContactSubmit(values, () => formik.resetForm());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="mb-1.5 block">
            Full Name
          </Label>
          <CustomTextField
            id="name"
            name="name"
            placeholder="John Doe"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.name)}
            helperText={formik.submitCount > 0 ? (formik.errors.name as string) : undefined}
          />
        </div>
        <div>
          <Label htmlFor="email" className="mb-1.5 block">
            Email Address
          </Label>
          <CustomTextField
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.submitCount > 0 && Boolean(formik.errors.email)}
            helperText={formik.submitCount > 0 ? (formik.errors.email as string) : undefined}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subject" className="mb-1.5 block">
          Subject
        </Label>
        <CustomTextField
          id="subject"
          name="subject"
          placeholder="How can we help?"
          value={formik.values.subject}
          onChange={formik.handleChange}
          error={formik.submitCount > 0 && Boolean(formik.errors.subject)}
          helperText={formik.submitCount > 0 ? (formik.errors.subject as string) : undefined}
        />
      </div>

      <div>
        <Label htmlFor="message" className="mb-1.5 block">
          Message
        </Label>
        <CustomTextArea
          id="message"
          name="message"
          placeholder="Tell us about your requirements..."
          rows={5}
          value={formik.values.message}
          onChange={formik.handleChange}
          error={formik.submitCount > 0 && Boolean(formik.errors.message)}
          helperText={formik.submitCount > 0 ? (formik.errors.message as string) : undefined}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 mt-2"
      >
        {isLoading ? "Sending Message..." : "Send Message"}
      </Button>
    </form>
  );
};
