import { axios } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import type { BuyerDashboardSummaryResponse, BuyerRecentPurchasesResponse, BuyerTopRatedAgentsResponse } from "./type";

const getBuyerDashboardSummary = async (): Promise<BuyerDashboardSummaryResponse> => {
    const response = await axios.get("/api/dashboard/v1/buyer/summary/");
    return response as unknown as BuyerDashboardSummaryResponse;
};

export const useBuyerDashboardSummary = () => {
    return useQuery({
        queryKey: ["buyer-dashboard-summary"],
        queryFn: getBuyerDashboardSummary,
    });
};

const getBuyerRecentPurchases = async (): Promise<BuyerRecentPurchasesResponse> => {
    const response = await axios.get("/api/dashboard/v1/buyer/recent-purchases/");
    return response as unknown as BuyerRecentPurchasesResponse;
};

export const useBuyerRecentPurchases = () => {
    return useQuery({
        queryKey: ["buyer-recent-purchases"],
        queryFn: getBuyerRecentPurchases,
    });
};

const getBuyerTopRatedAgents = async (): Promise<BuyerTopRatedAgentsResponse> => {
    const response = await axios.get("/api/dashboard/v1/buyer/top-rated-agents/");
    return response as unknown as BuyerTopRatedAgentsResponse;
};

export const useBuyerTopRatedAgents = () => {
    return useQuery({
        queryKey: ["buyer-top-rated-agents"],
        queryFn: getBuyerTopRatedAgents,
    });
};
