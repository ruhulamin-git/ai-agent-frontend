import { useCallback, useState } from "react";
import { toast } from "sonner";

import { queryClient } from "@/utils";

import {
  useConnectIntegration,
  useDeleteUserIntegration,
  useProviderDetails,
  useProviderList,
} from "./services";

import type {
  IntegrationProvider,
  IntegrationProviderDetails,
  OAuthPendingIntegration,
} from "./types";

const OAUTH_PENDING_KEY = "integration_oauth_pending";

// ── Main Hook: Provider List ────────────────────────────────────────────

const useConnectionsData = () => {
  const { data: providers = [], isLoading, error } = useProviderList();

  return { providers, isLoading, error };
};

// ── Hook: Connect Flow ──────────────────────────────────────────────────────

interface UseConnectFlowOptions {
  agentId?: number;
}

const useConnectFlow = (options?: UseConnectFlowOptions) => {
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: providerDetails, isLoading: isLoadingDetails } = useProviderDetails({
    providerId: selectedProviderId ?? 0,
    agentId: options?.agentId,
    enabled: selectedProviderId !== null,
  });

  const { mutate: connectIntegration, isPending: isConnecting } = useConnectIntegration({
    config: {
      onSuccess: () => {
        toast.success("Integration connected successfully!");
        queryClient.invalidateQueries({ queryKey: ["integration-providers"] });
        queryClient.invalidateQueries({ queryKey: ["integration-provider-details"] });
        queryClient.invalidateQueries({ queryKey: ["agent-details"] });
        handleCloseModal();
      },
    },
  });

  // Only trigger the provider details fetch without opening any modal
  const fetchProviderDetails = useCallback((providerId: number) => {
    setSelectedProviderId(providerId);
  }, []);

  const handleConnectClick = useCallback((provider: IntegrationProvider) => {
    setSelectedProviderId(provider.id);

    if (provider.providerType === "api_key") {
      // Open modal — the provider details will be fetched by the query
      setIsModalOpen(true);
    } else {
      // OAuth: we need to fetch details first to get the authorization URL
      // The effect below will handle the redirect once details are loaded
      setIsModalOpen(false);
    }
  }, []);

  // Handle OAuth redirect once details are available
  const handleOAuthRedirect = useCallback((details: IntegrationProviderDetails) => {
    if (details.authConfig.type !== "oauth") return;

    // Persist app_integration_id so callback can use it
    const pending: OAuthPendingIntegration = {
      appIntegrationId: details.appIntegrationId,
      providerName: details.name,
    };
    sessionStorage.setItem(OAUTH_PENDING_KEY, JSON.stringify(pending));

    // Redirect to the provider's authorization URL
    window.location.href = details.authConfig.authorizationUrl;
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProviderId(null);
  }, []);

  const handleApiKeySubmit = useCallback(
    (credentials: Record<string, string>, appIntegrationId: number) => {
      connectIntegration({
        type: "api_key",
        appIntegrationId,
        credentials,
      });
    },
    [connectIntegration]
  );

  return {
    selectedProviderId,
    providerDetails,
    isLoadingDetails,
    isModalOpen,
    isConnecting,
    fetchProviderDetails,
    handleConnectClick,
    handleOAuthRedirect,
    handleCloseModal,
    handleApiKeySubmit,
  };
};

// ── Hook: Delete Integration ────────────────────────────────────────────────

const useDeleteIntegration = () => {
  const { mutate: deleteIntegration, isPending: isDeleting } = useDeleteUserIntegration({
    config: {
      onSuccess: () => {
        toast.success("Integration disconnected successfully!");
        queryClient.invalidateQueries({ queryKey: ["integration-providers"] });
      },
      onError: () => {
        toast.error("Failed to disconnect integration. Please try again.");
      },
    },
  });

  const handleDelete = useCallback(
    (integrationId: number) => {
      deleteIntegration(integrationId);
    },
    [deleteIntegration]
  );

  return { handleDelete, isDeleting };
};

// ── Hook: OAuth Callback ────────────────────────────────────────────────────

const useOAuthCallback = () => {
  const { mutate: connectIntegration, isPending: isConnecting } = useConnectIntegration();

  const processOAuthCallback = useCallback(
    (code: string) => {
      const pendingRaw = sessionStorage.getItem(OAUTH_PENDING_KEY);
      if (!pendingRaw) {
        toast.error("OAuth session expired. Please try connecting again.");
        return false;
      }

      const pending: OAuthPendingIntegration = JSON.parse(pendingRaw);
      sessionStorage.removeItem(OAUTH_PENDING_KEY);

      connectIntegration(
        {
          type: "oauth",
          appIntegrationId: pending.appIntegrationId,
          code,
        },
        {
          onSuccess: () => {
            toast.success(`${pending.providerName} connected successfully!`);
            queryClient.invalidateQueries({ queryKey: ["integration-providers"] });
          },
          onError: () => {
            toast.error(`Failed to connect ${pending.providerName}. Please try again.`);
          },
        }
      );
      return true;
    },
    [connectIntegration]
  );

  return { processOAuthCallback, isConnecting };
};

export { useConnectFlow, useConnectionsData, useDeleteIntegration, useOAuthCallback };
