import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { Table } from "@tanstack/react-table";

/* eslint-disable no-magic-numbers */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
/* eslint-enable no-magic-numbers */

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const DataTablePagination = <TData,>({
  table,
  pageIndex,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps<TData>) => {
  const normalizedPageSizeOptions = Array.from(new Set([...pageSizeOptions, pageSize])).sort(
    (first, second) => first - second
  );
  const safeTotalPages = Math.max(totalPages, 1);
  const safePageIndex = Math.min(Math.max(pageIndex, 0), safeTotalPages - 1);
  const isFirstPage = safePageIndex === 0;
  const isLastPage = safePageIndex >= safeTotalPages - 1;
  const goToPage = (targetPageIndex: number) => {
    const boundedPageIndex = Math.min(Math.max(targetPageIndex, 0), safeTotalPages - 1);

    if (onPageChange) {
      onPageChange(boundedPageIndex);
      return;
    }
    table.setPageIndex(boundedPageIndex);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-2 pt-4">
      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-gray-700 dark:text-gray-400">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              const parsedPageSize = Number(value);
              if (onPageSizeChange) {
                onPageSizeChange(parsedPageSize);
                return;
              }
              table.setPageSize(parsedPageSize);
            }}
          >
            <SelectTrigger className="h-9 w-22">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {normalizedPageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex rounded-lg"
          onClick={() => goToPage(0)}
          disabled={isFirstPage}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex rounded-lg"
          onClick={() => goToPage(safePageIndex - 1)}
          disabled={isFirstPage}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium text-gray-700 dark:text-muted-foreground px-2">
          Page {safePageIndex + 1} of {safeTotalPages}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex rounded-lg"
          onClick={() => goToPage(safePageIndex + 1)}
          disabled={isLastPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 lg:flex rounded-lg"
          onClick={() => goToPage(safeTotalPages - 1)}
          disabled={isLastPage}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
