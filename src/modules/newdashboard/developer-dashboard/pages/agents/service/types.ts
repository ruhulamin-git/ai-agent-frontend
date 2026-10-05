import type { AxiosError } from "axios";

export interface UserAgent {
  id: number;
  name: string;
  description: string;
  agentType: string;
  welcomeMessage: string;
  sourceType: string;
  publishStatus: "draft" | "published" | "pending_review";
  isPublished: boolean;
  tags: string[];
  iconUrl: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  shortDescription?: string;
  longDescription?: string;
  demoUrl?: string;
  workflowDefinition?: Record<string, unknown>;
  chatflowId?: string;
  type?: string;
}

export interface UseUserAgentListOptions {
  search?: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<UserAgent[], AxiosError>,
    "queryKey" | "queryFn"
  >;
}
