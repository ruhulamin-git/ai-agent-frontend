"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type { AgentConnectPayload } from "../../platform-agents/services/postAgentConnect";
import type { FormikProps } from "formik";

interface AgentConnectNameStepProps {
  formik: FormikProps<Omit<AgentConnectPayload, "agent">>;
  onNext: () => void;
}

export const AgentConnectNameStep = ({ formik, onNext }: AgentConnectNameStepProps) => {
  const { t } = useTranslation();

  const handleNext = () => {
    formik.setFieldTouched("name", true, true);
    if (!formik.errors.name && formik.values.name) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            <Sparkles size={12} />
            {t("pages.agents.name_your_agent", { defaultValue: "Name Your Agent" })}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t("pages.agents.what_should_we_call", { defaultValue: "What should we call your agent?" })}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t("pages.agents.choose_name_description", {
              defaultValue: "Choose a name that reflects your agent's personality and purpose."
            })}
          </p>
        </div>

        <div className="max-w-sm mx-auto w-full">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-foreground block mb-2">
              {t("pages.agents.agent_name", { defaultValue: "Agent Name" })}
            </label>
            <Input
              id="name"
              name="name"
              placeholder={t("pages.agents.name_placeholder", {
                defaultValue: "e.g., Marketing Assistant, Code Helper..."
              })}
              className={`h-12 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-primary/30 rounded-xl px-4 font-medium ${formik.touched.name && formik.errors.name ? "border-red-500" : ""
                }`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-xs text-red-500 mt-1">{formik.errors.name}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleNext}
          className="rounded-xl px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          disabled={!formik.values.name || !!formik.errors.name}
        >
          {t("pages.agents.continue_setup", { defaultValue: "Continue Setup" })}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};