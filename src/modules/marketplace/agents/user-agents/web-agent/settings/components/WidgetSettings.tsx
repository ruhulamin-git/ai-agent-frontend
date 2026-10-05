"use client";

import { useApiKeys } from "../services";

import { ApiKeyManagement } from "./ApiKeyManagement";
import { EmbedCodeSection } from "./EmbedCodeSection";
import { WidgetConfigForm } from "./WidgetConfigForm";

interface WidgetSettingsProps {
  agentId: string;
}

export const WidgetSettings = ({ agentId }: WidgetSettingsProps) => {
  const { data: apiKeysData } = useApiKeys({ agentId });
  const apiKeys = Array.isArray(apiKeysData) ? apiKeysData : [];

  return (
    <div className="space-y-8">
      <ApiKeyManagement agentId={agentId} />

      <div className="border-t border-border" />

      <EmbedCodeSection agentId={agentId} apiKeys={apiKeys} />

      <div className="border-t border-border" />

      <WidgetConfigForm agentId={agentId} />
    </div>
  );
};
