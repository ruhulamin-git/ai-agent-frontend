"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type {
  AgentPricingPlan,
  CreatePricingPlanDTO,
  PricingType,
  UpdatePricingPlanDTO,
} from "./types";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: AgentPricingPlan | null;
  onCreatePlan: (payload: CreatePricingPlanDTO) => void;
  onUpdatePlan: (planId: number, payload: UpdatePricingPlanDTO) => void;
  isSaving?: boolean;
}

const PRICING_TYPE_OPTIONS: Array<{ value: PricingType; label: string }> = [
  { value: "free", label: "Free" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
];

interface PlanFormState {
  name: string;
  pricingType: PricingType;
  price: string;
  currency: string;
  maxMessagesPerMonth: number;
  maxIntegrations: number;
  trialDays: number;
  isActive: boolean;
}

const EMPTY_FORM: PlanFormState = {
  name: "",
  pricingType: "monthly",
  price: "0",
  currency: "USD",
  maxMessagesPerMonth: -1,
  maxIntegrations: -1,
  trialDays: 0,
  isActive: true,
};

export const PlanDialog = ({
  open,
  onOpenChange,
  plan,
  onCreatePlan,
  onUpdatePlan,
  isSaving = false,
}: PlanDialogProps) => {
  const { t } = useTranslation();
  const isEdit = Boolean(plan);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      if (plan) {
        setForm({
          name: plan.name,
          pricingType: plan.pricingType,
          price: plan.price,
          currency: plan.currency,
          maxMessagesPerMonth: plan.maxMessagesPerMonth,
          maxIntegrations: plan.maxIntegrations,
          trialDays: plan.trialDays,
          isActive: plan.isActive,
        });
      } else {
        setForm({ ...EMPTY_FORM });
      }
    }
  }, [open, plan]);

  const updateField = <K extends keyof PlanFormState>(field: K, value: PlanFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (isEdit && plan) {
      const payload: UpdatePricingPlanDTO = {
        name: form.name,
        pricingType: form.pricingType,
        price: form.price,
        currency: form.currency,
        maxMessagesPerMonth: form.maxMessagesPerMonth,
        maxIntegrations: form.maxIntegrations,
        trialDays: form.trialDays,
        isActive: form.isActive,
      };
      onUpdatePlan(plan.id, payload);
    } else {
      const payload: CreatePricingPlanDTO = {
        name: form.name,
        pricingType: form.pricingType,
        price: form.price,
        currency: form.currency,
        maxMessagesPerMonth: form.maxMessagesPerMonth,
        maxIntegrations: form.maxIntegrations,
        trialDays: form.trialDays,
        isActive: form.isActive,
      };
      onCreatePlan(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit
              ? t("pages.agent_settings.monetization.dialog.title_edit")
              : t("pages.agent_settings.monetization.dialog.title_create")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("pages.agent_settings.monetization.dialog.description_edit")
              : t("pages.agent_settings.monetization.dialog.description_create")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-4">
          {/* Plan Name */}
          <div>
            <Label className="block text-[0.8125rem] font-medium mb-1.5">
              {t("pages.agent_settings.monetization.dialog.plan_name")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("pages.agent_settings.monetization.dialog.plan_name_placeholder")}
            />
          </div>

          {/* Pricing Type + Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-[0.8125rem] font-medium mb-1.5">
                {t("pages.agent_settings.monetization.dialog.validity")}
              </Label>
              <Select
                value={form.pricingType}
                onValueChange={(v) => updateField("pricingType", v as PricingType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-[0.8125rem] font-medium mb-1.5">
                {t("pages.agent_settings.monetization.dialog.price")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  type="number"
                  className="pl-7"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  min={0}
                  disabled={form.pricingType === "free"}
                />
              </div>
            </div>
          </div>

          {/* Max Messages + Max Integrations row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-[0.8125rem] font-medium mb-1.5">
                {t("pages.agent_settings.monetization.dialog.usage_limit")}
              </Label>
              <Input
                type="number"
                value={form.maxMessagesPerMonth}
                onChange={(e) => updateField("maxMessagesPerMonth", Number(e.target.value))}
                placeholder="-1 for unlimited"
              />
              <p className="text-[0.6875rem] text-muted-foreground mt-1">-1 = unlimited</p>
            </div>
            <div>
              <Label className="block text-[0.8125rem] font-medium mb-1.5">
                {t("pages.agent_settings.monetization.dialog.free_trial")}
              </Label>
              <Input
                type="number"
                value={form.trialDays}
                onChange={(e) => updateField("trialDays", Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            {t("pages.agent_settings.monetization.dialog.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!form.name.trim() || isSaving} className="gap-2">
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isEdit
              ? t("pages.agent_settings.monetization.dialog.button_update")
              : t("pages.agent_settings.monetization.dialog.button_create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
