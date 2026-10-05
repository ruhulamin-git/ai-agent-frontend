// Types for agent settings sections
interface SettingsNavItem {
  id: string;
  label: string;
  icon: string;
}

interface TierFeature {
  id: string;
  label: string;
  enabled: boolean;
}

// ── Pricing Plan Types (aligned with API) ──

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

interface PricingPlanListResponse {
  message: string;
  data: AgentPricingPlan[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ── Publish / Unpublish Types ──

interface PublishAgentResponse {
  message: string;
  data: {
    id: number;
    name: string;
    publishStatus: "published" | "draft";
    isPublished: boolean;
    publishedAt: string | null;
  };
}

// ── Legacy types kept for backward compatibility ──

/** @deprecated Use AgentPricingPlan instead */
interface AgentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  usageLimit: string;
  freeTrialDays: number;
  features: TierFeature[];
}

interface PayoutOverview {
  unpaidEarnings: number;
  activeSubscribers: number;
  subscriberGrowth: number;
  totalRevenue: string;
}

interface RateLimits {
  globalRateLimit: number;
  perUserConcurrentLimit: number;
}

type SubscriptionModel = "free" | "tiered" | "pay-per-use";

interface AgentDashboardMetrics {
  totalSubscribers: number;
  monthlyRevenue: number;
  lifetimeRevenue: number;
  rating: number;
  reviewCount: number;
}

interface AgentSettingsData {
  subscriptionModel: SubscriptionModel;
  plans: AgentPlan[];
  payoutOverview: PayoutOverview;
  rateLimits: RateLimits;
  visibility: "public" | "private";
  isActive: boolean;
  metrics: AgentDashboardMetrics;
}

// ── Form values for the PlanDialog ──

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

export type {
  AgentDashboardMetrics,
  AgentPlan,
  AgentPricingPlan,
  AgentSettingsData,
  CreatePricingPlanDTO,
  PayoutOverview,
  PricingPlanFormValues,
  PricingPlanListResponse,
  PricingType,
  PublishAgentResponse,
  RateLimits,
  SettingsNavItem,
  SubscriptionModel,
  TierFeature,
  UpdatePricingPlanDTO,
};
