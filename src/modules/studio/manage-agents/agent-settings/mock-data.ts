import type { AgentSettingsData } from "./types";

const MOCK_AGENT_SETTINGS: Record<string, AgentSettingsData> = {
  "agent-1": {
    subscriptionModel: "tiered",
    plans: [
      {
        id: "plan-1",
        name: "Pro Subscription",
        price: 29,
        duration: "1 month",
        usageLimit: "5,000,000",
        freeTrialDays: 14,
        features: [
          { id: "f1", label: "Priority access to new models", enabled: true },
          { id: "f2", label: "Image generation support", enabled: true },
          { id: "f3", label: "Custom domain support", enabled: false },
        ],
      },
    ],
    payoutOverview: {
      unpaidEarnings: 1248.5,
      activeSubscribers: 142,
      subscriberGrowth: 12,
      totalRevenue: "$12.4k",
    },
    rateLimits: {
      globalRateLimit: 1000,
      perUserConcurrentLimit: 3,
    },
    visibility: "public",
    isActive: true,
    metrics: {
      totalSubscribers: 142,
      monthlyRevenue: 4118,
      lifetimeRevenue: 24500,
      rating: 4.8,
      reviewCount: 32,
    },
  },
  "agent-2": {
    subscriptionModel: "free",
    plans: [
      {
        id: "plan-1",
        name: "Basic Free",
        price: 0,
        duration: "1 month",
        usageLimit: "500,000",
        freeTrialDays: 0,
        features: [
          { id: "f1", label: "Priority access to new models", enabled: false },
          { id: "f2", label: "Image generation support", enabled: false },
          { id: "f3", label: "Custom domain support", enabled: false },
        ],
      },
    ],
    payoutOverview: {
      unpaidEarnings: 0,
      activeSubscribers: 0,
      subscriberGrowth: 0,
      totalRevenue: "$0",
    },
    rateLimits: {
      globalRateLimit: 100,
      perUserConcurrentLimit: 1,
    },
    visibility: "private",
    isActive: false,
    metrics: {
      totalSubscribers: 0,
      monthlyRevenue: 0,
      lifetimeRevenue: 0,
      rating: 0,
      reviewCount: 0,
    },
  },
  "agent-3": {
    subscriptionModel: "pay-per-use",
    plans: [],
    payoutOverview: {
      unpaidEarnings: 587.2,
      activeSubscribers: 89,
      subscriberGrowth: 24,
      totalRevenue: "$8.7k",
    },
    rateLimits: {
      globalRateLimit: 500,
      perUserConcurrentLimit: 5,
    },
    visibility: "public",
    isActive: true,
    metrics: {
      totalSubscribers: 1205,
      monthlyRevenue: 15200,
      lifetimeRevenue: 142000,
      rating: 4.9,
      reviewCount: 342,
    },
  },
  "agent-4": {
    subscriptionModel: "tiered",
    plans: [
      {
        id: "plan-1",
        name: "Business Team Plan",
        price: 999,
        duration: "1 year",
        usageLimit: "20,000,000",
        freeTrialDays: 30,
        features: [
          { id: "f1", label: "Priority access to new models", enabled: true },
          { id: "f2", label: "Image generation support", enabled: true },
          { id: "f3", label: "Custom domain support", enabled: true },
        ],
      },
    ],
    payoutOverview: {
      unpaidEarnings: 3420.0,
      activeSubscribers: 47,
      subscriberGrowth: 8,
      totalRevenue: "$24.1k",
    },
    rateLimits: {
      globalRateLimit: 2000,
      perUserConcurrentLimit: 10,
    },
    visibility: "private",
    isActive: true,
    metrics: {
      totalSubscribers: 15,
      monthlyRevenue: 450,
      lifetimeRevenue: 1800,
      rating: 4.5,
      reviewCount: 4,
    },
  },
};

// Default settings for unknown agents
const DEFAULT_SETTINGS: AgentSettingsData = {
  subscriptionModel: "free",
  plans: [],
  payoutOverview: {
    unpaidEarnings: 0,
    activeSubscribers: 0,
    subscriberGrowth: 0,
    totalRevenue: "$0",
  },
  rateLimits: {
    globalRateLimit: 100,
    perUserConcurrentLimit: 1,
  },
  visibility: "private",
  isActive: false,
  metrics: {
    totalSubscribers: 0,
    monthlyRevenue: 0,
    lifetimeRevenue: 0,
    rating: 0,
    reviewCount: 0,
  },
};

export { DEFAULT_SETTINGS, MOCK_AGENT_SETTINGS };
