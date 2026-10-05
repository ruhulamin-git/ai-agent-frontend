// API Response Types (exactly as your API returns)
export interface ApiResponse<T> {
  path: string;
  timestamp: string;
  status: "success" | "error";
  message: string;
  data: T;
  errors: any;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  current_page: number;
  num_pages: number;
  page_size: number;
  total_count: number;
}

export interface Category {
  id: number;
  company: string | null;
  name: string;
  slug: string;
  icon: string | null;
  parent: number | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  pricingType: "free" | "monthly" | "yearly";
  price: string;
  currency: string;
  features: string[];
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
}

// API Response PricingPlan (snake_case from API)
export interface ApiPricingPlan {
  id: number;
  name: string;
  pricing_type: "free" | "monthly" | "yearly";
  price: string;
  currency: string;
  features: string[];
  max_messages_per_month: number;
  max_integrations: number;
  trial_days: number;
  is_active: boolean;
}

export interface Owner {
  id: number;
  name: string;
  logo_url: string | null;
  url: string | null;
  email: string;
}

export interface Agent {
  id: number;
  displayTitle: string;
  name: string;
  description: string;
  shortDescription: string | null;
  agentType: string;
  sourceType: "internal" | "external" | "user_created";
  tags: string[];
  category: Category;
  iconUrl: string | null;
  coverImageUrl: string | null;
  demoUrl: string | null;
  averageRating: number | null;
  totalPurchases: number;
  pricingPlans: PricingPlan[]; // Array of pricing plans
  firstPricingPlan: PricingPlan | null;
  publishedAt: string | null;
  owner?: Owner; // Owner information from backend
}

// API Response for agents list (following the pattern)
export interface AgentsApiResponse {
  path: string;
  timestamp: string;
  status: "success" | "error";
  message: string;
  data: Agent[];
  errors: any;
  pagination: PaginationInfo;
}

// Hook options interface (following the pattern)
export interface UseAgentsOptions {
  search?: string;
  sourceType?: "internal" | "external" | "user_created";
  agentType?: string;
  category?: string;
  pricingType?: "free" | "freemium" | "premium";
  tags?: string[];
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<AgentsApiResponse, import("axios").AxiosError>,
    "queryKey" | "queryFn"
  >;
}

// Filter Types
export interface AgentFilters {
  agent_type?: string;
  category?: string;
  source_type?: "internal" | "external" | "user_created";
  tags?: string[];
  search?: string;
  pricing_type?: "free" | "freemium" | "premium";
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// UI Agent Type for compatibility with existing components
export interface UIAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pricing: "free" | "freemium" | "premium";
  status: "online" | "offline" | "maintenance";
  capabilities: string[];
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  installCommand: string;
  documentation?: string;
  repository?: string;
  featured?: boolean;
  trending?: boolean;
  originalAgent?: any;
}

// Convert API Agent to UI Agent
export const convertToUIAgent = (agent: Agent): UIAgent => {
  // Determine pricing type based on pricing plans
  const getPricingType = (pricingPlans: PricingPlan[]): "free" | "freemium" | "premium" => {
    if (!pricingPlans || pricingPlans.length === 0) return "free";

    const hasFree = pricingPlans.some(
      (plan) => plan.pricingType === "free" || Number(plan.price) === 0
    );
    const hasPaid = pricingPlans.some(
      (plan) => plan.pricingType !== "free" && Number(plan.price) > 0
    );

    if (hasFree && hasPaid) return "freemium";
    if (hasFree) return "free";
    if (hasPaid) return "premium";

    return "free"; // fallback
  };

  // Support both camelCase and snake_case responses from API
  const getAgentPricingPlans = (agent: Agent | any) => agent.pricingPlans || agent.pricing_plans || [];

  return {
    id: agent.id.toString(),
    name: (agent as any).display_title || agent.displayTitle || agent.name,
    description: agent.description || (agent as any).short_description || agent.shortDescription || "",
    icon: (agent as any).icon_url || agent.iconUrl || "🤖",
    category: agent.category?.name || (agent as any).agent_type || agent.agentType || "general",
    pricing: getPricingType(getAgentPricingPlans(agent)),
    status: "online" as const,
    capabilities: agent.tags || [],
    author:
      ((agent as any).source_type || agent.sourceType) === "user_created"
        ? "Community"
        : ((agent as any).source_type || agent.sourceType) === "external"
          ? "External"
          : "Official",
    downloads: (agent as any).total_purchases ?? agent.totalPurchases ?? 0,
    rating: (agent as any).average_rating ?? agent.averageRating ?? 0,
    tags: agent.tags || [],
    installCommand: `install-agent-${agent.id}`,
    featured: ((agent as any).source_type || agent.sourceType) === "internal",
    trending: ((agent as any).total_purchases ?? agent.totalPurchases ?? 0) > 100,
    originalAgent: agent,
  };
};
