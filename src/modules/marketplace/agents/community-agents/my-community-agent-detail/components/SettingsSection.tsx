"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

import { useAgentSettingsForm } from "../hooks";

interface SettingsSectionProps {
  agentId: string | number;
}

export const SettingsSection = ({ agentId }: SettingsSectionProps) => {
  const { t } = useTranslation();
  const {
    formData,
    isLoadingSettings,
    isSaving,
    handleSaveSettings,
    updateNotification,
    updatePrivacy,
    updatePreference,
  } = useAgentSettingsForm({ agentId });

  if (isLoadingSettings) {
    const SKELETON_COUNT = 3;
    const skeletonIds = ["notifications", "privacy", "preferences"];

    return (
      <div className="space-y-6">
        {skeletonIds.slice(0, SKELETON_COUNT).map((id) => (
          <div
            key={`settings-skeleton-${id}`}
            className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Notifications */}
      <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">
          Notifications
        </h3>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Email Notifications</Label>
              <p className="text-xs text-slate-500">
                Receive email when the agent sends a new message
              </p>
            </div>
            <Switch
              checked={formData.notifications.emailOnNewMessage}
              onCheckedChange={(checked) => updateNotification("emailOnNewMessage", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Push Notifications</Label>
              <p className="text-xs text-slate-500">
                Browser push notifications for real-time updates
              </p>
            </div>
            <Switch
              checked={formData.notifications.pushNotifications}
              onCheckedChange={(checked) => updateNotification("pushNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Daily Digest</Label>
              <p className="text-xs text-slate-500">Receive a daily summary of agent activity</p>
            </div>
            <Switch
              checked={formData.notifications.dailyDigest}
              onCheckedChange={(checked) => updateNotification("dailyDigest", checked)}
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Privacy</h3>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Share Usage Data</Label>
              <p className="text-xs text-slate-500">
                Help improve the agent by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={formData.privacy.shareUsageData}
              onCheckedChange={(checked) => updatePrivacy("shareUsageData", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Allow Agent to Learn</Label>
              <p className="text-xs text-slate-500">
                Allow the agent to learn from your interactions
              </p>
            </div>
            <Switch
              checked={formData.privacy.allowAgentToLearn}
              onCheckedChange={(checked) => updatePrivacy("allowAgentToLearn", checked)}
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Preferences</h3>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-bold">Response Length</Label>
            <div className="flex gap-2">
              {(["concise", "balanced", "detailed"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updatePreference("responseLength", option)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    formData.preferences.responseLength === option
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Auto Reply</Label>
              <p className="text-xs text-slate-500">Automatically send replies without review</p>
            </div>
            <Switch
              checked={formData.preferences.autoReply}
              onCheckedChange={(checked) => updatePreference("autoReply", checked)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
        >
          {isSaving ? "Saving..." : t("common.save", "Save Settings")}
        </Button>
      </div>
    </div>
  );
};
