export interface VerifyEmailDTO {
  email: string;
  otp: string;
  type: "email_otp";
}

export interface ResendVerifyEmailDTO {
  email: string;
  type: "email_otp";
}
