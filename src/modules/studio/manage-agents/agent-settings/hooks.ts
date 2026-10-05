import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { queryClient } from "@/utils";

import { useCreatePricingPlan } from "../services/createPricingPlan";
import { useDeleteAgent } from "../services/deleteAgent";
import { useDeletePricingPlan } from "../services/deletePricingPlan";
import { useAgentDashboardSummary } from "../services/getAgentDashboardSummary";
import { useUserAgentDetail } from "../services/getAgentDetail";
import { useGetPricingPlans } from "../services/getPricingPlans";
import { usePublishAgent } from "../services/publishAgent";
import { useUnpublishAgent } from "../services/unpublishAgent";
import { useUpdateAgent } from "../services/updateAgent";
import { useUpdatePricingPlan } from "../services/updatePricingPlan";

import type { UpdateUserAgentDTO } from "../types";
import type { CreatePricingPlanDTO, UpdatePricingPlanDTO } from "./types";

interface UseAgentSettingsOptions {
  agentId: string;
}

const useAgentSettings = ({ agentId }: UseAgentSettingsOptions) => {
  const router = useRouter();
  const { data: agent, isLoading } = useUserAgentDetail({ agentId });
  const { data: dashboardSummary, isLoading: isLoadingSummary } = useAgentDashboardSummary(agentId);
  const { mutate: updateAgent, isPending: isUpdating } = useUpdateAgent();
  const { mutate: deleteAgent, isPending: isDeleting } = useDeleteAgent();

  // ── Pricing Plans ──
  const { data: pricingPlans, isLoading: isLoadingPlans } = useGetPricingPlans({ agentId });
  const { mutate: createPlan, isPending: isCreatingPlan } = useCreatePricingPlan();
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdatePricingPlan();
  const { mutate: deletePlan, isPending: isDeletingPlan } = useDeletePricingPlan();

  // ── Publish / Unpublish ──
  const { mutate: publishAgent, isPending: isPublishing } = usePublishAgent();
  const { mutate: unpublishAgent, isPending: isUnpublishing } = useUnpublishAgent();

  const [iconFile, setIconFile] = useFileState(null);
  const [coverFile, setCoverFile] = useFileState(null);

  const handleUpdate = useCallback(
    ({
      iconRemoved,
      coverRemoved,
      ...payload
    }: UpdateUserAgentDTO & { iconRemoved?: boolean; coverRemoved?: boolean }) => {
      const data: UpdateUserAgentDTO = { ...payload };

      if (iconFile) {
        data.icon = iconFile;
      } else if (iconRemoved) {
        data.icon = null;
      }

      if (coverFile) {
        data.coverImage = coverFile;
      } else if (coverRemoved) {
        data.coverImage = null;
      }

      updateAgent(
        { agentId, payload: data },
        {
          onSuccess: () => {
            toast.success("Agent settings updated successfully");
            setIconFile(null);
            setCoverFile(null);
          },
        }
      );
    },
    [agentId, iconFile, coverFile, updateAgent, setIconFile, setCoverFile]
  );

  const handleDelete = useCallback(() => {
    deleteAgent(agentId, {
      onSuccess: () => {
        toast.success("Agent deleted successfully");
        router.push("/dashboard/ai-studio");
      },
    });
  }, [agentId, deleteAgent, router]);

  // ── Pricing Plan Handlers ──

  const handleCreatePlan = useCallback(
    (payload: CreatePricingPlanDTO, onSuccess?: () => void) => {
      createPlan(
        { agentId, payload },
        {
          onSuccess: () => {
            toast.success("Pricing plan created successfully");
            onSuccess?.();
          },
        }
      );
    },
    [agentId, createPlan]
  );

  const handleUpdatePlan = useCallback(
    (planId: number, payload: UpdatePricingPlanDTO, onSuccess?: () => void) => {
      updatePlan(
        { agentId, planId, payload },
        {
          onSuccess: () => {
            toast.success("Pricing plan updated successfully");
            onSuccess?.();
          },
        }
      );
    },
    [agentId, updatePlan]
  );

  const handleDeletePlan = useCallback(
    (planId: number) => {
      deletePlan(
        { agentId, planId },
        {
          onSuccess: () => {
            toast.success("Pricing plan deleted successfully");
          },
        }
      );
    },
    [agentId, deletePlan]
  );

  // ── Publish / Unpublish Handlers ──

  const handlePublish = useCallback(() => {
    publishAgent(agentId, {
      onSuccess: () => {
        toast.success("Agent published successfully");
        queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      },
    });
  }, [agentId, publishAgent]);

  const handleUnpublish = useCallback(() => {
    unpublishAgent(agentId, {
      onSuccess: () => {
        toast.success("Agent unpublished successfully");
        queryClient.invalidateQueries({ queryKey: ["user-agent-detail", agentId] });
      },
    });
  }, [agentId, unpublishAgent]);

  return {
    agent,
    isLoading,
    isPending: isUpdating,
    isDeleting,
    // Dashboard summary
    dashboardSummary,
    isLoadingSummary,
    // Pricing plans
    pricingPlans: pricingPlans ?? [],
    isLoadingPlans,
    isCreatingPlan,
    isUpdatingPlan,
    isDeletingPlan,
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    // Publish / Unpublish
    isPublishing,
    isUnpublishing,
    handlePublish,
    handleUnpublish,
    // Files
    iconFile,
    setIconFile,
    coverFile,
    setCoverFile,
    // Actions
    handleUpdate,
    handleDelete,
  };
};

export { useAgentSettings };

// ── Small helper to avoid importing useState at module level ──

function useFileState(initial: File | null) {
  return useState<File | null>(initial);
}
