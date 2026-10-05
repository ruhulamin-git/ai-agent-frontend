import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCreatePricingPlan } from "@/modules/studio/manage-agents/services/createPricingPlan";
import { useDeletePricingPlan } from "@/modules/studio/manage-agents/services/deletePricingPlan";
import { useGetPricingPlans } from "@/modules/studio/manage-agents/services/getPricingPlans";
import { usePublishAgent } from "@/modules/studio/manage-agents/services/publishAgent";
import { useUnpublishAgent } from "@/modules/studio/manage-agents/services/unpublishAgent";
import { useUpdatePricingPlan } from "@/modules/studio/manage-agents/services/updatePricingPlan";

import {
  updateExternalAgentWithFiles,
  useDeleteExternalAgent,
  useExternalAgentDetails,
  useUpdateExternalAgent,
  useVerifyExternalAgent,
} from "../services";

import type {
  CreatePricingPlanDTO,
  ExternalAgentGeneralFormValues,
  UpdatePricingPlanDTO,
} from "./types";

interface UseExternalAgentSettingsProps {
  agentId: string;
}

export const useExternalAgentSettings = ({ agentId }: UseExternalAgentSettingsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const {
    data: agent,
    isLoading,
    error,
  } = useExternalAgentDetails({
    id: parseInt(agentId, 10),
  });

  const { data: pricingPlans = [], isLoading: isLoadingPlans } = useGetPricingPlans({
    agentId: agent?.agent?.id?.toString() || "",
    enabled: !!agent?.agent?.id,
  });

  const updateMutation = useUpdateExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent updated successfully");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        queryClient.invalidateQueries({ queryKey: ["external-agents", parseInt(agentId, 10)] });
      },
      onError: (error: Error) => {
        toast.error(`Failed to update: ${error.message}`);
      },
    },
  });

  const deleteMutation = useDeleteExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        router.push("/dashboard/ai-studio?tab=external");
      },
      onError: (error: Error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    },
  });

  const verifyMutation = useVerifyExternalAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent verified successfully");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        queryClient.invalidateQueries({ queryKey: ["external-agents", parseInt(agentId, 10)] });
      },
      onError: (error: Error) => {
        toast.error(`Verification failed: ${error.message}`);
      },
    },
  });

  const publishMutation = usePublishAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent published successfully");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        queryClient.invalidateQueries({
          queryKey: ["external-agent-detail", parseInt(agentId, 10)],
        });
      },
      onError: (error: Error) => {
        toast.error(`Failed to publish: ${error.message}`);
      },
    },
  });

  const unpublishMutation = useUnpublishAgent({
    config: {
      onSuccess: () => {
        toast.success("External agent unpublished successfully");
        queryClient.invalidateQueries({ queryKey: ["external-agents"] });
        queryClient.invalidateQueries({
          queryKey: ["external-agent-detail", parseInt(agentId, 10)],
        });
      },
      onError: (error: Error) => {
        toast.error(`Failed to unpublish: ${error.message}`);
      },
    },
  });

  const createPlanMutation = useCreatePricingPlan({
    config: {
      onSuccess: () => {
        toast.success("Pricing plan created successfully");
        queryClient.invalidateQueries({ queryKey: ["agent-plans", agent?.agent?.id?.toString()] });
      },
      onError: (error: Error) => {
        toast.error(`Failed to create plan: ${error.message}`);
      },
    },
  });

  const updatePlanMutation = useUpdatePricingPlan({
    config: {
      onSuccess: () => {
        toast.success("Pricing plan updated successfully");
        queryClient.invalidateQueries({ queryKey: ["agent-plans", agent?.agent?.id?.toString()] });
      },
      onError: (error: Error) => {
        toast.error(`Failed to update plan: ${error.message}`);
      },
    },
  });

  const deletePlanMutation = useDeletePricingPlan({
    config: {
      onSuccess: () => {
        toast.success("Pricing plan deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["agent-plans", agent?.agent?.id?.toString()] });
      },
      onError: (error: Error) => {
        toast.error(`Failed to delete plan: ${error.message}`);
      },
    },
  });

  const handleUpdate = async (data: ExternalAgentGeneralFormValues) => {
    // Always use FormData for consistency with server expectations
    const formData = new FormData();

    // Add text fields
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.shortDescription) formData.append("short_description", data.shortDescription);
    if (data.longDescription) formData.append("long_description", data.longDescription);
    if (data.welcomeMessage) formData.append("welcome_message", data.welcomeMessage);
    if (data.tags) formData.append("tags", JSON.stringify(data.tags));
    if (data.demoUrl) formData.append("demo_url", data.demoUrl);
    if (data.category) formData.append("category", data.category.toString());

    // External agent configuration
    formData.append("site_url", data.siteUrl);
    formData.append("auth_method", data.authMethod);
    formData.append("execution_mode", data.executionMode);
    formData.append("interaction_mode", data.interactionMode);
    if (data.authEndpoint) formData.append("auth_endpoint", data.authEndpoint);
    if (data.healthEndpoint) formData.append("health_endpoint", data.healthEndpoint);
    if (data.documentationUrl) formData.append("documentation_url", data.documentationUrl);
    if (data.rateLimitPerMinute)
      formData.append("rate_limit_per_minute", data.rateLimitPerMinute.toString());
    if (data.timeoutSeconds) formData.append("timeout_seconds", data.timeoutSeconds.toString());
    if (data.webhookSecret) formData.append("webhook_secret", data.webhookSecret);
    if (data.credentialSchema)
      formData.append("credential_schema", JSON.stringify(data.credentialSchema));
    if (data.tokenResponseKey) formData.append("token_response_key", data.tokenResponseKey);
    if (data.tokenQueryParamName)
      formData.append("token_query_param_name", data.tokenQueryParamName);

    // Mode-specific fields
    if (data.chatFrontendUrl) formData.append("chat_frontend_url", data.chatFrontendUrl);
    if (data.chatApiEndpoint) formData.append("chat_api_endpoint", data.chatApiEndpoint);
    if (data.supportsStreaming !== undefined)
      formData.append("supports_streaming", data.supportsStreaming.toString());
    if (data.chatApiRequestFormat)
      formData.append("chat_api_request_format", JSON.stringify(data.chatApiRequestFormat));
    if (data.chatApiResponseFormat)
      formData.append("chat_api_response_format", JSON.stringify(data.chatApiResponseFormat));
    if (data.executeEndpoint) formData.append("execute_endpoint", data.executeEndpoint);
    if (data.outputFormat) formData.append("output_format", data.outputFormat);
    if (data.isAsyncExecution !== undefined)
      formData.append("is_async_execution", data.isAsyncExecution.toString());
    if (data.callbackUrl) formData.append("callback_url", data.callbackUrl);
    if (data.inputSchema) formData.append("input_schema", JSON.stringify(data.inputSchema));
    if (data.replyEndpoint) formData.append("reply_endpoint", data.replyEndpoint);
    if (data.supportedPlatforms)
      formData.append("supported_platforms", JSON.stringify(data.supportedPlatforms));
    if (data.eventEndpoint) formData.append("event_endpoint", data.eventEndpoint);
    if (data.triggerType) formData.append("trigger_type", data.triggerType);
    if (data.supportedEvents)
      formData.append("supported_events", JSON.stringify(data.supportedEvents));
    if (data.scheduleConfig)
      formData.append("schedule_config", JSON.stringify(data.scheduleConfig));

    // Add files if present
    if (data.iconFile) {
      formData.append("icon", data.iconFile);
    }
    if (data.coverFile) {
      formData.append("cover_image", data.coverFile);
    }

    // Add removal flags
    if (data.iconRemoved) formData.append("icon_removed", "true");
    if (data.coverRemoved) formData.append("cover_removed", "true");

    // Use the updateExternalAgentWithFiles function for all updates
    try {
      await updateExternalAgentWithFiles(parseInt(agentId, 10), formData);
      toast.success("External agent updated successfully");
      queryClient.invalidateQueries({ queryKey: ["external-agents"] });
      queryClient.invalidateQueries({ queryKey: ["external-agents", parseInt(agentId, 10)] });
      // Clear the file states after successful upload
      setIconFile(null);
      setCoverFile(null);
    } catch (error: any) {
      toast.error(`Failed to update: ${error.message}`);
      throw error;
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(parseInt(agentId, 10));
  };

  const handleVerify = async () => {
    await verifyMutation.mutateAsync(parseInt(agentId, 10));
  };

  const handlePublish = async () => {
    if (!agent?.agent?.id) return;
    await publishMutation.mutateAsync(agent.agent.id.toString());
  };

  const handleUnpublish = async () => {
    if (!agent?.agent?.id) return;
    await unpublishMutation.mutateAsync(agent.agent.id.toString());
  };

  const handleCreatePlan = (payload: CreatePricingPlanDTO, onSuccess?: () => void) => {
    if (!agent?.agent?.id) return;
    createPlanMutation.mutate({ agentId: agent.agent.id.toString(), payload }, { onSuccess });
  };

  const handleUpdatePlan = (
    planId: number,
    payload: UpdatePricingPlanDTO,
    onSuccess?: () => void
  ) => {
    if (!agent?.agent?.id) return;
    updatePlanMutation.mutate(
      { agentId: agent.agent.id.toString(), planId, payload },
      { onSuccess }
    );
  };

  const handleDeletePlan = (planId: number) => {
    if (!agent?.agent?.id) return;
    deletePlanMutation.mutate({ agentId: agent.agent.id.toString(), planId });
  };

  return {
    agent,
    isLoading,
    error,
    isPending: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isPublishing: publishMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
    handlePublish,
    handleUnpublish,
    pricingPlans,
    isLoadingPlans,
    isCreatingPlan: createPlanMutation.isPending,
    isUpdatingPlan: updatePlanMutation.isPending,
    isDeletingPlan: deletePlanMutation.isPending,
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    iconFile,
    setIconFile,
    coverFile,
    setCoverFile,
    handleUpdate,
    handleDelete,
    handleVerify,
  };
};
