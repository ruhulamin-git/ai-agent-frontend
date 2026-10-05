// Types for external agent settings

import type {
  AuthMethod,
  ExecutionMode,
  InteractionMode,
  OutputFormat,
  TriggerType,
} from "../types";

// ── Settings Navigation ──
interface SettingsNavItem {
  id: string;
  label: string;
  icon: string;
}

// ── Dashboard Metrics ──
interface ExternalAgentDashboardMetrics {
  totalSubscribers: number;
  monthlyRevenue: number;
  lifetimeRevenue: number;
  rating: number;
  reviewCount: number;
}

// ── Pricing Plan Types (same as manage-agents) ──
type PricingType = "free" | "monthly" | "yearly" | "lifetime";

interface AgentPricingPlan {
  id: number;
  agent: number;
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  stripePriceId: string | null;
  stripeProductId: string | null;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreatePricingPlanDTO {
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
  features?: string[];
}

type UpdatePricingPlanDTO = Partial<CreatePricingPlanDTO>;

interface PricingPlanFormValues {
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
  features: string[];
}

// ── General Tab Form Values ──
interface ExternalAgentGeneralFormValues {
  // Agent metadata
  name: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  welcomeMessage?: string;
  demoUrl?: string;
  tags?: string[];
  category?: number;

  // External agent configuration
  siteUrl: string;
  authMethod: AuthMethod;
  executionMode: ExecutionMode;
  interactionMode: InteractionMode;

  // Common fields
  authEndpoint?: string;
  healthEndpoint?: string;
  documentationUrl?: string;
  rateLimitPerMinute?: number;
  timeoutSeconds?: number;
  webhookSecret?: string;
  credentialSchema?: Record<string, unknown>;
  tokenResponseKey?: string;
  tokenQueryParamName?: string;

  // Chat mode fields
  chatFrontendUrl?: string;
  chatApiEndpoint?: string;
  supportsStreaming?: boolean;
  chatApiRequestFormat?: Record<string, unknown>;
  chatApiResponseFormat?: Record<string, unknown>;

  // Task mode fields
  executeEndpoint?: string;
  outputFormat?: OutputFormat;
  isAsyncExecution?: boolean;
  callbackUrl?: string;
  inputSchema?: Record<string, unknown>;

  // Auto-reply mode fields
  replyEndpoint?: string;
  supportedPlatforms?: string[];

  // Event mode fields
  eventEndpoint?: string;
  triggerType?: TriggerType;
  supportedEvents?: string[];
  scheduleConfig?: Record<string, unknown>;

  // File uploads
  iconFile?: File | null;
  coverFile?: File | null;
  iconRemoved?: boolean;
  coverRemoved?: boolean;
}

// ── Configuration Tab ──
interface ExternalAgentConfigFormValues {
  credentialSchema?: Record<string, unknown>;
  tokenResponseKey?: string;
  tokenQueryParamName?: string;
  webhookSecret?: string;

  // Chat mode advanced
  chatApiRequestFormat?: Record<string, unknown>;
  chatApiResponseFormat?: Record<string, unknown>;

  // Task mode advanced
  inputSchema?: Record<string, unknown>;
  callbackUrl?: string;

  // Event mode advanced
  scheduleConfig?: Record<string, unknown>;
  eventConfigSchema?: Record<string, unknown>;
}

// ── Health Status ──
interface HealthCheckResult {
  status: "healthy" | "degraded" | "down" | "unknown";
  responseTime?: number;
  lastChecked: string;
  message?: string;
}

export type {
  AgentPricingPlan,
  CreatePricingPlanDTO,
  ExternalAgentConfigFormValues,
  ExternalAgentDashboardMetrics,
  ExternalAgentGeneralFormValues,
  HealthCheckResult,
  PricingPlanFormValues,
  PricingType,
  SettingsNavItem,
  UpdatePricingPlanDTO,
};
