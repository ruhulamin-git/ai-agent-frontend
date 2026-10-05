import type { Agent } from "../../shared/types";

export interface UseAgentDetailsOptions {
  id: string | number;
  enabled?: boolean;
  config?: Omit<
    import("@tanstack/react-query").UseQueryOptions<Agent | null, import("axios").AxiosError>,
    "queryKey" | "queryFn"
  >;
}

export interface ReviewDTO {
  id: number;
  agent: number;
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDTO {
  rating: number;
  title: string;
  body: string;
}

export interface ReviewListResponse {
  data: ReviewDTO[];
  pagination: import("@/types").Pagination;
}

export interface CommentDTO {
  id: number;
  agent: number;
  userName: string;
  parent: number | null;
  content: string;
  isActive: boolean;
  replies: CommentDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDTO {
  content: string;
  parent?: number | null;
}

export interface CommentListResponse {
  data: CommentDTO[];
  pagination: import("@/types").Pagination;
}
