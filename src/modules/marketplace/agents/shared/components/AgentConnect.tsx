"use client";

import { useFormik } from "formik";
import { CheckCircle, Rocket, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import * as Yup from "yup";

import {
  type AgentConnectPayload,
  usePostAgentConnect,
} from "../../platform-agents/services/postAgentConnect";

import { AgentConnectContextStep } from "./AgentConnectContextStep";
import { AgentConnectNameStep } from "./AgentConnectNameStep";
import { AgentConnectSSOStep } from "./AgentConnectSSOStep";

import type { Agent } from "../types";

interface AgentConnectProps {
  agent: Agent;
}

const STEP_NAME = 1;
const STEP_CONNECT = 2;
const STEP_CONTEXT = 3;

export const AgentConnect = ({ agent }: AgentConnectProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Validation Schema
  const AgentConnectSchema = Yup.object().shape({
    name: Yup.string().required(t("pages.agents.agent_name_required")),
    business_context: Yup.string().required(t("pages.agents.business_context_required")),
    instructions: Yup.string().required(t("pages.agents.instructions_required")),
  });

  const steps = [
    {
      id: STEP_NAME,
      label: t("pages.agents.step_name"),
      description: t("pages.agents.step_name_description"),
      icon: User,
    },
    {
      id: STEP_CONNECT,
      label: t("pages.agents.step_connect"),
      description: t("pages.agents.step_connect_description"),
      icon: Settings,
    },
    {
      id: STEP_CONTEXT,
      label: t("pages.agents.step_context"),
      description: t("pages.agents.step_context_description"),
      icon: Rocket,
    },
  ];

  const [step, setStep] = useState(1);
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for auto-scroll/focus or just visual trigger
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Combine refs
  const setRefs = (node: HTMLDivElement) => {
    sectionRef.current = node;
    inViewRef(node);
  };

  const { mutate: createAgent, isPending } = usePostAgentConnect({
    onSuccess: () => {
      toast.success(t("pages.agents.agent_created_success"));
      formik.resetForm();
      setStep(1);
      router.push("/dashboard/my-agents");
    },
    onError: (error) => {
      toast.error(t("pages.agents.agent_create_failed"));
      console.error(error);
    },
  });

  const formik = useFormik<Omit<AgentConnectPayload, "agent">>({
    initialValues: {
      name: "",
      business_context: "",
      instructions: "",
      integration_ids: [],
      settings: {},
      metadata: {},
    },
    validationSchema: AgentConnectSchema,
    onSubmit: (values) => {
      const payload: AgentConnectPayload = {
        ...values,
        agent: Number(agent.id),
        integration_ids: Object.values(selectedIntegrationIds),
        settings: {},
        metadata: {},
      };
      createAgent(payload);
    },
  });

  // Auto-focus logic can be handled inside steps now, but keeping scroll to view if needed
  useEffect(() => {
    if (inView && sectionRef.current) {
      // Optional: logic to ensure visibility
    }
  }, [inView]);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleIntegrationSelect = useCallback((providerId: number, userIntegrationId: number) => {
    setSelectedIntegrationIds((prev) => ({ ...prev, [providerId]: userIntegrationId }));
  }, []);

  return (
    <section ref={setRefs} className="relative w-full bg-background text-foreground py-16 px-6">
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("pages.agents.agent_setup")}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("pages.agents.configure_agent_title", { name: agent.name })}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("pages.agents.setup_walkthrough")}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-3 gap-6 relative">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.id;
              const isCompleted = step > stepItem.id;

              return (
                <div key={stepItem.id} className="relative">
                  <div
                    className={`bg-card rounded-2xl p-4 border transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : isCompleted
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={18} /> : <Icon size={18} />}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium text-xs ${
                            isActive
                              ? "text-primary"
                              : isCompleted
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {t("pages.agents.step_number", { number: stepItem.id })}
                        </h3>
                        <p className="text-foreground font-medium text-sm">{stepItem.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Solid Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-6 w-6 -translate-y-1/2 z-10">
                      <div
                        className={` border-2 border-dotted  transition-all ${
                          step > stepItem.id ? "border-primary" : "border-border"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="p-8 w-full h-auto flex flex-col">
              {step === STEP_NAME && <AgentConnectNameStep formik={formik} onNext={handleNext} />}
              {step === STEP_CONNECT && (
                <AgentConnectSSOStep
                  agent={agent}
                  selectedIntegrationIds={selectedIntegrationIds}
                  onIntegrationSelect={handleIntegrationSelect}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === STEP_CONTEXT && (
                <AgentConnectContextStep
                  formik={formik}
                  onBack={handleBack}
                  isSubmitting={isPending || formik.isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
