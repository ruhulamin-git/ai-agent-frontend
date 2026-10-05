"use client";

import { ArrowLeft, ArrowRight, Plug, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";

import { AgentRequiredIntegrations } from "../../agent-details/components/AgentRequiredIntegrations";

import type { Agent } from "../types";

interface AgentConnectSSOStepProps {
  agent: Agent;
  selectedIntegrationIds: Record<number, number>;
  onIntegrationSelect: (providerId: number, userIntegrationId: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AgentConnectSSOStep = ({
  agent,
  selectedIntegrationIds,
  onIntegrationSelect,
  onNext,
  onBack,
}: AgentConnectSSOStepProps) => {
  const { t } = useTranslation();

  const integrations = agent.requiredIntegrations || [];
  const hasIntegrations = integrations.length > 0;
  const allSelected = hasIntegrations
    ? integrations.every((i) => selectedIntegrationIds[i.providerId] !== undefined)
    : true;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            <Plug size={12} />
            {t("pages.agents.connect_services", { defaultValue: "Connect Services" })}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {hasIntegrations
              ? t("pages.agents.connect_required_services", { defaultValue: "Connect Required Services" })
              : t("pages.agents.ready_to_go", { defaultValue: "Ready to Go!" })
            }
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {hasIntegrations
              ? t("pages.agents.agent_needs_access", {
                defaultValue: "Your agent needs access to these services to work properly."
              })
              : t("pages.agents.works_out_of_box", {
                defaultValue: "This agent works out of the box! No additional services needed."
              })
            }
          </p>
        </div>

        {hasIntegrations ? (
          <div className="max-w-xl mx-auto w-full">
            <AgentRequiredIntegrations
              integrations={integrations}
              agentId={Number(agent.id)}
              selectedIntegrationIds={selectedIntegrationIds}
              onIntegrationSelect={onIntegrationSelect}
              onAllConnected={() => { }}
            />
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 text-center">
              <div className="mb-4 bg-green-100 dark:bg-green-500/10 p-3 rounded-xl inline-flex">
                <Zap className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="font-medium mb-2 text-foreground">
                {t("pages.agents.no_setup_required", { defaultValue: "No Setup Required" })}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {t("pages.agents.ready_to_use_immediately", {
                  defaultValue: "This agent is ready to use immediately."
                })}
              </p>
              <div className="bg-background/50 rounded-xl p-3 border border-border">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  {t("pages.agents.ready_to_deploy", { defaultValue: "Ready to Deploy" })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl px-4 py-3 bg-muted border-border hover:bg-muted/80"
        >
          <ArrowLeft size={16} className="mr-2" />
          {t("pages.agents.back", { defaultValue: "Back" })}
        </Button>
        <Button
          onClick={onNext}
          className="rounded-xl px-4 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          disabled={hasIntegrations && !allSelected}
        >
          {allSelected || !hasIntegrations
            ? t("pages.agents.continue", { defaultValue: "Continue" })
            : t("pages.agents.skip_for_now", { defaultValue: "Skip for Now" })
          }
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};