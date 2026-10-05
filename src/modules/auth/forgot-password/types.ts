import type { ReactNode } from "react";

interface ForgotPasswordProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

export type { ForgotPasswordProps };

export interface ForgotPasswordFormValues {
  email: string;
}
