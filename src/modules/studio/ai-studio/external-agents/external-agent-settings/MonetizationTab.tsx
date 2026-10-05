"use client";

import { CircleDollarSign, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { PlanDialog } from "./PlanDialog";

import type { AgentPricingPlan, CreatePricingPlanDTO, UpdatePricingPlanDTO } from "./types";

interface MonetizationTabProps {
  plans: AgentPricingPlan[];
  isLoadingPlans?: boolean;
  isCreatingPlan?: boolean;
  isUpdatingPlan?: boolean;
  isDeletingPlan?: boolean;
  onCreatePlan: (payload: CreatePricingPlanDTO, onSuccess?: () => void) => void;
  onUpdatePlan: (planId: number, payload: UpdatePricingPlanDTO, onSuccess?: () => void) => void;
  onDeletePlan: (planId: number) => void;
}

const PRICING_TYPE_LABELS: Record<string, string> = {
  free: "Free",
  monthly: "Monthly",
  yearly: "Yearly",
  lifetime: "Lifetime",
};

export const MonetizationTab = ({
  plans,
  isLoadingPlans = false,
  isCreatingPlan = false,
  isUpdatingPlan = false,
  isDeletingPlan = false,
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
}: MonetizationTabProps) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AgentPricingPlan | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleEdit = (plan: AgentPricingPlan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleCreatePlan = (payload: CreatePricingPlanDTO) => {
    onCreatePlan(payload, () => {
      setDialogOpen(false);
      setEditingPlan(null);
    });
  };

  const handleUpdatePlan = (planId: number, payload: UpdatePricingPlanDTO) => {
    onUpdatePlan(planId, payload, () => {
      setDialogOpen(false);
      setEditingPlan(null);
    });
  };

  const handleDelete = (id: number) => {
    onDeletePlan(id);
    setDeletingId(null);
  };

  const isSaving = isCreatingPlan || isUpdatingPlan;

  return (
    <div className="flex flex-col gap-8">
      <header className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          {t("pages.agent_settings.monetization.title")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("pages.agent_settings.monetization.description")}
        </p>
      </header>

      {/* ── Subscription Plans ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CircleDollarSign size={18} className="text-primary" />
            {t("pages.agent_settings.monetization.plans.title")}
          </h3>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-semibold"
            onClick={handleCreate}
          >
            <Plus size={14} />
            {t("pages.agent_settings.monetization.plans.add_plan")}
          </Button>
        </div>

        {isLoadingPlans ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_0.8fr_1fr_1fr_0.8fr_auto] gap-4 px-5 py-3 bg-muted/40 text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <span>{t("pages.agent_settings.monetization.plans.table.name")}</span>
              <span>{t("pages.agent_settings.monetization.plans.table.price")}</span>
              <span>{t("pages.agent_settings.monetization.plans.table.validity")}</span>
              <span>{t("pages.agent_settings.monetization.plans.table.usage")}</span>
              <span>{t("pages.agent_settings.monetization.plans.table.trial")}</span>
              <span className="text-right">
                {t("pages.agent_settings.monetization.plans.table.actions")}
              </span>
            </div>

            {/* Table Rows */}
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group grid grid-cols-1 md:grid-cols-[1.5fr_0.8fr_1fr_1fr_0.8fr_auto] gap-2 md:gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors items-center"
              >
                <div>
                  <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pages.agent_settings.monetization.plans.table.name")}
                  </span>
                  <p className="font-semibold text-sm text-foreground">
                    {plan.name || t("pages.agent_settings.monetization.plans.untitled")}
                  </p>
                  {!plan.isActive && (
                    <span className="text-[0.625rem] text-amber-500 font-medium">Inactive</span>
                  )}
                </div>
                <div>
                  <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pages.agent_settings.monetization.plans.table.price")}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {plan.pricingType === "free" ? "Free" : `${plan.price}`}
                  </p>
                </div>
                <div>
                  <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pages.agent_settings.monetization.plans.table.validity")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {PRICING_TYPE_LABELS[plan.pricingType] ?? plan.pricingType}
                  </p>
                </div>
                <div>
                  <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pages.agent_settings.monetization.plans.table.usage")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {plan.maxMessagesPerMonth === -1
                      ? "Unlimited"
                      : `${plan.maxMessagesPerMonth.toLocaleString()} msgs/mo`}
                  </p>
                </div>
                <div>
                  <span className="md:hidden text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pages.agent_settings.monetization.plans.table.trial")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {plan.trialDays > 0
                      ? t("pages.agent_settings.monetization.plans.trial_days", {
                          count: plan.trialDays,
                        })
                      : t("pages.agent_settings.monetization.plans.trial_none")}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1">
                  {deletingId === plan.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleDelete(plan.id)}
                        disabled={isDeletingPlan}
                      >
                        {t("pages.agent_settings.monetization.plans.confirm")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setDeletingId(null)}
                      >
                        {t("pages.agent_settings.monetization.plans.cancel")}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-transparent border-none cursor-pointer"
                        onClick={() => handleEdit(plan)}
                        title={t("pages.agent_settings.monetization.plans.edit_title")}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors bg-transparent border-none cursor-pointer"
                        onClick={() => setDeletingId(plan.id)}
                        title={t("pages.agent_settings.monetization.plans.delete_title")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-border bg-muted/10">
            <CircleDollarSign size={36} className="mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground mb-1">
              {t("pages.agent_settings.monetization.empty.title")}
            </p>
            <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto">
              {t("pages.agent_settings.monetization.empty.description")}
            </p>
            <Button onClick={handleCreate} size="sm" className="gap-1.5 font-semibold">
              <Plus size={14} />
              {t("pages.agent_settings.monetization.empty.button")}
            </Button>
          </div>
        )}
      </section>

      {/* Plan Create/Edit Dialog */}
      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        onCreatePlan={handleCreatePlan}
        onUpdatePlan={handleUpdatePlan}
        isSaving={isSaving}
      />
    </div>
  );
};
