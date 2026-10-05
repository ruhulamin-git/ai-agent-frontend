// ── Provider Types ──────────────────────────────────────────────────────────

type ProviderType = "oauth2" | "api_key";

interface UserIntegration {
  id: number;
  status?: string;
  connectedAt?: string;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  platformUserId?: string | null;
  expiresAt?: string | null;
  grantedScopes?: string | null;
  createdAt?: string;
}

// ── List Response ───────────────────────────────────────────────────────────

interface IntegrationProvider {
  id: number;
  name: string;
  providerType: ProviderType;
  icon: string | null;
  appIntegrationId: number;
  requiredFields?: string[];
  isConnected: boolean;
  userIntegrations: UserIntegration[];
}

interface IntegrationProviderListResponse {
  data: IntegrationProvider[];
}

// ── Detail Response ─────────────────────────────────────────────────────────

interface ApiKeyAuthConfig {
  type: "api_key";
  requiresRedirect: false;
  requiredFields: string[];
  optionalFields: string[];
  fieldTypes: Record<string, string>;
  fieldLabels: Record<string, string>;
  fieldPlaceholders: Record<string, string>;
  helpText: Record<string, string>;
  docsUrl: string;
  connectEndpoint: string;
}

interface OAuthAuthConfig {
  type: "oauth";
  requiresRedirect: true;
  authorizationUrl: string;
  scopes: string | null;
  state: string | null;
  connectEndpoint: string;
}

type AuthConfig = ApiKeyAuthConfig | OAuthAuthConfig;

interface IntegrationProviderDetails {
  id: number;
  name: string;
  providerType: ProviderType;
  icon: string | null;
  appIntegrationId: number;
  authConfig: AuthConfig;
  isConnected: boolean;
  userIntegrations: UserIntegration[];
}

interface IntegrationProviderDetailsResponse {
  data: IntegrationProviderDetails;
}

// ── Connect DTOs ────────────────────────────────────────────────────────────

interface ApiKeyConnectDTO {
  type: "api_key";
  appIntegrationId: number;
  credentials: Record<string, string>;
}

interface OAuthConnectDTO {
  type: "oauth";
  appIntegrationId: number;
  code: string;
}

type ConnectIntegrationDTO = ApiKeyConnectDTO | OAuthConnectDTO;

// ── OAuth Pending State ─────────────────────────────────────────────────────

interface OAuthPendingIntegration {
  appIntegrationId: number;
  providerName: string;
}

export type {
  ApiKeyAuthConfig,
  ApiKeyConnectDTO,
  AuthConfig,
  ConnectIntegrationDTO,
  IntegrationProvider,
  IntegrationProviderDetails,
  IntegrationProviderDetailsResponse,
  IntegrationProviderListResponse,
  OAuthAuthConfig,
  OAuthConnectDTO,
  OAuthPendingIntegration,
  ProviderType,
  UserIntegration,
};
