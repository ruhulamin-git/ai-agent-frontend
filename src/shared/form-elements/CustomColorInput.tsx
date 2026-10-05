"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/shared/ui/input";

interface CustomColorInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    className?: string;
    disabled?: boolean;
}

export const CustomColorInput = React.forwardRef<HTMLDivElement, CustomColorInputProps>(
    ({ id, value, onChange, error, helperText, className, disabled }, ref) => {
        return (
            <div ref={ref} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="h-9 w-10 rounded-lg border border-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        aria-invalid={error}
                        className={cn(
                            "flex-1 font-mono text-xs px-4 bg-background border-border text-foreground placeholder:text-muted-foreground",
                            error &&
                            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                            className
                        )}
                    />
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

CustomColorInput.displayName = "CustomColorInput";
