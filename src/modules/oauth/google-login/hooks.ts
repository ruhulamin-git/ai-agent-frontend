import type { GoogleCredentials } from "../types";

interface UseGoogleLoginOptions extends GoogleCredentials {
  returnTo?: string;
}

const useGoogleLogin = ({
  clientId,
  redirectUri,
  authorizeUrl,
  scope,
  responseType,
  prompt,
  accessType,
  state,
  returnTo,
}: UseGoogleLoginOptions) => {
  const handleGoogleLogin = () => {
    const url = new URL(authorizeUrl);

    // Encode returnTo in state if provided
    const stateValue = returnTo ? `${state}:${returnTo}` : state;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: responseType,
      prompt: prompt,
      access_type: accessType,
      state: stateValue,
    });

    url.search = params.toString();
    window.location.href = url.toString();
  };

  return { handleGoogleLogin };
};

export { useGoogleLogin };
