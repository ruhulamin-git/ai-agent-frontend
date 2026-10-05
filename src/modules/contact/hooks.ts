"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { type ContactDTO, sendContactMessage } from "@/services/contact";

export const useContact = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactDTO) => sendContactMessage(data),
    onSuccess: (response) => {
      if (response.id !== undefined) {
        toast.success("Your message has been sent successfully!");
      } else {
        const message = response.message || "Your message has been received!";
        toast.success(message);
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleContactSubmit = (values: ContactDTO, resetForm: () => void) => {
    mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return {
    handleContactSubmit,
    isLoading: isPending,
  };
};
