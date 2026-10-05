export interface Agent {
  id: number;
  name: string;
  display_title: string;
  agent_type: string;
  source_type: string;
  icon_url: string | null;
  is_published: boolean;
  chatflow_id?: string;
  chatflowId?: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  pricing_type: "monthly" | "yearly" | "free";
  price: string;
  currency: string;
  trial_days: number;
}

export interface MyAgentSubscription {
  id: number;
  agent: Agent;
  pricing_plan: PricingPlan;
  status: "pending" | "active" | "cancelled" | "expired";
  display_status: string;
  current_period_start: string;
  current_period_end: string | null;
  trial_ends_at: string | null;
  is_lifetime: boolean;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  subscribed_at: string;
  can_resubscribe: boolean;
  created_at: string;
  replicated_chatflow_id?: string;
  replicatedChatflowId?: string;
  chatflow_data?: any;
  chatflowData?: any;
  type?: "CHATFLOW" | "MULTIAGENT" | string;
}

export interface Pagination {
  current_page: number;
  num_pages: number;
  page_size: number;
  total_count: number;
}

export interface MyAgentsResponse {
  path: string;
  timestamp: string;
  status: string;
  message: string;
  data: MyAgentSubscription[];
  errors: any;
  pagination: Pagination;
}

export interface MyAgentsStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  cancelledSubscriptions: number;
  monthlySpend: number;
}
