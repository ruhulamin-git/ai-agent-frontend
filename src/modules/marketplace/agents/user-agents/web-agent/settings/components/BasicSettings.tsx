"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CustomTextArea, CustomTextField } from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

import { useUpdateUserAgent, useUserAgentDetails } from "../services";

import type { UpdateUserAgentPayload } from "../../../user-agents-list/types";

interface BasicSettingsProps {
  agentId: string;
}

export const BasicSettings = ({ agentId }: BasicSettingsProps) => {
  const { data: userAgent } = useUserAgentDetails({ agentId });
  const updateMutation = useUpdateUserAgent();

  const [formData, setFormData] = useState<UpdateUserAgentPayload>({
    name: "",
    businessContext: "",
    instructions: "",
  });

  useEffect(() => {
    if (userAgent) {
      setFormData({
        name: userAgent.name || "",
        businessContext: userAgent.businessContext || "",
        instructions: userAgent.instructions || "",
      });
    }
  }, [userAgent]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: agentId, payload: formData });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleToggleActive = async () => {
    if (!userAgent) return;
    try {
      await updateMutation.mutateAsync({
        id: agentId,
        payload: { isActive: !userAgent.isActive },
      });
      toast.success(userAgent.isActive ? "Deactivated" : "Activated");
    } catch {
      toast.error("Failed");
    }
  };

  if (!userAgent) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Status Section */}
        <div className="flex items-center justify-between py-4 px-5 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Configuration Section */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-5 max-w-2xl">
            <div>
              <Skeleton className="h-4 w-12 mb-1.5" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-1.5" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 mt-5 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status */}
      <section className="flex items-center justify-between py-4 px-5 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-background border border-border">
            <span className="material-symbols-outlined text-lg text-muted-foreground">
              power_settings_new
            </span>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Agent Status</p>
            <p className="text-xs text-muted-foreground mt-1">
              {userAgent.isActive ? "Active — responding to messages" : "Paused — not responding"}
            </p>
          </div>
        </div>
        <Switch
          checked={userAgent.isActive}
          onCheckedChange={handleToggleActive}
          disabled={updateMutation.isPending}
        />
      </section>

      {/* Configuration */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-base text-muted-foreground">
            edit_note
          </span>
          <h3 className="text-sm font-medium text-foreground">Configuration</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 max-w-2xl">
          <div>
            <Label
              htmlFor="name"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Name
            </Label>
            <CustomTextField
              id="name"
              value={formData.name ?? ""}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div>
            <Label
              htmlFor="businessContext"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Business Context
            </Label>
            <CustomTextArea
              id="businessContext"
              value={formData.businessContext ?? ""}
              onChange={(e) => setFormData((p) => ({ ...p, businessContext: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <Label
              htmlFor="instructions"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Instructions
            </Label>
            <CustomTextArea
              id="instructions"
              value={formData.instructions ?? ""}
              onChange={(e) => setFormData((p) => ({ ...p, instructions: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="mt-5">
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </section>
    </div>
  );
};
