// Types for user agent settings - API Keys & Widget Config

// ==================== API Keys ====================

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  revoked: boolean;
  metadata: Record<string, unknown>;
}

/** The create endpoint returns the full key once — never shown again. */
export interface CreatedApiKey extends ApiKey {
  key: string;
}

export interface ApiKeyListResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: ApiKey | ApiKey[];
  errors: unknown;
}

export interface CreateApiKeyDTO {
  name: string;
}

export interface CreateApiKeyResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: CreatedApiKey;
  errors: unknown;
}

// ==================== Widget Config ====================

export interface WidgetTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface WidgetDisplay {
  title: string;
  subtitle: string;
  welcomeMessage: string;
  placeholder: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showAvatar: boolean;
  showBranding: boolean;
}

export interface WidgetBehavior {
  autoOpen: boolean;
  autoOpenDelay: number;
  soundEnabled: boolean;
  typingIndicator: boolean;
}

export type WidgetMode = "popup" | "inline" | "fullscreen";

export interface WidgetConfig {
  mode: WidgetMode;
  theme: WidgetTheme;
  display: WidgetDisplay;
  behavior: WidgetBehavior;
  isPublic: boolean;
  allowedDomains: string[];
  rateLimitPerHour: number;
  rateLimitPerMinute: number;
}

/** Wrapper returned by the API — `data.config` holds the actual config. */
export interface WidgetConfigData {
  id: number;
  config: WidgetConfig;
}

export interface WidgetConfigResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: WidgetConfigData;
  errors: unknown;
}

export interface UpdateWidgetConfigDTO {
  mode?: WidgetMode;
  isPublic?: boolean;
  theme?: Partial<WidgetTheme>;
  display?: Partial<WidgetDisplay>;
  behavior?: Partial<WidgetBehavior>;
  allowedDomains?: string[];
  rateLimitPerHour?: number;
  rateLimitPerMinute?: number;
}

// ==================== Form Values ====================

export interface WidgetConfigFormValues {
  isPublic: boolean;
  mode: WidgetMode;
  theme: WidgetTheme;
  display: WidgetDisplay;
  behavior: WidgetBehavior;
  allowedDomains: string[];
  rateLimitPerHour: number;
  rateLimitPerMinute: number;
}
