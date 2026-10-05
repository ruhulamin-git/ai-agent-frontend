"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/shared/ui/textarea";

interface CustomTextAreaProps extends React.ComponentProps<typeof Textarea> {
  error?: boolean;
  helperText?: string;
}

export const CustomTextArea = React.forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
  ({ error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          ref={ref}
          aria-invalid={error}
          className={cn(
            "bg-background border-border text-muted-foreground placeholder:text-muted-foreground",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              "text-xs font-medium transition-colors",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";
