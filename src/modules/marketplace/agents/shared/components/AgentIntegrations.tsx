"use client";

import { useTranslation } from "react-i18next";

import { integrations } from "@/modules/landing/data";
import { IntegrationLogo } from "@/shared/ui/integration-logos";

export const AgentIntegrations = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-background">
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <span className="material-symbols-outlined text-base">link</span>
            {t("pages.agents.integrations_title")}
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:text-4xl">
            {t("pages.agents.connects_with_tools")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("pages.agents.seamless_integration")}
          </p>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {integrations.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-center transition-all duration-300 hover:scale-110 h-16 w-16 grayscale-0 opacity-100"
                title={tool.name}
              >
                <IntegrationLogo name={tool.name} size={44} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
