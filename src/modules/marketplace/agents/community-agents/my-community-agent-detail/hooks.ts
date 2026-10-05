"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCommunityAgentSettings,
  useMyCommunityAgentDetail,
  useUnsubscribeFromAgent,
  useUpdateAgentSettings,
} from "./services";

import type { CommunityAgentSettings } from "./types";

// ==================== Agent Detail Data Hook ====================

export const useMyCommunityAgentDetailData = () => {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError, refetch } = useMyCommunityAgentDetail({
    agentId: id,
  });

  return {
    agentDetail: data ?? null,
    isLoading,
    isError,
    refetch,
    agentId: id as string | number,
  };
};

// ==================== Settings Hook ====================

interface UseAgentSettingsFormOptions {
  agentId: string | number;
}

export const useAgentSettingsForm = ({ agentId }: UseAgentSettingsFormOptions) => {
  const { data: settings, isLoading: isLoadingSettings } = useCommunityAgentSettings({ agentId });
  const updateMutation = useUpdateAgentSettings();

  const [formData, setFormData] = useState<CommunityAgentSettings>({
    notifications: {
      emailOnNewMessage: true,
      pushNotifications: true,
      dailyDigest: false,
    },
    privacy: {
      shareUsageData: false,
      allowAgentToLearn: true,
    },
    preferences: {
      language: "en",
      responseLength: "balanced",
      autoReply: false,
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateMutation.mutateAsync({ agentId, data: formData });
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const updateNotification = (
    key: keyof CommunityAgentSettings["notifications"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updatePrivacy = (key: keyof CommunityAgentSettings["privacy"], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const updatePreference = (
    key: keyof CommunityAgentSettings["preferences"],
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  return {
    formData,
    isLoadingSettings,
    isSaving: updateMutation.isPending,
    handleSaveSettings,
    updateNotification,
    updatePrivacy,
    updatePreference,
  };
};

// ==================== Unsubscribe Hook ====================

interface UseUnsubscribeOptions {
  agentId: string | number;
  agentName: string;
}

export const useUnsubscribe = ({ agentId, agentName }: UseUnsubscribeOptions) => {
  const router = useRouter();
  const unsubscribeMutation = useUnsubscribeFromAgent();

  const [showConfirm, setShowConfirm] = useState(false);

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleUnsubscribe = async () => {
    try {
      console.log("🔍 Debug - Agent ID being used for unsubscribe:", agentId);
      console.log("🔍 Debug - Agent name:", agentName);

      await unsubscribeMutation.mutateAsync({ agentId });
      toast.success(`Successfully unsubscribed from ${agentName}`);
      closeConfirm();
      router.push("/dashboard/my-agents");
    } catch (error) {
      console.error("❌ Unsubscribe error:", error);
      toast.error("Failed to unsubscribe. Please try again.");
    }
  };

  return {
    showConfirm,
    openConfirm,
    closeConfirm,
    handleUnsubscribe,
    isUnsubscribing: unsubscribeMutation.isPending,
  };
};
