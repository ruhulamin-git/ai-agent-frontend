"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useUpdateWidgetConfig,
  useWidgetConfig,
} from "./services";

import type { WidgetConfig, WidgetConfigFormValues } from "./types";

// ==================== API Key Management Hook ====================

interface UseApiKeyManagementOptions {
  agentId: string;
}

export const useApiKeyManagement = ({ agentId }: UseApiKeyManagementOptions) => {
  const { data: apiKeysData, isLoading: isLoadingKeys } = useApiKeys({ agentId });
  const apiKeys = Array.isArray(apiKeysData) ? apiKeysData : [];
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [revokeTargetId, setRevokeTargetId] = useState<string | null>(null);
  const showRevokeConfirm = revokeTargetId !== null;

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        agentId,
        data: { name: newKeyName.trim() },
      });
      setNewlyCreatedKey(result.key);
      setNewKeyName("");
      setShowCreateForm(false);
      toast.success("API key created successfully");
    } catch {
      toast.error("Failed to create API key");
    }
  };

  const openRevokeConfirm = (apiKeyId: string) => {
    setRevokeTargetId(apiKeyId);
  };

  const closeRevokeConfirm = () => {
    setRevokeTargetId(null);
  };

  const confirmRevoke = async () => {
    if (!revokeTargetId) return;

    try {
      await revokeMutation.mutateAsync({ agentId, apiKeyId: revokeTargetId });
      toast.success("API key revoked successfully");
    } catch {
      toast.error("Failed to revoke API key");
    } finally {
      setRevokeTargetId(null);
    }
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy API key");
    }
  };

  return {
    apiKeys,
    isLoadingKeys,
    newKeyName,
    setNewKeyName,
    showCreateForm,
    setShowCreateForm,
    newlyCreatedKey,
    setNewlyCreatedKey,
    handleCreateKey,
    openRevokeConfirm,
    closeRevokeConfirm,
    confirmRevoke,
    showRevokeConfirm,
    handleCopyKey,
    isCreating: createMutation.isPending,
    isRevoking: revokeMutation.isPending,
  };
};

// ==================== Widget Config Hook ====================

const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  mode: "popup",
  theme: {
    primaryColor: "#0066cc",
    secondaryColor: "#ffffff",
    textColor: "#333333",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
  },
  display: {
    title: "Chat with AI Assistant",
    subtitle: "We are here to help",
    welcomeMessage: "Hello! How can I assist you today?",
    placeholder: "Type your message...",
    position: "bottom-right",
    showAvatar: true,
    showBranding: true,
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 3000,
    soundEnabled: true,
    typingIndicator: true,
  },
  isPublic: true,
  allowedDomains: [],
  rateLimitPerHour: 100,
  rateLimitPerMinute: 10,
};

interface UseWidgetConfigFormOptions {
  agentId: string;
}

export const useWidgetConfigForm = ({ agentId }: UseWidgetConfigFormOptions) => {
  const { data: widgetConfig, isLoading: isLoadingConfig } = useWidgetConfig({ agentId });
  const updateMutation = useUpdateWidgetConfig();

  const [formData, setFormData] = useState<WidgetConfigFormValues>({
    isPublic: DEFAULT_WIDGET_CONFIG.isPublic,
    mode: DEFAULT_WIDGET_CONFIG.mode,
    theme: { ...DEFAULT_WIDGET_CONFIG.theme },
    display: { ...DEFAULT_WIDGET_CONFIG.display },
    behavior: { ...DEFAULT_WIDGET_CONFIG.behavior },
    allowedDomains: [...DEFAULT_WIDGET_CONFIG.allowedDomains],
    rateLimitPerHour: DEFAULT_WIDGET_CONFIG.rateLimitPerHour,
    rateLimitPerMinute: DEFAULT_WIDGET_CONFIG.rateLimitPerMinute,
  });

  useEffect(() => {
    if (widgetConfig) {
      setFormData({
        isPublic: widgetConfig.isPublic,
        mode: widgetConfig.mode,
        theme: { ...widgetConfig.theme },
        display: { ...widgetConfig.display },
        behavior: { ...widgetConfig.behavior },
        allowedDomains: [...(widgetConfig.allowedDomains || [])],
        rateLimitPerHour: widgetConfig.rateLimitPerHour,
        rateLimitPerMinute: widgetConfig.rateLimitPerMinute,
      });
    }
  }, [widgetConfig]);

  const handleSaveConfig = async () => {
    try {
      const payload = {
        isPublic: formData.isPublic,
        mode: formData.mode,
        theme: formData.theme,
        display: formData.display,
        behavior: formData.behavior,
        allowedDomains: formData.allowedDomains.map((d) => d.trim()).filter(Boolean),
        rateLimitPerHour: formData.rateLimitPerHour,
        rateLimitPerMinute: formData.rateLimitPerMinute,
      };

      await updateMutation.mutateAsync({ agentId, data: payload });
      toast.success("Widget configuration saved successfully");
    } catch {
      toast.error("Failed to save widget configuration");
    }
  };

  const updateTheme = (key: keyof WidgetConfig["theme"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  };

  const updateDisplay = (key: keyof WidgetConfig["display"], value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      display: { ...prev.display, [key]: value },
    }));
  };

  const updateBehavior = (key: keyof WidgetConfig["behavior"], value: boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      behavior: { ...prev.behavior, [key]: value },
    }));
  };

  const addDomain = () => {
    setFormData((prev) => ({
      ...prev,
      allowedDomains: [...prev.allowedDomains, ""],
    }));
  };

  const removeDomain = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter((_, i) => i !== index),
    }));
  };

  const updateDomain = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedDomains: prev.allowedDomains.map((d, i) => (i === index ? value : d)),
    }));
  };

  return {
    formData,
    setFormData,
    isLoadingConfig,
    isSaving: updateMutation.isPending,
    handleSaveConfig,
    updateTheme,
    updateDisplay,
    updateBehavior,
    addDomain,
    removeDomain,
    updateDomain,
  };
};
