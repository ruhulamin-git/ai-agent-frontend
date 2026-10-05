import { useQuery } from "@tanstack/react-query";

import { toCamelCase } from "@/utils";
import { axios } from "@/utils/axios";

export interface SellerSummary {
  totalAgentsCreated: number;
  totalPublicAgents: number;
  totalSubscribers: number;
  totalSales: number;
  totalRevenue: string;
  pendingPayouts: string;
}

export interface SellerRevenueOverview {
  mode: "weekly" | "monthly" | "yearly";
  year: number;
  month: number | null;
  week: number | null;
  labels: string[];
  values: string[];
}

export interface TopPerformingAgent {
  id: number;
  name: string;
  totalSales: number;
  currentTotalSubscribers: number;
  totalRevenue: string;
  averageRating: string;
}

export interface RecentSale {
  purchaseId: number;
  buyerName: string;
  agentName: string;
  amount: string;
  status: string;
  purchasedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// API Response structure based on the specification
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getSellerSummary = async (): Promise<SellerSummary> => {
  const response = await axios.get("/api/dashboard/v1/seller/summary/");
  // Axios interceptor already returns response.data
  return toCamelCase(response.data) as SellerSummary;
};

export const useSellerSummary = () => {
  return useQuery({
    queryKey: ["seller-summary"],
    queryFn: getSellerSummary,
  });
};

export const getSellerRevenueOverview = async (params: {
  mode: "weekly" | "monthly" | "yearly";
  year?: number;
  month?: number;
  week?: number;
}): Promise<SellerRevenueOverview> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("mode", params.mode);
    if (params.year) searchParams.append("year", params.year.toString());
    if (params.month) searchParams.append("month", params.month.toString());
    if (params.week) searchParams.append("week", params.week.toString());

    const response = await axios.get(
      `/api/dashboard/v1/seller/revenue-overview/?${searchParams.toString()}`
    );

    // Handle different possible response structures
    let responseData;
    if (response.data?.data) {
      // Nested structure: { message: "...", data: { mode, year, labels, values } }
      responseData = response.data.data;
    } else if (response.data?.labels && response.data?.values) {
      // Direct structure: { mode, year, labels, values }
      responseData = response.data;
    } else {
      // Fallback: create default structure
      responseData = {
        mode: params.mode,
        year: params.year || new Date().getFullYear(),
        month: params.month || null,
        week: params.week || null,
        labels: [],
        values: [],
      };
    }

    const result = toCamelCase(responseData) as SellerRevenueOverview;

    // Ensure we always return a valid structure
    if (!result?.labels || !result.values) {
      return {
        mode: params.mode,
        year: params.year || new Date().getFullYear(),
        month: params.month || null,
        week: params.week || null,
        labels: [],
        values: [],
      };
    }

    return result;
  } catch (error) {
    console.error("API Error for revenue-overview:", error);
    // Return empty data structure on error so the component can handle it
    return {
      mode: params.mode,
      year: params.year || new Date().getFullYear(),
      month: params.month || null,
      week: params.week || null,
      labels: [],
      values: [],
    };
  }
};

export const useSellerRevenueOverview = (params: {
  mode: "weekly" | "monthly" | "yearly";
  year?: number;
  month?: number;
  week?: number;
}) => {
  return useQuery({
    queryKey: ["seller-revenue-overview", params],
    queryFn: () => getSellerRevenueOverview(params),
    retry: 1, // Only retry once on failure
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    // Ensure we always have a valid response
    select: (data) => {
      if (!data) {
        return {
          mode: params.mode,
          year: params.year || new Date().getFullYear(),
          month: params.month || null,
          week: params.week || null,
          labels: [],
          values: [],
        };
      }
      return data;
    },
  });
};

export const getTopPerformingAgents = async (
  params: {
    page?: number;
    pageSize?: number;
  } = {}
): Promise<PaginatedResponse<TopPerformingAgent>> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

    const response = await axios.get(
      `/api/dashboard/v1/seller/top-performing-agents/?${searchParams.toString()}`
    );

    // Axios interceptor already returns response.data, so response is the actual API response
    // API structure: { message: "...", data: [...], pagination: {...} }
    const result = {
      data: toCamelCase(response.data) as TopPerformingAgent[],
      pagination: toCamelCase(
        (response as any).pagination
      ) as PaginatedResponse<TopPerformingAgent>["pagination"],
    };

    return result;
  } catch (error) {
    console.error("API Error for top-performing-agents:", error);
    // Return empty data structure on error so the component can handle it
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: params.pageSize || 10,
        totalPages: 0,
      },
    };
  }
};

export const useTopPerformingAgents = (
  params: {
    page?: number;
    pageSize?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["top-performing-agents", params],
    queryFn: () => getTopPerformingAgents(params),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const getRecentSales = async (
  params: {
    page?: number;
    pageSize?: number;
  } = {}
): Promise<PaginatedResponse<RecentSale>> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());

    const response = await axios.get(
      `/api/dashboard/v1/seller/recent-sales/?${searchParams.toString()}`
    );

    // Axios interceptor already returns response.data
    // API structure: { message: "...", data: [...], pagination: {...} }
    const result = {
      data: toCamelCase(response.data) as RecentSale[],
      pagination: toCamelCase(
        (response as any).pagination
      ) as PaginatedResponse<RecentSale>["pagination"],
    };

    return result;
  } catch (error) {
    console.error("API Error for recent-sales:", error);
    // Return empty data structure on error so the component can handle it
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: params.pageSize || 10,
        totalPages: 0,
      },
    };
  }
};

export const useRecentSales = (
  params: {
    page?: number;
    pageSize?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["recent-sales", params],
    queryFn: () => getRecentSales(params),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
