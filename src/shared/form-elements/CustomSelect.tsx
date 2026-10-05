"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface CustomSelectProps extends React.ComponentProps<typeof Select> {
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export const CustomSelect = ({
  placeholder,
  error,
  helperText,
  className,
  id,
  children,
  ...props
}: CustomSelectProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Select {...props}>
        <SelectTrigger
          id={id}
          className={cn(
            "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-11",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
          {children}
        </SelectContent>
      </Select>
      {helperText && (
        <p
          className={cn(
            "text-xs font-medium transition-colors",
            error ? "text-destructive" : "text-gray-600 dark:text-gray-400"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
