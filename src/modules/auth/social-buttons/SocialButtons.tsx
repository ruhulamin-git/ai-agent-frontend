"use client";

import { useSearchParams } from "next/navigation";

import { GOOGLE_AUTHORIZE_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "@/config";
import { GoogleLogin } from "@/modules/oauth";
import { GOOGLE_SCOPE } from "@/utils/constants";

import type { SocialButtonProps } from "../types";

export const SocialButtons = ({ title = "Continue with" }: SocialButtonProps) => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  return (
    <GoogleLogin
      title={title}
      authorizeUrl={GOOGLE_AUTHORIZE_URL}
      clientId={GOOGLE_CLIENT_ID}
      redirectUri={GOOGLE_REDIRECT_URI}
      scope={GOOGLE_SCOPE}
      responseType="code"
      prompt="consent"
      accessType="offline"
      state="google"
      returnTo={returnTo}
    />
  );
};
