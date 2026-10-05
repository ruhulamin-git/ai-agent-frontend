import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  activeAgents: number;
  connectedChannels: number;
  myPrivateAgents: number;
  mySubscriptions: number;
}

export interface RecentActivity {
  id: string;
  type: "agent_run" | "agent_deployed" | "integration_connected";
  title: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

export interface WelcomeData {
  userName: string;
  credits: number;
  plan: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: RecentActivity[];
  welcome: WelcomeData;
}

const API_DELAY_MS = 800;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const MINUTES_30 = 30;
const MINUTES_120 = 120;
const HOURS_5 = 5;

const THIRTY_MINUTES_AGO = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_30;
const TWO_HOURS_AGO = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_120;
const FIVE_HOURS_AGO = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_5;
const TWENTY_FOUR_HOURS_AGO = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

const mockDashboardData: DashboardData = {
  welcome: {
    userName: "Alex",
    credits: 1250,
    plan: "Pro Plan",
  },
  stats: {
    activeAgents: 4,
    connectedChannels: 5,
    myPrivateAgents: 2,
    mySubscriptions: 3,
  },
  activities: [
    {
      id: "1",
      type: "agent_run",
      title: "Email Agent processed 15 drafts",
      timestamp: new Date(Date.now() - THIRTY_MINUTES_AGO).toISOString(),
      status: "success",
    },
    {
      id: "2",
      type: "agent_deployed",
      title: "New Sales Agent deployed to Support",
      timestamp: new Date(Date.now() - TWO_HOURS_AGO).toISOString(),
      status: "success",
    },
    {
      id: "3",
      type: "integration_connected",
      title: "Gmail integration re-authenticated",
      timestamp: new Date(Date.now() - FIVE_HOURS_AGO).toISOString(),
      status: "success",
    },
    {
      id: "4",
      type: "agent_run",
      title: "CRM Sync Agent failed to update 2 records",
      timestamp: new Date(Date.now() - TWENTY_FOUR_HOURS_AGO).toISOString(),
      status: "failed",
    },
  ],
};

export const getDashboardData = async (): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
  return mockDashboardData;
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  });
};
