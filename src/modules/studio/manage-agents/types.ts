import type { AxiosError } from "axios";

// DTO for creating a user-created agent (form data payload)
interface CreateUserAgentDTO {
  name: string;
  description: string;
  welcomeMessage: string;
  workflowDefinition: string; // JSON string
  tags: string[];
  shortDescription: string;
  longDescription: string;
  demoUrl: string;
  icon?: File | null;
  coverImage?: File | null;
}

// DTO for updating a user-created agent
type UpdateUserAgentDTO = Partial<CreateUserAgentDTO>;

// API response shape for a user agent
interface UserAgent {
  id: number;
  name: string;
  description: string;
  agentType: string;
  welcomeMessage: string;
  sourceType: string;
  publishStatus: "draft" | "published";
  isPublished: boolean;
  tags: string[];
  iconUrl: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  // Fields available on detail endpoint
  shortDescription?: string;
  longDescription?: string;
  demoUrl?: string;
  workflowDefinition?: Record<string, unknown>;
}

// List response
interface UserAgentListResponse {
  data: UserAgent[];
  pagination: {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalCount: number;
  };
}

// Options for the list query hook
interface UseUserAgentListOptions {
  search?: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<UserAgent[], AxiosError>,
    "queryKey" | "queryFn"
  >;
}

// Options for the detail query hook
interface UseUserAgentDetailOptions {
  agentId: string;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<UserAgent, AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export type {
  CreateUserAgentDTO,
  UpdateUserAgentDTO,
  UserAgent,
  UserAgentListResponse,
  UseUserAgentDetailOptions,
  UseUserAgentListOptions,
};
