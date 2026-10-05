import type { registerSchema } from "./register/schema";
import type { ResponseMetadata, UserProfile } from "@/shared/types";
import type { ReactNode } from "react";
import type { InferType } from "yup";

// ============================================
// Login Types
// ============================================

interface LoginProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

// ============================================
// Register Types
// ============================================

interface RegisterProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
}

type Register = InferType<typeof registerSchema>;

type RegisterDTO = Register;

// ============================================
// Multi-Factor Authentication Types
// ============================================

interface MFAVerifyDTO {
  code: string;
  mfaToken: string;
}

interface MFAVerifyResponse extends ResponseMetadata {
  tokens: {
    access: string;
    refresh: string;
  };
  user: UserProfile;
}

interface MFAFormValues {
  code: string;
}

// ============================================
// New Password Types
// ============================================

interface NewPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

// ============================================
// Two Steps (Email Verification) Types
// ============================================

interface VerifyEmailDTO {
  email: string;
  code: string;
  type: string;
}

interface ResendVerifyEmailDTO {
  email: string;
  type: string;
}

interface VerifyEmailResponse extends ResponseMetadata {
  data: string;
}

// ============================================
// Social Buttons Types
// ============================================

interface SocialButtonProps {
  title: string;
}

// ============================================
// Exports
// ============================================

export type {
  LoginProps as LoginFormProps,
  LoginProps,
  MFAFormValues,
  MFAVerifyDTO,
  MFAVerifyResponse,
  NewPasswordDTO,
  Register,
  RegisterDTO,
  RegisterProps as RegisterFormProps,
  RegisterProps,
  ResendVerifyEmailDTO,
  SocialButtonProps,
  VerifyEmailDTO,
  VerifyEmailResponse,
};
