export interface BuyerDashboardSummary {
    total_purchased_agents: number;
    total_active_subscriptions: number;
    total_amount_spent: string;
    cancelled_subscriptions: number;
}

export interface BuyerDashboardSummaryResponse {
    path: string;
    timestamp: string;
    status: string;
    message: string;
    data: BuyerDashboardSummary;
    errors: null | any;
}

export interface BuyerRecentPurchase {
    purchase_id: number;
    agent_name: string;
    amount: string;
    status: string;
    purchased_at: string;
}

export interface BuyerRecentPurchasesResponse {
    path: string;
    timestamp: string;
    status: string;
    message: string;
    data: BuyerRecentPurchase[];
    errors: null | any;
    pagination: {
        current_page: number;
        num_pages: number;
        page_size: number;
        total_count: number;
    };
}

export interface BuyerTopRatedAgent {
    agent_id: number;
    name: string;
    average_rating: string;
    total_reviews: number;
    short_description: string | null;
}

export interface BuyerTopRatedAgentsResponse {
    path: string;
    timestamp: string;
    status: string;
    message: string;
    data: BuyerTopRatedAgent[];
    errors: null | any;
    pagination: {
        current_page: number;
        num_pages: number;
        page_size: number;
        total_count: number;
    };
}
