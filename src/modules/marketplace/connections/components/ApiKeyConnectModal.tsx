"use client";

import { IconExternalLink, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import type { ApiKeyAuthConfig, IntegrationProviderDetails } from "../types";

/** Converts snake_case to Title Case (e.g. "bot_token" → "Bot Token") */
const toTitleCase = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface ApiKeyConnectModalProps {
  open: boolean;
  onClose: () => void;
  providerDetails: IntegrationProviderDetails | undefined;
  isLoading: boolean;
  isConnecting: boolean;
  onSubmit: (credentials: Record<string, string>, appIntegrationId: number) => void;
}

export const ApiKeyConnectModal = ({
  open,
  onClose,
  providerDetails,
  isLoading,
  isConnecting,
  onSubmit,
}: ApiKeyConnectModalProps) => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});

  const authConfig =
    providerDetails?.authConfig.type === "api_key"
      ? (providerDetails.authConfig as ApiKeyAuthConfig)
      : null;

  // Reset form when modal opens with a new provider
  useEffect(() => {
    if (open && authConfig) {
      const initial: Record<string, string> = {};
      for (const field of authConfig.requiredFields) {
        initial[field] = "";
      }
      for (const field of authConfig.optionalFields) {
        initial[field] = "";
      }
      setCredentials(initial);
      setVisibleFields({});
    }
  }, [open, providerDetails?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldChange = useCallback((field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleFieldVisibility = useCallback((field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!providerDetails || !authConfig) return;

      // Validate required fields are filled
      const missingFields = authConfig.requiredFields.filter(
        (field) => !credentials[field]?.trim()
      );
      if (missingFields.length > 0) return;

      // Only send non-empty credentials
      const filteredCredentials: Record<string, string> = {};
      for (const [key, value] of Object.entries(credentials)) {
        if (value.trim()) {
          filteredCredentials[key] = value.trim();
        }
      }

      onSubmit(filteredCredentials, providerDetails.appIntegrationId);
    },
    [credentials, providerDetails, authConfig, onSubmit]
  );

  const allFields = authConfig ? [...authConfig.requiredFields, ...authConfig.optionalFields] : [];

  const isFormValid = authConfig
    ? authConfig.requiredFields.every((field) => credentials[field]?.trim())
    : false;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {t("pages.connections.connect")} {providerDetails?.name ?? ""}
          </DialogTitle>
          <DialogDescription>
            {t("pages.connections.enter_credentials_description", {
              provider: providerDetails?.name ?? "",
            })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : authConfig ? (
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            {allFields.map((field) => {
              const fieldType = authConfig.fieldTypes[field] ?? "text";
              const label = toTitleCase(authConfig.fieldLabels[field] ?? field);
              const placeholder = authConfig.fieldPlaceholders[field] ?? "";
              const help = authConfig.helpText[field] ?? "";
              const isRequired = authConfig.requiredFields.includes(field);
              const isPassword = fieldType === "password";
              const isVisible = visibleFields[field];

              return (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-sm font-medium">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  <div className="relative">
                    <Input
                      id={field}
                      type={isPassword && !isVisible ? "password" : "text"}
                      placeholder={placeholder}
                      value={credentials[field] ?? ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      required={isRequired}
                      className="pr-10"
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => toggleFieldVisibility(field)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {isVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    )}
                  </div>

                  {help && <p className="text-xs text-slate-500 dark:text-slate-400">{help}</p>}
                </div>
              );
            })}

            {/* Docs Link */}
            {authConfig.docsUrl && (
              <a
                href={authConfig.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <IconExternalLink size={14} />
                {t("pages.connections.view_documentation")}
              </a>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isConnecting}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={!isFormValid || isConnecting}>
                {isConnecting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("pages.connections.connect")}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
