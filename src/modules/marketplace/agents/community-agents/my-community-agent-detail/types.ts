// Types for my community agent detail page — subscription, settings, and unsubscribe

// ==================== Subscription Details ====================

export interface SubscriptionDetails {
  id: number;
  status: "active" | "trialing" | "cancelled" | "expired" | "past_due";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  isLifetime: boolean;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  pricingType: "free" | "monthly" | "yearly" | "lifetime";
  price: string;
  currency: string;
  trialDays: number;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
}

// ==================== My Community Agent Detail ====================

export interface MyCommunityAgentDetail {
  id: number;
  agent: {
    id: number;
    name: string;
    description: string;
    icon?: string;
    sourceType: string;
    // Additional fields that might be in the response
    displayTitle?: string;
    agentType?: string;
    iconUrl?: string | null;
    isPublished?: boolean;
    role?: string;
    welcomeMessage?: string;
    capabilities?: string[];
    averageRating?: string;
    totalReviews?: number;
  };
  pricingPlan: {
    id: number;
    name: string;
    price: string;
    currency: string;
    interval?: string;
    intervalCount?: number;
    // Additional fields for compatibility
    pricingType?: string;
    trialDays?: number;
    maxMessagesPerMonth?: number;
    maxIntegrations?: number;
  };
  // Subscription fields are at root level in real API
  status: "active" | "trialing" | "cancelled" | "expired" | "past_due";
  displayStatus: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  isLifetime: boolean;
  cancelAtPeriodEnd: boolean;
  cancelledAt: string | null;
  subscribedAt: string;
  canCancel: boolean;
  canResubscribe: boolean;
  isActiveEntitlement: boolean;
  daysUntilRenewal: number | null;
  createdAt: string;
  updatedAt: string;

  // Legacy fields for backward compatibility with mock data
  subscription?: SubscriptionDetails;
}

export interface MyCommunityAgentDetailResponse {
  message: string;
  data: MyCommunityAgentDetail;
}

// ==================== Settings ====================

export interface CommunityAgentSettings {
  notifications: {
    emailOnNewMessage: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    allowAgentToLearn: boolean;
  };
  preferences: {
    language: string;
    responseLength: "concise" | "balanced" | "detailed";
    autoReply: boolean;
  };
}

// ==================== Unsubscribe ====================

export interface UnsubscribePayload {
  reason?: string;
  feedback?: string;
}

export interface UnsubscribeResponse {
  message: string;
  data: {
    purchaseId: number;
    agentName: string;
    status: string;
    cancelledAt: string;
  };
}

export type { MyCommunityAgentDetail as MyCommunityAgentDetailType };
