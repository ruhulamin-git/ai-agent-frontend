type AuthMethod = "api_key" | "jwt" | "oauth2" | "basic";

type InteractionMode = "chat" | "auto_reply" | "task" | "event" | "hybrid";

type ExecutionMode = "redirect" | "proxied" | "api_call";

type TriggerType = "schedule" | "webhook" | "manual";

type OutputFormat = "text" | "json" | "file" | "html" | "markdown";

interface ExternalAgent {
  id: number;
  agent: {
    id: number;
    name: string;
    description?: string;
    shortDescription?: string;
    longDescription?: string;
    welcomeMessage?: string;
    tags?: string[];
    category?: number;
    demoUrl?: string;
    sourceType: string;
    publishStatus: string;
    interactionMode: InteractionMode;
  };
  iconUrl?: string;
  coverImageUrl?: string;
  siteUrl: string;
  authMethod: AuthMethod;
  executionMode: ExecutionMode;
  isVerified: boolean;
  healthStatus: "healthy" | "degraded" | "down" | "unknown";

  chatFrontendUrl?: string;

  chatApiEndpoint?: string;
  chatApiRequestFormat?: Record<string, unknown>;
  chatApiResponseFormat?: Record<string, unknown>;
  supportsStreaming?: boolean;

  executeEndpoint?: string;
  inputSchema?: Record<string, unknown>;
  outputFormat?: OutputFormat;
  isAsyncExecution?: boolean;
  callbackUrl?: string;

  replyEndpoint?: string;
  supportedPlatforms?: string[];

  eventEndpoint?: string;
  triggerType?: TriggerType;
  scheduleConfig?: Record<string, unknown>;
  supportedEvents?: string[];

  authEndpoint?: string;
  healthEndpoint?: string;
  credentialSchema?: Record<string, unknown>;
  tokenResponseKey?: string;
  tokenQueryParamName?: string;
  webhookSecret?: string;
  documentationUrl?: string;
  rateLimitPerMinute?: number;
  timeoutSeconds?: number;

  createdAt: string;
  updatedAt: string;
  lastHealthCheck?: string;
}

interface CreateExternalAgentDTO {
  name: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  agentType?: "messaging" | "embedded";
  interactionMode: InteractionMode;
  welcomeMessage?: string;
  tags?: string[];
  category?: number;
  demoUrl?: string;

  // ExternalAgent configuration
  siteUrl: string;
  authMethod: AuthMethod;
  executionMode: ExecutionMode;

  // Chat mode fields
  chatFrontendUrl?: string;
  chatApiEndpoint?: string;
  chatApiRequestFormat?: Record<string, unknown>;
  chatApiResponseFormat?: Record<string, unknown>;
  supportsStreaming?: boolean;

  // Task mode fields
  executeEndpoint?: string;
  inputSchema?: Record<string, unknown>;
  outputFormat?: OutputFormat;
  isAsyncExecution?: boolean;
  callbackUrl?: string;

  // Auto-reply mode fields
  replyEndpoint?: string;
  supportedPlatforms?: string[];

  // Event mode fields
  eventEndpoint?: string;
  triggerType?: TriggerType;
  scheduleConfig?: Record<string, unknown>;
  supportedEvents?: string[];
  eventConfigSchema?: Record<string, unknown>;

  // Common fields
  authEndpoint?: string;
  healthEndpoint?: string;
  credentialSchema?: Record<string, unknown>;
  tokenResponseKey?: string;
  tokenQueryParamName?: string;
  webhookSecret?: string;
  documentationUrl?: string;
  rateLimitPerMinute?: number;
  timeoutSeconds?: number;
}

interface UpdateExternalAgentDTO {
  // Agent metadata
  name?: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  welcomeMessage?: string;
  tags?: string[];
  category?: number;
  demoUrl?: string;

  // External agent configuration
  siteUrl?: string;
  authMethod?: AuthMethod;
  executionMode?: ExecutionMode;

  // Common fields
  authEndpoint?: string;
  healthEndpoint?: string;
  credentialSchema?: Record<string, unknown>;
  tokenResponseKey?: string;
  tokenQueryParamName?: string;
  webhookSecret?: string;
  documentationUrl?: string;
  rateLimitPerMinute?: number;
  timeoutSeconds?: number;

  // Chat mode fields
  chatFrontendUrl?: string;
  chatApiEndpoint?: string;
  chatApiRequestFormat?: Record<string, unknown>;
  chatApiResponseFormat?: Record<string, unknown>;
  supportsStreaming?: boolean;

  // Task mode fields
  executeEndpoint?: string;
  inputSchema?: Record<string, unknown>;
  outputFormat?: OutputFormat;
  isAsyncExecution?: boolean;
  callbackUrl?: string;

  // Auto-reply mode fields
  replyEndpoint?: string;
  supportedPlatforms?: string[];

  // Event mode fields
  eventEndpoint?: string;
  triggerType?: TriggerType;
  scheduleConfig?: Record<string, unknown>;
  supportedEvents?: string[];
  eventConfigSchema?: Record<string, unknown>;
}

export type {
  AuthMethod,
  CreateExternalAgentDTO,
  ExecutionMode,
  ExternalAgent,
  InteractionMode,
  OutputFormat,
  TriggerType,
  UpdateExternalAgentDTO,
};
