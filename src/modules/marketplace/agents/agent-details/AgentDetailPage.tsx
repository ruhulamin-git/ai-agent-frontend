"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ErrorState } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { AgentIntegrations } from "../shared/components";

import { Comments } from "./components/Comments";
import { Reviews } from "./components/Reviews";
import { AgentChatPreview, AgentDemoVideo, AgentHero, AgentOverview } from "./components";
import { useAgentDetailLegacy } from "./hooks";

interface AgentDetailPageProps {
  slug: string;
}

export const AgentDetailPage = ({ slug }: AgentDetailPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { agent, isLoading, isError, refetch } = useAgentDetailLegacy(slug, true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <Skeleton className="h-12 w-3/4 rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32 rounded-full" />
                  <Skeleton className="h-12 w-32 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-64 w-64 rounded-2xl shrink-0" />
            </div>
          </div>
        </div>

        {/* Overview Skeleton */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-10 w-1/2 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>

        {/* Chat Preview Skeleton */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-48 mx-auto rounded-full" />
              <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
            </div>
            <Skeleton className="h-[500px] w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <ErrorState
            title="Agent Details Unavailable"
            message="We couldn't retrieve the information for this agent. Please try again or go back to the marketplace."
            onRetry={() => refetch()}
          />
          <Button
            variant="ghost"
            onClick={() => router.push("/agents")}
            className="mt-4 gap-2 text-slate-500 hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {t("pages.agents.back_to_marketplace")}
          </Button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <span className="material-symbols-outlined text-4xl text-muted-foreground">
              search_off
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Agent not found</h1>
          <p className="text-muted-foreground mb-6">
            The agent you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/agents")}>
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            {t("pages.agents.back_to_marketplace")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="max-w-7xl mx-auto">
          <TabsList className="mx-auto">
            <TabsTrigger value="overview">{t("agentTabs.overview", "Overview")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("agentTabs.reviews", "Reviews")}</TabsTrigger>
            <TabsTrigger value="comments">{t("comments.title", "All Comments (166)")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-0">
            <AgentHero agent={agent} />
            <AgentDemoVideo agent={agent} />
            <section className="w-full bg-background py-20 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
              <AgentOverview agent={agent} />
            </section>
            <AgentChatPreview agent={agent} />
            <AgentIntegrations />
          </TabsContent>

          <TabsContent value="reviews">
            <Reviews agentId={agent.id.toString()} />
          </TabsContent>

          <TabsContent value="comments">
            <Comments agentId={agent.id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
