import type { registerSchema } from "./schema";
import type { ReactNode } from "react";
import type { InferType } from "yup";

interface RegisterProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

type Register = InferType<typeof registerSchema>;

type RegisterDTO = Register;

export type { RegisterDTO, RegisterProps };
