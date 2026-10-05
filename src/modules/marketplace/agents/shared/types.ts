import type { Agent as LandingAgent } from "@/modules/landing/data";

export interface RequiredIntegration {
  id: number;
  providerId: number;
  providerName: string;
  providerType: "oauth2" | "api_key";
  providerIcon: string | null;
  appIntegrationId: number;
  requiredScopes: string;
  isRequired: boolean;
  priority: number;
  isConnected: boolean;
}

export interface AgentPricingPlan {
  id: number;
  name: string;
  pricingType: "free" | "monthly" | "yearly" | "lifetime";
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
}

export interface Agent extends Omit<LandingAgent, "id" | "category"> {
  id: string;
  slug: string;
  role: string;
  longDescription: string;
  tags: string[];
  mockChat: Array<{
    role: "user" | "assistant" | "agent";
    content: string;
  }>;
  category: string;
  // Visual properties
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  imageUrl?: string;
  coverImage?: string;
  // Pricing
  price: string;
  billingPeriod: "monthly" | "one-time";
  // Rating & Reviews
  averageRating: string;
  totalReviews: number;
  // API Fields
  agentType: "messaging" | "embedded" | string;
  sourceType?: "internal" | "user_created" | string;
  welcomeMessage?: string;
  isActive?: boolean;
  iconUrl?: string | null;
  // Required integrations
  requiredIntegrations?: RequiredIntegration[];
  pricingPlans?: AgentPricingPlan[];
}

export type Category = "All" | "internal" | "user_created" | "external";
export type AgentType = "All" | "messaging" | "embedded";
export type PublishStatus = "All" | "draft" | "published";

export interface FilterType {
  search: string;
  category: Category;
  agentType: AgentType;
  publishStatus: PublishStatus;
}
