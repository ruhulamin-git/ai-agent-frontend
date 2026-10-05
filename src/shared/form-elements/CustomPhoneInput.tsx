"use client";

import { parsePhoneNumber } from "libphonenumber-js";
import { Phone } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface CustomPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  helperText?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export const CustomPhoneInput = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  className,
  error,
  helperText,
  id,
  name,
  disabled,
}: CustomPhoneInputProps) => {
  const [inputValue, setInputValue] = React.useState(value || "");

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to format and validate the phone number
    try {
      if (newValue.startsWith("+")) {
        const parsed = parsePhoneNumber(newValue);
        if (parsed) {
          onChange?.(parsed.format("E.164"));
          return;
        }
      }
    } catch {
      // If parsing fails, just pass the raw value
    }
    onChange?.(newValue);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn("relative flex items-center", disabled && "cursor-not-allowed opacity-50")}
      >
        <input
          id={id}
          name={name}
          type="tel"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          className={cn(
            "flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            error && "border-destructive focus-visible:ring-destructive/20",
            "pr-12" // Make space for the icon on the right
          )}
        />
        <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-muted-foreground pointer-events-none">
          <Phone className="h-4 w-4" />
        </div>
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
};
