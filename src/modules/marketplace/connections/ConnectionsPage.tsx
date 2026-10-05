"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/shared/ui/skeleton";

import { ApiKeyConnectModal } from "./components/ApiKeyConnectModal";
import { ProviderRow } from "./components/ProviderRow";
import { useConnectFlow, useConnectionsData, useDeleteIntegration } from "./hooks";

export const ConnectionsPage = () => {
  const { t } = useTranslation();
  const { providers, isLoading } = useConnectionsData();
  const { handleDelete, isDeleting } = useDeleteIntegration();
  const {
    providerDetails,
    isLoadingDetails,
    isModalOpen,
    isConnecting,
    handleConnectClick,
    handleOAuthRedirect,
    handleCloseModal,
    handleApiKeySubmit,
  } = useConnectFlow();

  // Handle OAuth redirect when provider details are loaded for oauth2 type
  useEffect(() => {
    if (
      providerDetails?.providerType === "oauth2" &&
      providerDetails.authConfig.type === "oauth" &&
      !isModalOpen
    ) {
      handleOAuthRedirect(providerDetails);
    }
  }, [providerDetails, isModalOpen, handleOAuthRedirect]);

  if (isLoading) {
    return <ConnectionsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-600 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("pages.connections.page_title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t("pages.connections.page_description")}
          </p>
        </div>
      </div>

      {/* Provider Rows */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <ProviderRow
            key={provider.id}
            provider={provider}
            onConnect={handleConnectClick}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {/* API Key Connect Modal */}
      <ApiKeyConnectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        providerDetails={providerDetails}
        isLoading={isLoadingDetails}
        isConnecting={isConnecting}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
};

const ConnectionsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => `skeleton-item-${i}`).map((id) => (
          <div
            key={id}
            className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-primary/5 overflow-hidden shadow-sm"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="w-32 h-6" />
                  <Skeleton className="w-48 h-4" />
                </div>
              </div>
              <Skeleton className="w-36 h-9 rounded-lg" />
            </div>
            <div className="p-6">
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
