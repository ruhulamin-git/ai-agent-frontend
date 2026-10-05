// ============================================
// Google Login Types
// ============================================

interface GoogleCredentials {
  clientId: string;
  redirectUri: string;
  authorizeUrl: string;
  scope: string;
  responseType: string;
  prompt: string;
  accessType: string;
  state: string;
}

interface GoogleLoginProps extends GoogleCredentials {
  title?: string;
  returnTo?: string;
}

// ============================================
// Social Login Types
// ============================================

interface SocialLoginDTO {
  platform: string;
  code: string;
  redirect_uri?: string;
}

// ============================================
// Exports
// ============================================

export type { GoogleCredentials, GoogleLoginProps, SocialLoginDTO };
