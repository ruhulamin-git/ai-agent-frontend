"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CustomCheckbox = ({ label, className, id, ...props }: CustomCheckboxProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        id={inputId}
        className={cn(
          "h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer transition-colors",
          className
        )}
        {...props}
      />
      <span className="text-foreground text-sm group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
};
