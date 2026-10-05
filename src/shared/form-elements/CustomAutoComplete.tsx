"use client";

import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/shared/ui/command";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export interface AutoCompleteOption {
  value: string;
  label: string;
}

interface CustomAutoCompleteProps {
  options: AutoCompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  error?: boolean;
  helperText?: string;
  id?: string;
  disabled?: boolean;
}

export const CustomAutoComplete = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  emptyMessage = "No options found.",
  className,
  error,
  helperText,
  id,
  disabled,
}: CustomAutoCompleteProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value?.toString() === value?.toString()),
    [options, value]
  );

  // Sync search query with selected option when not open
  React.useEffect(() => {
    if (!open) {
      setSearchQuery(selectedOption?.label ?? "");
    }
  }, [open, selectedOption]);

  const handleSelect = (option: AutoCompleteOption) => {
    onChange?.(option.value);
    setSearchQuery(option.label);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    setSearchQuery("");
  };

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="presentation"
            className="relative group w-full cursor-pointer"
            onClick={(e) => {
              if (open) {
                // If already open, prevent the trigger from toggling it closed
                // This ensures it behaves like MUI where clicking again keeps it open
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <Input
              id={id}
              disabled={disabled}
              autoComplete="off"
              placeholder={placeholder}
              value={searchQuery}
              aria-invalid={error}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleOpen();
              }}
              onFocus={handleOpen}
              className={cn(
                "pr-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 h-11 pointer-events-auto",
                selectedOption ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-500",
                error &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              {value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="pointer-events-auto p-0.5 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 opacity-50",
                  open && "rotate-180 text-primary opacity-100"
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 shadow-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className="bg-white dark:bg-gray-900 translate-y-0 w-full text-gray-900 dark:text-gray-100">
            <CommandList className="max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted">
              <CommandEmpty className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup className="p-1">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-sm text-gray-900 dark:text-gray-100 transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-gray-900 dark:aria-selected:text-white",
                      value === option.value?.toString() && "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value?.toString() === option.value?.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
