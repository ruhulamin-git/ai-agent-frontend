"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import type { TriggerType } from "../types";

interface AutoReplyConfigSectionProps {
  replyEndpoint: string;
  setReplyEndpoint: (value: string) => void;
  supportedPlatforms: string[];
  setSupportedPlatforms: (value: string[]) => void;
}

export const AutoReplyConfigSection = ({
  replyEndpoint,
  setReplyEndpoint,
  supportedPlatforms,
  setSupportedPlatforms,
}: AutoReplyConfigSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t("pages.external_agent_settings.general.auto_reply_config", "Auto-Reply Configuration")}
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t(
          "pages.external_agent_settings.general.auto_reply_config_description",
          "Configure auto-reply settings for messaging platforms"
        )}
      </p>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <Label htmlFor="reply-endpoint" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.reply_endpoint", "Reply Endpoint")}
          </Label>
          <Input
            id="reply-endpoint"
            value={replyEndpoint}
            onChange={(e) => setReplyEndpoint(e.target.value)}
            placeholder="/api/reply"
          />
        </div>

        <div>
          <Label className="mb-1.5 block">
            {t("pages.external_agent_settings.general.supported_platforms", "Supported Platforms")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {["telegram", "whatsapp", "messenger", "instagram"].map((platform) => (
              <label key={platform} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supportedPlatforms.includes(platform)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSupportedPlatforms([...supportedPlatforms, platform]);
                    } else {
                      setSupportedPlatforms(supportedPlatforms.filter((p) => p !== platform));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EventConfigSectionProps {
  eventEndpoint: string;
  setEventEndpoint: (value: string) => void;
  triggerType: TriggerType | "";
  setTriggerType: (value: TriggerType | "") => void;
  supportedEvents: string[];
  setSupportedEvents: (value: string[]) => void;
  scheduleConfig: string;
  setScheduleConfig: (value: string) => void;
}

export const EventConfigSection = ({
  eventEndpoint,
  setEventEndpoint,
  triggerType,
  setTriggerType,
  supportedEvents,
  setSupportedEvents,
  scheduleConfig,
  setScheduleConfig,
}: EventConfigSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t("pages.external_agent_settings.general.event_config", "Event Configuration")}
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t(
          "pages.external_agent_settings.general.event_config_description",
          "Configure event-driven settings"
        )}
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="event-endpoint" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.event_endpoint", "Event Endpoint")}
          </Label>
          <Input
            id="event-endpoint"
            value={eventEndpoint}
            onChange={(e) => setEventEndpoint(e.target.value)}
            placeholder="https://api.example.com/events"
          />
        </div>

        <div>
          <Label htmlFor="trigger-type" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.trigger_type", "Trigger Type")}
          </Label>
          <Select value={triggerType} onValueChange={(v) => setTriggerType(v as TriggerType)}>
            <SelectTrigger id="trigger-type">
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label className="mb-1.5 block">
            {t("pages.external_agent_settings.general.supported_events", "Supported Events")}
          </Label>
          <Input
            value={supportedEvents.join(", ")}
            onChange={(e) => {
              const events = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              setSupportedEvents(events);
            }}
            placeholder="event1, event2, event3"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t(
              "pages.external_agent_settings.general.supported_events_hint",
              "Comma-separated list of event names"
            )}
          </p>
        </div>

        {triggerType === "schedule" && (
          <div className="md:col-span-2">
            <Label htmlFor="schedule-config" className="mb-1.5 block">
              {t(
                "pages.external_agent_settings.general.schedule_config",
                "Schedule Configuration (JSON)"
              )}
            </Label>
            <Textarea
              id="schedule-config"
              value={scheduleConfig}
              onChange={(e) => setScheduleConfig(e.target.value)}
              placeholder='{"cron": "0 9 * * *", "timezone": "UTC", "description": "Daily at 9 AM"}'
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t(
                "pages.external_agent_settings.general.schedule_config_hint",
                "Define cron schedule, timezone, and description"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface AdvancedSettingsSectionProps {
  authEndpoint: string;
  setAuthEndpoint: (value: string) => void;
  healthEndpoint: string;
  setHealthEndpoint: (value: string) => void;
  tokenResponseKey: string;
  setTokenResponseKey: (value: string) => void;
  tokenQueryParamName: string;
  setTokenQueryParamName: (value: string) => void;
  webhookSecret: string;
  setWebhookSecret: (value: string) => void;
  credentialSchema: string;
  setCredentialSchema: (value: string) => void;
}

export const AdvancedSettingsSection = ({
  authEndpoint,
  setAuthEndpoint,
  healthEndpoint,
  setHealthEndpoint,
  tokenResponseKey,
  setTokenResponseKey,
  tokenQueryParamName,
  setTokenQueryParamName,
  webhookSecret,
  setWebhookSecret,
  credentialSchema,
  setCredentialSchema,
}: AdvancedSettingsSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t("pages.external_agent_settings.general.advanced_settings", "Advanced Settings")}
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t(
          "pages.external_agent_settings.general.advanced_settings_description",
          "Configure authentication, health checks, and other advanced options"
        )}
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="auth-endpoint" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.auth_endpoint", "Auth Endpoint")}
          </Label>
          <Input
            id="auth-endpoint"
            value={authEndpoint}
            onChange={(e) => setAuthEndpoint(e.target.value)}
            placeholder="/api/auth"
          />
        </div>

        <div>
          <Label htmlFor="health-endpoint" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.health_endpoint", "Health Endpoint")}
          </Label>
          <Input
            id="health-endpoint"
            value={healthEndpoint}
            onChange={(e) => setHealthEndpoint(e.target.value)}
            placeholder="/api/health"
          />
        </div>

        <div>
          <Label htmlFor="token-response-key" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.token_response_key", "Token Response Key")}
          </Label>
          <Input
            id="token-response-key"
            value={tokenResponseKey}
            onChange={(e) => setTokenResponseKey(e.target.value)}
            placeholder="access_token"
          />
        </div>

        <div>
          <Label htmlFor="token-query-param" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.token_query_param", "Token Query Param Name")}
          </Label>
          <Input
            id="token-query-param"
            value={tokenQueryParamName}
            onChange={(e) => setTokenQueryParamName(e.target.value)}
            placeholder="token"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="webhook-secret" className="mb-1.5 block">
            {t("pages.external_agent_settings.general.webhook_secret", "Webhook Secret")}
          </Label>
          <Input
            id="webhook-secret"
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder="Enter webhook secret"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="credential-schema" className="mb-1.5 block">
            {t(
              "pages.external_agent_settings.general.credential_schema",
              "Credential Schema (JSON)"
            )}
          </Label>
          <Textarea
            id="credential-schema"
            value={credentialSchema}
            onChange={(e) => setCredentialSchema(e.target.value)}
            placeholder='{"api_key": "string", "secret": "string"}'
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t(
              "pages.external_agent_settings.general.credential_schema_hint",
              "Define the schema for credentials required by this agent"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
