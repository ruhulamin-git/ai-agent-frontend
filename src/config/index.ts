const getEnv = (key: string, staticValue: string | undefined): string | undefined => {
  if (typeof window !== "undefined") {
    if ((window as any).__ENV__ && (window as any).__ENV__[key] !== undefined && (window as any).__ENV__[key] !== "") {
      return (window as any).__ENV__[key];
    }
  }
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined && process.env[key] !== "") {
    return process.env[key];
  }
  return staticValue;
};

// ROOT_API_URL is a getter so it reads window.__ENV__ fresh on every call,
// avoiding the race condition where axios is instantiated before EnvScript runs.
const FALLBACK_API_URL = "https://agents-app.devxhub.com";

export const getRootApiUrl = (): string =>
  (getEnv("NEXT_PUBLIC_ROOT_API_URL", process.env.NEXT_PUBLIC_ROOT_API_URL) || FALLBACK_API_URL) as string;

export const ROOT_API_URL = getRootApiUrl();
export const WEBSOCKET_BASE_URL = getEnv("NEXT_PUBLIC_WEBSOCKET_BASE_URL", process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL) as string;
export const ENCRYPTION_KEY = getEnv("NEXT_PUBLIC_ENCRYPTION_KEY", process.env.NEXT_PUBLIC_ENCRYPTION_KEY) as string;
export const GOOGLE_CLIENT_ID = getEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) as string;
export const GOOGLE_REDIRECT_URI = getEnv("NEXT_PUBLIC_GOOGLE_REDIRECT_URI", process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) as string;
export const GOOGLE_AUTHORIZE_URL = getEnv("NEXT_PUBLIC_GOOGLE_AUTHORIZE_URL", process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZE_URL) as string;
export const FACEBOOK_CLIENT_ID = getEnv("NEXT_PUBLIC_FACEBOOK_CLIENT_ID", process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID) as string;
export const FACEBOOK_CONFIG_ID = getEnv("NEXT_PUBLIC_FACEBOOK_CONFIG_ID", process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID) as string;
export const FACEBOOK_AUTHORIZE_URL = getEnv("NEXT_PUBLIC_FACEBOOK_AUTHORIZE_URL", process.env.NEXT_PUBLIC_FACEBOOK_AUTHORIZE_URL) as string;
export const FACEBOOK_REDIRECT_URI = getEnv("NEXT_PUBLIC_FACEBOOK_REDIRECT_URI", process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI) as string;
export const RECAPTCHA_KEY = getEnv("NEXT_PUBLIC_RECAPTCHA_KEY", process.env.NEXT_PUBLIC_RECAPTCHA_KEY) as string;
export const RECAPTCHA_ENABLED = getEnv("NEXT_PUBLIC_RECAPTCHA_ENABLED", process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED) === "true";
export const LINKEDIN_CLIENT_ID = getEnv("NEXT_PUBLIC_LINKEDIN_CLIENT_ID", process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID) as string;
export const LINKEDIN_AUTHORIZE_URL = getEnv("NEXT_PUBLIC_LINKEDIN_AUTHORIZE_URL", process.env.NEXT_PUBLIC_LINKEDIN_AUTHORIZE_URL) as string;
export const LINKEDIN_REDIRECT_URI = getEnv("NEXT_PUBLIC_LINKEDIN_REDIRECT_URI", process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI) as string;
export const ENABLE_RQ_DEVTOOLS = getEnv("NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS", process.env.NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS) === "true";
export const ENABLE_WEBSOCKET = getEnv("NEXT_PUBLIC_ENABLE_WEBSOCKET", process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET) === "true";
export const WEBPACK_USE_POLLING = typeof process !== "undefined" && process.env ? process.env.WEBPACK_USE_POLLING === "true" : false;
