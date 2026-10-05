"use client";

import { ArrowLeft, Rocket, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

import type { AgentConnectPayload } from "../../platform-agents/services/postAgentConnect";
import type { FormikProps } from "formik";

interface AgentConnectContextStepProps {
  formik: FormikProps<Omit<AgentConnectPayload, "agent">>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const AgentConnectContextStep = ({
  formik,
  onBack,
  isSubmitting,
}: AgentConnectContextStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            <Sparkles size={12} />
            {t("pages.agents.finalize_setup")}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t("pages.agents.customize_your_agent", { defaultValue: "Customize Your Agent" })}
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {t("pages.agents.provide_context")}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-sm">🏢</span>
              <label htmlFor="business_context" className="text-sm font-medium text-foreground">
                {t("pages.agents.business_context_label")}
              </label>
            </div>
            <Textarea
              id="business_context"
              name="business_context"
              placeholder={t("pages.agents.business_context_placeholder")}
              className={`h-20 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-primary/30 rounded-xl resize-none py-3 px-3 text-sm ${
                formik.touched.business_context && formik.errors.business_context
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.business_context}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.business_context && formik.errors.business_context && (
              <div className="text-xs text-red-500 mt-1">{formik.errors.business_context}</div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-sm">📝</span>
              <label htmlFor="instructions" className="text-sm font-medium text-foreground">
                {t("pages.agents.instructions_label")}
              </label>
            </div>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder={t("pages.agents.instructions_placeholder")}
              className={`h-24 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-primary/30 rounded-xl resize-none py-3 px-3 text-sm ${
                formik.touched.instructions && formik.errors.instructions ? "border-red-500" : ""
              }`}
              value={formik.values.instructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.instructions && formik.errors.instructions && (
              <div className="text-xs text-red-500 mt-1">{formik.errors.instructions}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 bg-card">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl px-4 py-3 bg-muted border-border hover:bg-muted/80"
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} className="mr-2" />
          {t("pages.agents.back")}
        </Button>
        <Button
          onClick={formik.submitForm}
          className="rounded-xl px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("pages.agents.creating")}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Rocket size={16} />
              {t("pages.agents.deploy_agent", { defaultValue: "Deploy Agent" })}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
