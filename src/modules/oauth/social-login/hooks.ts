import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { FACEBOOK_REDIRECT_URI, GOOGLE_REDIRECT_URI, LINKEDIN_REDIRECT_URI } from "@/config";
import { useSocialLogin } from "@/services/oauth";

/**
 * Get the redirect URI based on the OAuth platform
 */
const getRedirectUri = (platform: string): string => {
  const redirectUris: Record<string, string> = {
    google: GOOGLE_REDIRECT_URI,
    facebook: FACEBOOK_REDIRECT_URI,
    linkedin: LINKEDIN_REDIRECT_URI,
  };

  return redirectUris[platform.toLowerCase()] || "";
};

const useSocialLoginProcess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestMade = useRef(false);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Extract returnTo from state (format: "platform:returnTo" or just "platform")
  const returnTo = state?.includes(":") ? state.split(":")[1] : "/user-dashboard";

  const { platform } = useParams();
  const { mutate } = useSocialLogin({
    config: {
      onSuccess: () => {
        // Notify other components about the authentication change
        window.dispatchEvent(new Event("auth-change"));
        router.push(returnTo);
        toast.success("Welcome! You're now logged in.");
      },
      onError: () => {
        router.push("/auth/login");
      },
    },
  });

  useEffect(() => {
    if (code && platform && !requestMade.current) {
      requestMade.current = true;

      // Get the redirect_uri for this platform
      const redirect_uri = getRedirectUri(platform as string);

      const values = {
        code,
        platform: platform as string,
        redirect_uri, // Include redirect_uri for OAuth 2.0 compliance
      };

      mutate(values, {});
    }
  }, [code, platform, router, mutate]);
};

export { useSocialLoginProcess };
