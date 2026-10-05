"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface CustomPasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  error?: boolean;
  helperText?: string;
}

export const CustomPasswordInput = React.forwardRef<HTMLInputElement, CustomPasswordInputProps>(
  ({ error, helperText, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            aria-invalid={error}
            className={cn(
              "px-4 pr-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500",
              error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 bottom-0 w-12 h-full flex items-center justify-center text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </Button>
        </div>
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

CustomPasswordInput.displayName = "CustomPasswordInput";
