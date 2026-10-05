"use client";

import { useTranslation } from "react-i18next";

import {
  CustomColorInput,
  CustomSelect,
  CustomTextArea,
  CustomTextField,
} from "@/shared/form-elements";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { SelectItem } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

import { useWidgetConfigForm } from "../hooks";

import { AllowedDomainsSection } from "./AllowedDomainsSection";
import { BehaviorSection } from "./BehaviorSection";

const POSITION_OPTIONS = [
  {
    value: "bottom-right",
    label: "pages.my_agents.agent_settings.widget_config.position.bottom_right",
  },
  {
    value: "bottom-left",
    label: "pages.my_agents.agent_settings.widget_config.position.bottom_left",
  },
  { value: "top-right", label: "pages.my_agents.agent_settings.widget_config.position.top_right" },
  { value: "top-left", label: "pages.my_agents.agent_settings.widget_config.position.top_left" },
] as const;

const FONT_FAMILY_OPTIONS = [
  { value: "Inter, sans-serif", label: "pages.my_agents.agent_settings.widget_config.fonts.inter" },
  {
    value: "Roboto, sans-serif",
    label: "pages.my_agents.agent_settings.widget_config.fonts.roboto",
  },
  {
    value: "system-ui, sans-serif",
    label: "pages.my_agents.agent_settings.widget_config.fonts.system",
  },
  {
    value: "'Segoe UI', sans-serif",
    label: "pages.my_agents.agent_settings.widget_config.fonts.segoe",
  },
  { value: "Arial, sans-serif", label: "pages.my_agents.agent_settings.widget_config.fonts.arial" },
] as const;

interface WidgetConfigFormProps {
  agentId: string;
}

export const WidgetConfigForm = ({ agentId }: WidgetConfigFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    setFormData,
    isLoadingConfig,
    isSaving,
    handleSaveConfig,
    updateTheme,
    updateDisplay,
    updateBehavior,
    addDomain,
    removeDomain,
    updateDomain,
  } = useWidgetConfigForm({ agentId });

  if (isLoadingConfig) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Widget Status */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-11 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>

        {/* Theme Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="h-4 w-48 mb-5" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-28 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Display Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-56 mb-5" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={i >= 3 ? "md:col-span-2" : ""}>
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <div className="flex items-center gap-3 self-end pb-0.5">
              <Skeleton className="h-6 w-11 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border pt-6">
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Widget Enable/Disable */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-muted-foreground">
            toggle_on
          </span>
          <h3 className="text-sm font-medium text-foreground">
            {t("pages.my_agents.agent_settings.widget_config.status_title")}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {t("pages.my_agents.agent_settings.widget_config.status_description")}
        </p>
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
          />
          <span className="text-sm text-muted-foreground">
            {formData.isPublic
              ? t("pages.my_agents.agent_settings.widget_config.public")
              : t("pages.my_agents.agent_settings.widget_config.private")}
          </span>
        </div>
      </section>

      {/* Theme Section */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-muted-foreground">palette</span>
          <h3 className="text-sm font-medium text-foreground">
            {t("pages.my_agents.agent_settings.widget_config.theme_title")}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          {t("pages.my_agents.agent_settings.widget_config.theme_description")}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
          <div>
            <Label
              htmlFor="primaryColor"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.primary_color")}
            </Label>
            <CustomColorInput
              id="primaryColor"
              value={formData.theme.primaryColor || "#0066cc"}
              onChange={(value) => updateTheme("primaryColor", value)}
            />
          </div>

          <div>
            <Label
              htmlFor="secondaryColor"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.secondary_color")}
            </Label>
            <CustomColorInput
              id="secondaryColor"
              value={formData.theme.secondaryColor || "#ffffff"}
              onChange={(value) => updateTheme("secondaryColor", value)}
            />
          </div>

          <div>
            <Label
              htmlFor="textColor"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.text_color")}
            </Label>
            <CustomColorInput
              id="textColor"
              value={formData.theme.textColor || "#333333"}
              onChange={(value) => updateTheme("textColor", value)}
            />
          </div>

          <div>
            <Label
              htmlFor="fontFamily"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.font_family")}
            </Label>
            <CustomSelect
              id="fontFamily"
              value={formData.theme.fontFamily}
              onValueChange={(value) => updateTheme("fontFamily", value)}
            >
              {FONT_FAMILY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </CustomSelect>
          </div>

          <div>
            <Label
              htmlFor="borderRadius"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.border_radius")}
            </Label>
            <CustomTextField
              id="borderRadius"
              value={formData.theme.borderRadius}
              onChange={(e) => updateTheme("borderRadius", e.target.value)}
              placeholder={t(
                "pages.my_agents.agent_settings.widget_config.border_radius_placeholder"
              )}
            />
          </div>
        </div>
      </section>

      {/* Display Section */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-muted-foreground">
            chat_bubble
          </span>
          <h3 className="text-sm font-medium text-foreground">
            {t("pages.my_agents.agent_settings.widget_config.display_title")}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          {t("pages.my_agents.agent_settings.widget_config.display_description")}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-2xl">
          <div className="md:col-span-2">
            <Label
              htmlFor="widgetTitle"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.title")}
            </Label>
            <CustomTextField
              id="widgetTitle"
              value={formData.display.title}
              onChange={(e) => updateDisplay("title", e.target.value)}
              placeholder={t("pages.my_agents.agent_settings.widget_config.title_placeholder")}
            />
          </div>

          <div className="md:col-span-2">
            <Label
              htmlFor="subtitle"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.subtitle")}
            </Label>
            <CustomTextField
              id="subtitle"
              value={formData.display.subtitle}
              onChange={(e) => updateDisplay("subtitle", e.target.value)}
              placeholder={t("pages.my_agents.agent_settings.widget_config.subtitle_placeholder")}
            />
          </div>

          <div className="md:col-span-2">
            <Label
              htmlFor="welcomeMessage"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.welcome_message")}
            </Label>
            <CustomTextArea
              id="welcomeMessage"
              value={formData.display.welcomeMessage}
              onChange={(e) => updateDisplay("welcomeMessage", e.target.value)}
              rows={2}
              className="resize-none"
              placeholder={t(
                "pages.my_agents.agent_settings.widget_config.welcome_message_placeholder"
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Label
              htmlFor="placeholder"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.input_placeholder")}
            </Label>
            <CustomTextField
              id="placeholder"
              value={formData.display.placeholder}
              onChange={(e) => updateDisplay("placeholder", e.target.value)}
              placeholder={t("pages.my_agents.agent_settings.widget_config.input_placeholder_text")}
            />
          </div>

          <div>
            <Label
              htmlFor="position"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              {t("pages.my_agents.agent_settings.widget_config.widget_position")}
            </Label>
            <CustomSelect
              id="position"
              value={formData.display.position}
              onValueChange={(value) =>
                updateDisplay(
                  "position",
                  value as "bottom-right" | "bottom-left" | "top-right" | "top-left"
                )
              }
            >
              {POSITION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </CustomSelect>
          </div>

          <div className="flex items-center gap-3 self-end pb-0.5">
            <Switch
              id="showBranding"
              checked={formData.display.showBranding}
              onCheckedChange={(checked) => updateDisplay("showBranding", checked)}
            />
            <label htmlFor="showBranding" className="text-xs font-medium text-muted-foreground">
              {t("pages.my_agents.agent_settings.widget_config.show_branding")}
            </label>
          </div>
        </div>
      </section>

      {/* Behavior Section */}
      <BehaviorSection behavior={formData.behavior} onUpdate={updateBehavior} />

      {/* Allowed Domains Section */}
      <AllowedDomainsSection
        domains={formData.allowedDomains}
        onAdd={addDomain}
        onRemove={removeDomain}
        onUpdate={updateDomain}
      />

      {/* Rate Limit Section */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-base text-muted-foreground">speed</span>
          <h3 className="text-sm font-medium text-foreground">
            {t("pages.my_agents.agent_settings.widget_config.rate_limit_title")}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {t("pages.my_agents.agent_settings.widget_config.rate_limit_description")}
        </p>

        <div className="max-w-xs">
          <Label
            htmlFor="rateLimitPerHour"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            {t("pages.my_agents.agent_settings.widget_config.requests_per_hour")}
          </Label>
          <CustomTextField
            id="rateLimitPerHour"
            type="number"
            min={1}
            value={formData.rateLimitPerHour}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                rateLimitPerHour: Number(e.target.value),
              }))
            }
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="border-t border-border pt-6">
        <Button onClick={handleSaveConfig} disabled={isSaving} className="h-9">
          {isSaving
            ? t("pages.my_agents.agent_settings.widget_config.saving")
            : t("pages.my_agents.agent_settings.widget_config.save")}
        </Button>
      </div>
    </div>
  );
};
