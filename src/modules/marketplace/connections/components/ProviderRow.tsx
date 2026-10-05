"use client";

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconLink,
  IconPlug,
  IconPlugConnected,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";

import type { IntegrationProvider } from "../types";

interface ProviderRowProps {
  provider: IntegrationProvider;
  onConnect: (provider: IntegrationProvider) => void;
  onDelete: (integrationId: number) => void;
  isDeleting: boolean;
}

export const ProviderRow = ({ provider, onConnect, onDelete, isDeleting }: ProviderRowProps) => {
  const { t } = useTranslation();
  const Icon = getProviderIcon(provider.name);
  const styles = getProviderIconStyles(provider.name);

  return (
    <NeonBlobCursor
      blobColor="rgba(56, 242, 203, 0.4)"
      blobSize={300}
      intensity={0.6}
      className="rounded-3xl"
    >
      <div className="w-full rounded-3xl bg-card dark:bg-primary/5 shadow-sm overflow-hidden transition-all hover:shadow-md glass-panel">
        {/* Provider Header Row */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-300 dark:border-slate-600">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Provider Icon */}
            <div
              className={cn(
                "w-4 h-4 md:w-12 md:h-12 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-700",
                styles.iconColor
              )}
            >
              <Icon size={26} stroke={1.5} />
            </div>

            {/* Provider Info */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 capitalize">
                {provider.name}
                {provider.isConnected && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    <IconPlugConnected size={12} className="mr-1" />
                    {t("pages.connections.connected")}
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                {provider.providerType === "oauth2"
                  ? t("pages.connections.oauth_description")
                  : t("pages.connections.api_key_description")}
              </p>
            </div>
          </div>

          {/* Action: Connect */}
          <Button
            size="sm"
            onClick={() => onConnect(provider)}
            className="gap-2 font-semibold h-9 lg:px-4 rounded-lg bg-primary hover:bg-primary/90 text-white dark:text-black shadow-sm"
          >
            <IconPlug size={16} />
            <span className="hidden sm:inline">{t("pages.connections.connect_account")}</span>
            <span className="sm:hidden">{t("pages.connections.connect")}</span>
          </Button>
        </div>

        {/* Connected Accounts List */}
        <div>
          {provider.userIntegrations.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-4">{t("pages.connections.account")}</div>
                <div className="col-span-3">{t("pages.connections.status")}</div>
                <div className="col-span-3">{t("pages.connections.details")}</div>
                <div className="col-span-2 text-right">{t("pages.connections.actions")}</div>
              </div>

              {provider.userIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="group flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:px-6 sm:py-4 items-start sm:items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Account */}
                  <div className="col-span-4 flex items-center gap-3 w-full">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate capitalize">
                        {provider.name} #{integration.id}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {integration.status || t("pages.connections.active")}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="col-span-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {integration.connectedAt
                      ? new Date(integration.connectedAt).toLocaleDateString()
                      : `ID: ${integration.id}`}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(integration.id)}
                      disabled={isDeleting}
                      className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 gap-2 h-8 font-semibold"
                    >
                      <IconTrash size={16} />
                      <span className="hidden sm:inline">{t("pages.connections.disconnect")}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 mb-3">
                <IconLink className="text-2xl text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {t("pages.connections.no_accounts_connected", { platform: provider.name })}
              </p>
            </div>
          )}
        </div>
      </div>
    </NeonBlobCursor>
  );
};

// ── Helper: Map provider name to icon ───────────────────────────────────────

const getProviderIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return IconBrandFacebook;
    case "whatsapp":
      return IconBrandWhatsapp;
    case "telegram":
      return IconBrandTelegram;
    case "instagram":
      return IconBrandInstagram;
    default:
      return IconPlug;
  }
};

const getProviderIconStyles = (name: string) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return { iconColor: "text-blue-600 dark:text-blue-400" };
    case "whatsapp":
      return { iconColor: "text-green-600 dark:text-green-400" };
    case "telegram":
      return { iconColor: "text-sky-500 dark:text-sky-400" };
    case "instagram":
      return { iconColor: "text-pink-600 dark:text-pink-400" };
    default:
      return { iconColor: "text-slate-600 dark:text-slate-400" };
  }
};
