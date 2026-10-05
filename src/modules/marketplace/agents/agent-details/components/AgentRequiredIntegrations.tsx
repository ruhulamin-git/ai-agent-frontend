"use client";

import {
  IconCheck,
  IconCircleCheck,
  IconLoader2,
  IconPlugConnected,
  IconPlus,
} from "@tabler/icons-react";
import { useQueries } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { ApiKeyConnectModal } from "@/modules/marketplace/connections/components/ApiKeyConnectModal";
import { useConnectFlow } from "@/modules/marketplace/connections/hooks";
import { getProviderDetails } from "@/modules/marketplace/connections/services";

import { getProviderIcon, getProviderStyles } from "./agentIntegrationUtils";

import type { RequiredIntegration } from "../../shared/types";
import type { IntegrationProviderDetails } from "@/modules/marketplace/connections/types";

// ── Props ───────────────────────────────────────────────────────────────────

interface AgentRequiredIntegrationsProps {
  integrations: RequiredIntegration[];
  agentId: number;
  selectedIntegrationIds: Record<number, number>;
  onIntegrationSelect: (providerId: number, userIntegrationId: number) => void;
  onAllConnected?: () => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export const AgentRequiredIntegrations = ({
  integrations,
  agentId,
  selectedIntegrationIds,
  onIntegrationSelect,
  onAllConnected,
}: AgentRequiredIntegrationsProps) => {
  const { t } = useTranslation();

  // ── Fetch provider details for ALL integrations on mount ────────────
  const providerQueries = useQueries({
    queries: integrations.map((integration) => ({
      queryKey: ["integration-provider-details", integration.providerId, agentId] as const,
      queryFn: () => getProviderDetails(integration.providerId, agentId),
    })),
  });

  // Build a map: providerId → IntegrationProviderDetails
  const detailsMap = integrations.reduce<Record<number, IntegrationProviderDetails | undefined>>(
    (acc, integration, index) => {
      acc[integration.providerId] = providerQueries[index]?.data;
      return acc;
    },
    {}
  );

  // ── Connect flow (only for creating NEW connections) ────────────────
  const {
    providerDetails: connectProviderDetails,
    isLoadingDetails: isLoadingConnect,
    isModalOpen: isApiKeyModalOpen,
    isConnecting,
    handleConnectClick,
    handleOAuthRedirect,
    handleCloseModal: handleCloseApiKeyModal,
    handleApiKeySubmit,
  } = useConnectFlow({ agentId });

  const allSelected = integrations.every((i) => selectedIntegrationIds[i.providerId] !== undefined);

  useEffect(() => {
    if (allSelected) onAllConnected?.();
  }, [allSelected, onAllConnected]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleSelectAccount = useCallback(
    (providerId: number, userIntegrationId: number) => {
      onIntegrationSelect(providerId, userIntegrationId);
    },
    [onIntegrationSelect]
  );

  const handleCreateNew = useCallback(
    (details: IntegrationProviderDetails) => {
      if (details.providerType === "api_key") {
        handleConnectClick({
          id: details.id,
          name: details.name,
          providerType: details.providerType,
          icon: details.icon,
          appIntegrationId: details.appIntegrationId,
          isConnected: details.isConnected,
          userIntegrations: details.userIntegrations,
        });
      } else {
        handleOAuthRedirect(details);
      }
    },
    [handleConnectClick, handleOAuthRedirect]
  );

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconPlugConnected size={18} className="text-primary" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("pages.agents.required_integrations", {
              defaultValue: "Required Integrations",
            })}
          </span>
        </div>
        {allSelected && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <IconCheck size={12} />
            {t("pages.agents.all_connected", { defaultValue: "All Connected" })}
          </span>
        )}
      </div>

      {/* Integration Cards */}
      <div className="space-y-3">
        {integrations.map((integration, index) => {
          const Icon = getProviderIcon(integration.providerName);
          const styles = getProviderStyles(integration.providerName);
          const selectedId = selectedIntegrationIds[integration.providerId];
          const hasSelection = selectedId !== undefined;
          const details = detailsMap[integration.providerId];
          const isLoading = providerQueries[index]?.isLoading;
          const userIntegrations = details?.userIntegrations ?? [];

          return (
            <div
              key={integration.id}
              className={cn(
                "relative rounded-2xl border transition-all overflow-hidden",
                hasSelection
                  ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5"
                  : `${styles.borderColor} bg-white dark:bg-primary/5`
              )}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      styles.bgColor,
                      styles.iconColor
                    )}
                  >
                    <Icon size={22} stroke={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                        {integration.providerName}
                      </h4>
                      {integration.isRequired && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          {t("pages.agents.required_label", {
                            defaultValue: "Required",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {hasSelection
                        ? `Account #${selectedId} selected`
                        : isLoading
                        ? t("common.loading", {
                            defaultValue: "Loading...",
                          })
                        : userIntegrations.length > 0
                        ? `${userIntegrations.length} account(s) available`
                        : t("pages.agents.no_connections_yet", {
                            defaultValue: "No connections yet",
                          })}
                    </p>
                  </div>
                </div>

                <div>
                  {isLoading ? (
                    <IconLoader2 size={18} className="animate-spin text-slate-400" />
                  ) : hasSelection ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      <IconCircleCheck size={14} />
                      {t("pages.agents.selected", {
                        defaultValue: "Selected",
                      })}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Connected accounts + Add New */}
              {!isLoading && (
                <div className="border-t border-slate-100 dark:border-slate-800 px-4 pb-4 pt-3 space-y-2.5">
                  {/* Add New Connection — at the top */}
                  {details && (
                    <button
                      type="button"
                      onClick={() => handleCreateNew(details)}
                      className="w-full flex items-center gap-2.5 p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                        <IconPlus size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {t("pages.agents.create_new_connection", {
                          defaultValue: "Add New Connection",
                        })}
                      </span>
                    </button>
                  )}

                  {/* Previously connected accounts */}
                  {userIntegrations.length > 0 && (
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-1">
                      {t("pages.agents.existing_accounts", {
                        defaultValue: "Connected Accounts",
                      })}
                    </p>
                  )}
                  {userIntegrations.map((ui) => {
                    const isSelected = selectedId === ui.id;

                    return (
                      <button
                        key={ui.id}
                        type="button"
                        onClick={() => handleSelectAccount(integration.providerId, ui.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              isSelected ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-800"
                            )}
                          >
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                isSelected ? "bg-primary" : "bg-slate-400"
                              )}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                              {integration.providerName} #{ui.id}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {ui.platformUserId
                                ? `ID: ${ui.platformUserId}`
                                : ui.createdAt
                                ? `Connected ${new Date(ui.createdAt).toLocaleDateString()}`
                                : `ID: ${ui.id}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(ui.isActive ?? true) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          )}
                          {isSelected && <IconCircleCheck size={16} className="text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* API Key Connect Modal — only for creating new connections */}
      <ApiKeyConnectModal
        open={isApiKeyModalOpen}
        onClose={handleCloseApiKeyModal}
        providerDetails={connectProviderDetails}
        isLoading={isLoadingConnect}
        isConnecting={isConnecting}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
};
