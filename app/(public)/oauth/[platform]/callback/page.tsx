"use client";

import { useSocialLoginProcess } from "@/modules/oauth/social-login/hooks";
import { CircularLoader } from "@/shared/components";

const OAuthCallback = () => {
  useSocialLoginProcess();

  return <CircularLoader />;
};

export default OAuthCallback;
