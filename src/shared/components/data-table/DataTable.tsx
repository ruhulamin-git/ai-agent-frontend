"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Skeleton } from "@/shared/ui/skeleton";

import { DataTablePagination } from "./DataTablePagination";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  isLoading?: boolean;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  loadingSkeletonRows?: number;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading = false,
  pageCount = 1,
  pageIndex = 0,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  pagination,
  onPaginationChange,
  pageSizeOptions,
  emptyMessage = "No results found.",
  loadingSkeletonRows = 5,
}: DataTableProps<TData, TValue>) => {
  const resolvedPagination: PaginationState = pagination ?? {
    pageIndex,
    pageSize,
  };

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: resolvedPagination,
    },
    onPaginationChange: (updater) => {
      const nextPagination = typeof updater === "function" ? updater(resolvedPagination) : updater;

      if (onPaginationChange) {
        onPaginationChange(nextPagination);
        return;
      }

      if (nextPagination.pageIndex !== resolvedPagination.pageIndex) {
        onPageChange?.(nextPagination.pageIndex);
      }

      if (nextPagination.pageSize !== resolvedPagination.pageSize) {
        onPageSizeChange?.(nextPagination.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4 shadow-sm">
      <div className="rounded border border-gray-300 dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-slate-900">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-200 dark:bg-slate-800/50 border-b border-gray-300 dark:border-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: loadingSkeletonRows }).map((_, index) => {
                  const rowKey = `skeleton-row-${index}`;
                  return (
                    <tr key={rowKey}>
                      {columns.map((column, colIndex) => {
                        const cellKey = `skeleton-cell-${index}-${colIndex}`;
                        return (
                          <td key={cellKey} className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-5 w-full max-w-50" />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-200/50 dark:hover:bg-muted/20 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-slate-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500 dark:text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination wrapper */}
      {!isLoading && (totalCount > 0 || pageCount > 1) && (
        <DataTablePagination
          table={table}
          pageIndex={resolvedPagination.pageIndex}
          pageSize={resolvedPagination.pageSize}
          totalPages={pageCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
};
