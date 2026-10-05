"use client";

import { Button } from "@/shared/ui/button";

import type { Pagination as PaginationType } from "../service/types";

interface PaginationProps {
  pagination: PaginationType;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, currentPage, onPageChange }: PaginationProps) => {
  if (pagination.num_pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Previous
      </Button>

      <span className="text-gray-600 dark:text-gray-400 text-sm px-4">
        Page {pagination.current_page} of {pagination.num_pages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(pagination.num_pages, currentPage + 1))}
        disabled={currentPage === pagination.num_pages}
        className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Next
      </Button>
    </div>
  );
};
