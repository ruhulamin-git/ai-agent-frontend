import type {
  CommunityAgentSettings,
  MyCommunityAgentDetail,
  MyCommunityAgentDetailResponse,
  SubscriptionDetails,
  SubscriptionPlan,
  UnsubscribeResponse,
} from "../types";

// ==================== Mock Data ====================

const MOCK_SUBSCRIPTION: SubscriptionDetails = {
  id: 1001,
  status: "active",
  currentPeriodStart: "2026-03-01T00:00:00Z",
  currentPeriodEnd: "2026-04-01T00:00:00Z",
  trialEndsAt: null,
  isLifetime: false,
  cancelAtPeriodEnd: false,
  cancelledAt: null,
  createdAt: "2026-01-15T10:30:00Z",
};

const MOCK_PRICING_PLAN: SubscriptionPlan = {
  id: 10,
  name: "Pro Plan",
  pricingType: "monthly",
  price: "29.99",
  currency: "USD",
  trialDays: 14,
  maxMessagesPerMonth: 5000,
  maxIntegrations: 10,
};

const MOCK_AGENT_DETAIL: MyCommunityAgentDetail = {
  id: 42,
  agent: {
    id: 101,
    name: "SalesForce Genius",
    displayTitle: "AI-Powered Sales Assistant",
    description:
      "An intelligent sales assistant that helps you manage leads, automate follow-ups, and close deals faster with AI-driven insights and recommendations.",
    agentType: "messaging",
    sourceType: "user_created",
    iconUrl: null,
    isPublished: true,
    role: "Sales Assistant",
    welcomeMessage: "Hi! I'm your sales assistant. How can I help you close more deals today?",
    capabilities: [
      "Lead Management",
      "Email Automation",
      "Pipeline Analytics",
      "Meeting Scheduling",
      "CRM Integration",
      "Follow-up Reminders",
    ],
    averageRating: "4.7",
    totalReviews: 128,
  },
  pricingPlan: MOCK_PRICING_PLAN,
  // Subscription fields at root level
  status: "active",
  displayStatus: "Active",
  currentPeriodStart: "2026-03-01T00:00:00Z",
  currentPeriodEnd: "2026-04-01T00:00:00Z",
  trialEndsAt: null,
  isLifetime: false,
  cancelAtPeriodEnd: false,
  cancelledAt: null,
  subscribedAt: "2026-01-15T10:30:00Z",
  canCancel: true,
  canResubscribe: false,
  isActiveEntitlement: true,
  daysUntilRenewal: 30,
  createdAt: "2026-01-15T10:30:00Z",
  updatedAt: "2026-03-15T14:20:00Z",
  // Keep legacy subscription field for backward compatibility
  subscription: MOCK_SUBSCRIPTION,
};

const MOCK_SETTINGS: CommunityAgentSettings = {
  notifications: {
    emailOnNewMessage: true,
    pushNotifications: true,
    dailyDigest: false,
  },
  privacy: {
    shareUsageData: false,
    allowAgentToLearn: true,
  },
  preferences: {
    language: "en",
    responseLength: "balanced",
    autoReply: false,
  },
};

// ==================== Mock API Functions ====================

const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMyCommunityAgentDetailMock = async (
  id: string | number
): Promise<MyCommunityAgentDetailResponse> => {
  await simulateDelay();

  return {
    message: "Success",
    data: { ...MOCK_AGENT_DETAIL, id: Number(id) },
  };
};

export const getCommunityAgentSettingsMock = async (
  _agentId: string | number
): Promise<CommunityAgentSettings> => {
  await simulateDelay(600);
  return { ...MOCK_SETTINGS };
};

export const updateCommunityAgentSettingsMock = async (
  _agentId: string | number,
  settings: Partial<CommunityAgentSettings>
): Promise<CommunityAgentSettings> => {
  await simulateDelay(500);
  return { ...MOCK_SETTINGS, ...settings };
};

export const unsubscribeFromAgentMock = async (
  _agentId: string | number,
  _payload?: { reason?: string; feedback?: string }
): Promise<UnsubscribeResponse> => {
  await simulateDelay(1000);
  return {
    message: "Successfully unsubscribed from agent",
    data: {
      purchaseId: 100,
      agentName: "Support Bot",
      status: "cancelled",
      cancelledAt: "2026-03-30T09:30:00Z",
    },
  };
};
