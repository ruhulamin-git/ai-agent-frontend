import type { Agent, AgentPricingPlan, RequiredIntegration } from "../types";

export interface ApiAgent {
  id: number | string;
  name: string;
  description: string;
  agentType: string;
  welcomeMessage: string;
  isActive: boolean;
  iconUrl: string | null;
  coverImage?: string | null;
  averageRating?: string;
  totalReviews?: number;
  requiredIntegrations?: RequiredIntegration[];
  pricingPlans?: AgentPricingPlan[];
  firstPricingPlan?: AgentPricingPlan;
}

const DEFAULT_MOCK_CHAT = [
  {
    role: "user" as const,
    content: "Hi, I'm interested in using this agent for my business.",
  },
  {
    role: "assistant" as const,
    content:
      "Hello! I'd be happy to help. I'm optimized for handling customer inquiries and automating workflows. What specifically are you looking to achieve?",
  },
];

const visualMap: Record<string, { color: string; icon: string }> = {
  messaging: { color: "from-blue-500 to-indigo-600", icon: "mail" },
  embedded: { color: "from-violet-400 to-purple-500", icon: "database" },
  default: { color: "from-slate-400 to-slate-500", icon: "robot" },
};

const derivePrice = (
  plans?: AgentPricingPlan[]
): { price: string; billingPeriod: "monthly" | "one-time" } => {
  if (!plans || plans.length === 0) return { price: "Free", billingPeriod: "one-time" };

  const firstPlan = plans[0];

  // Handle free plans
  if (firstPlan.pricingType === "free" || firstPlan.price === "0.00" || firstPlan.price === "0") {
    return { price: "Free", billingPeriod: "one-time" };
  }

  // Format price with currency
  const priceValue = parseFloat(firstPlan.price);
  const formattedPrice = `$${priceValue.toFixed(2)}`;

  // Determine billing period
  const period = firstPlan.pricingType === "monthly" ? "monthly" : "one-time";

  return { price: formattedPrice, billingPeriod: period };
};

export const mapApiAgentToAgent = (apiAgent: ApiAgent): Agent => {
  const visuals = visualMap[apiAgent.agentType] || visualMap.default;
  const { id, ...rest } = apiAgent;

  // Use pricingPlans if available, otherwise use firstPricingPlan
  const plans =
    apiAgent.pricingPlans || (apiAgent.firstPricingPlan ? [apiAgent.firstPricingPlan] : []);
  const { price, billingPeriod } = derivePrice(plans);

  return {
    ...rest,
    id: String(id),
    slug: apiAgent.name.toLowerCase().replace(/\s+/g, "-"),
    role: apiAgent.agentType === "messaging" ? "Messaging Specialist" : "Integration Specialist",
    longDescription: apiAgent.description,
    tags: [apiAgent.agentType, "AI", "Automation"],
    mockChat: DEFAULT_MOCK_CHAT,
    category: apiAgent.agentType,
    color: visuals.color,
    bgColor: `${visuals.color.split(" ")[0].replace("from-", "bg-")}/10`,
    borderColor: `${visuals.color.split(" ")[0].replace("from-", "border-")}/30`,
    icon: visuals.icon,
    imageUrl: apiAgent.iconUrl || undefined,
    coverImage: apiAgent.coverImage || undefined,
    averageRating: apiAgent.averageRating ?? "0.00",
    totalReviews: apiAgent.totalReviews ?? 0,
    price,
    billingPeriod,
    capabilities: ["Real-time communication", "Automated responses", "24/7 Availability"],
    requiredIntegrations: apiAgent.requiredIntegrations ?? [],
    pricingPlans: plans,
  };
};
