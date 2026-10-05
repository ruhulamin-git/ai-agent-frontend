import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { Comments } from "../../agent-details/components/Comments";
import { Reviews } from "../../agent-details/components/Reviews";
import { DashboardAgentsSkeleton } from "../../agent-list/components";
import { useExternalAgentDetails } from "../services/getExternalAgentDetails";

import { ExternalAgentHero } from "./ExternalAgentHero";

interface ExternalAgentDetailProps {
  id: string;
}

export const ExternalAgentDetail = ({ id }: ExternalAgentDetailProps) => {
  const { t } = useTranslation();
  const { data: agent, isLoading, isError, refetch } = useExternalAgentDetails({ id });

  if (isLoading) {
    return <DashboardAgentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-20">
        <ErrorState
          title={t("pages.agents.config_unavailable")}
          message={t("pages.agents.config_unavailable_message")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {t("pages.agents.agent_not_found")}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          {t("pages.agents.agent_not_found_message")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mx-auto mb-6">
          <TabsTrigger value="overview">{t("agentTabs.overview", "Overview")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("agentTabs.reviews", "Reviews")}</TabsTrigger>
          <TabsTrigger value="comments">{t("agentTabs.comments", "Comments")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-0 bg-background text-foreground">
          <ExternalAgentHero agent={agent} />
        </TabsContent>

        <TabsContent value="reviews">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <Reviews agentId={agent.id.toString()} />
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <Comments agentId={agent.id.toString()} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
