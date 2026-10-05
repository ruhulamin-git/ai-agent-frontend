import { RECAPTCHA_ENABLED, RECAPTCHA_KEY } from "@/config";

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

export const recaptchaService = {
  isEnabled: RECAPTCHA_ENABLED,

  getToken: async (action = "submit"): Promise<string | null> => {
    if (!RECAPTCHA_ENABLED || !RECAPTCHA_KEY) {
      return null;
    }

    if (typeof window === "undefined" || !window.grecaptcha?.enterprise) {
      return null;
    }

    return new Promise<string | null>((resolve) => {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_KEY, {
            action,
          });
          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA token generation error:", error);
          resolve(null);
        }
      });
    });
  },
};
