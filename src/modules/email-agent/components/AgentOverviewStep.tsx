"use client";

import { AgentOverview, useAgentDetailLegacy } from "@/modules/marketplace/agents";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

interface AgentOverviewStepProps {
  onNext: () => void;
}

export const AgentOverviewStep = ({ onNext }: AgentOverviewStepProps) => {
  const { agent: emailAgent, isLoading } = useAgentDetailLegacy("email-connector");

  if (isLoading || !emailAgent) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-2">
      <AgentOverview agent={emailAgent} />

      <div className="mt-4 flex justify-end px-4">
        <Button
          onClick={onNext}
          size="lg"
          className="rounded-2xl px-12 h-12 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          Get Started
          <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
};
