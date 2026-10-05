import type { ColumnFiltersState } from "@tanstack/react-table";

interface BaseApiResponse<T> {
  path: string;
  timestamp: string;
  status: "success" | "fail";
  message: string;
  data: T;
  errors: string | null;
}

interface Pagination {
  totalPages: number;
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
}

interface URLParams {
  page: number;
  pageSize: number;
}

type FilterType = ColumnFiltersState;

export type { BaseApiResponse, FilterType, Pagination, URLParams };
