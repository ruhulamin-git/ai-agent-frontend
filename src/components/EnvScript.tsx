export default function EnvScript() {
  const envKeys = [
    "NEXT_PUBLIC_ROOT_API_URL",
    "NEXT_PUBLIC_WEBSOCKET_BASE_URL",
    "NEXT_PUBLIC_ENCRYPTION_KEY",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    "NEXT_PUBLIC_GOOGLE_REDIRECT_URI",
    "NEXT_PUBLIC_GOOGLE_AUTHORIZE_URL",
    "NEXT_PUBLIC_FACEBOOK_CLIENT_ID",
    "NEXT_PUBLIC_FACEBOOK_CONFIG_ID",
    "NEXT_PUBLIC_FACEBOOK_AUTHORIZE_URL",
    "NEXT_PUBLIC_FACEBOOK_REDIRECT_URI",
    "NEXT_PUBLIC_RECAPTCHA_KEY",
    "NEXT_PUBLIC_RECAPTCHA_ENABLED",
    "NEXT_PUBLIC_LINKEDIN_CLIENT_ID",
    "NEXT_PUBLIC_LINKEDIN_AUTHORIZE_URL",
    "NEXT_PUBLIC_LINKEDIN_REDIRECT_URI",
    "NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS",
    "NEXT_PUBLIC_ENABLE_WEBSOCKET",
  ];

  const env: Record<string, string | undefined> = {};
  
  if (typeof process !== "undefined" && process.env) {
    for (const key of envKeys) {
      env[key] = process.env[key];
    }
  }

  return (
    <script
      id="env-script"
      dangerouslySetInnerHTML={{
        __html: `window.__ENV__ = ${JSON.stringify(env)};`,
      }}
    />
  );
}
