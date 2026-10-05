"use client";

import {
  Activity,
  ArrowLeft,
  Bot,
  Calendar,
  CircleDollarSign,
  Globe,
  Link2,
  Loader2,
  Rocket,
  Settings,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { DashboardTab } from "./DashboardTab";
import { GeneralTab } from "./GeneralTab";
import { useExternalAgentSettings } from "./hooks";
import { MonetizationTab } from "./MonetizationTab";

const SETTINGS_NAV = [
  {
    id: "general",
    icon: <Settings size={18} />,
    label: "pages.external_agent_settings.nav.general",
  },
  {
    id: "dashboard",
    icon: <Activity size={18} />,
    label: "pages.external_agent_settings.nav.dashboard",
  },
  {
    id: "monetization",
    icon: <CircleDollarSign size={18} />,
    label: "pages.agent_settings.nav.monetization",
  },
] as const;

interface ExternalAgentSettingsPageProps {
  agentId: string;
}

export const ExternalAgentSettingsPage = ({ agentId }: ExternalAgentSettingsPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    agent,
    isLoading,
    error,
    isPending,
    isDeleting,
    isPublishing,
    isUnpublishing,
    handlePublish,
    handleUnpublish,
    pricingPlans,
    isLoadingPlans,
    isCreatingPlan,
    isUpdatingPlan,
    isDeletingPlan,
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    iconFile,
    setIconFile,
    coverFile,
    setCoverFile,
    handleUpdate,
    handleDelete,
  } = useExternalAgentSettings({ agentId });

  const [isActive, setIsActive] = useState<boolean>(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-muted-foreground">
        <Bot size={40} className="text-muted-foreground" />
        <p>{t("pages.external_agent_settings.not_found", "External agent not found")}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/ai-studio?tab=external")}>
          {t("pages.external_agent_settings.go_back", "Go Back")}
        </Button>
      </div>
    );
  }

  const formattedDate = agent.createdAt
    ? new Date(agent.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "degraded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "down":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted-foreground bg-transparent border-none cursor-pointer p-0 mb-6 transition-colors hover:text-primary"
        onClick={() => router.push("/dashboard/ai-studio/external-agents")}
      >
        <ArrowLeft size={16} />
        {t("pages.external_agent_settings.back_to_studio", "Back to External Agents")}
      </button>

      {/* ─── Enhanced Hero Header ─── */}
      <div className="mb-8 rounded-2xl border border-border bg-card overflow-hidden">
        {/* Cover Image Area */}
        <div className="relative h-28 bg-linear-to-br from-primary/20 via-primary/5 to-transparent">
          {agent.coverImageUrl && (
            <Image
              src={agent.coverImageUrl}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-card/90 to-transparent" />
        </div>

        {/* Agent Info */}
        <div className="relative px-6 pb-6 -mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-primary shrink-0 overflow-hidden shadow-lg">
              {agent.iconUrl ? (
                <Image
                  src={agent.iconUrl}
                  alt={agent.agent.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <Link2 size={28} />
              )}
            </div>

            {/* Name / Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground truncate">
                {agent.agent.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1 flex items-center gap-2">
                <Globe size={14} />
                {agent.siteUrl}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Publish / Unpublish Button */}
              {agent.agent.publishStatus === "published" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleUnpublish}
                  disabled={isUnpublishing}
                >
                  {isUnpublishing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Rocket size={14} />
                  )}
                  {t("pages.agent_settings.unpublish")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Rocket size={14} />
                  )}
                  {t("pages.agent_settings.publish")}
                </Button>
              )}
            </div>
          </div>

          {/* Status Badges & Quick Stats */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Health Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-semibold rounded-full uppercase tracking-wide border ${getHealthStatusColor(
                agent.healthStatus
              )}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  agent.healthStatus === "healthy"
                    ? "bg-green-500"
                    : agent.healthStatus === "degraded"
                    ? "bg-amber-500"
                    : agent.healthStatus === "down"
                    ? "bg-red-500"
                    : "bg-muted-foreground"
                }`}
              />
              {agent.healthStatus}
            </span>

            {/* Verification Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-semibold rounded-full uppercase tracking-wide border ${
                agent.isVerified
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <Shield size={11} />
              {agent.isVerified
                ? t("pages.external_agent_settings.verified", "Verified")
                : t("pages.external_agent_settings.unverified", "Unverified")}
            </span>

            {/* Publish Status */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-semibold rounded-full uppercase tracking-wide border ${
                agent.agent.publishStatus === "published"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {agent.agent.publishStatus === "published"
                ? t("pages.ai_studio.published")
                : t("pages.ai_studio.draft")}
            </span>

            {/* Source Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6875rem] font-semibold rounded-full uppercase tracking-wide border bg-primary/10 text-primary border-primary/20">
              <Link2 size={11} />
              {agent.agent.sourceType}
            </span>

            <span className="w-px h-4 bg-border" />

            {/* Quick Stats */}
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
              <Activity size={12} />
              {agent.agent.interactionMode}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
              <Calendar size={12} />
              {t("pages.external_agent_settings.created", "Created")} {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          {SETTINGS_NAV.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              {tab.icon}
              {t(tab.label)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <GeneralTab
            agent={agent}
            iconFile={iconFile}
            setIconFile={setIconFile}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            onSave={handleUpdate}
            isPending={isPending}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          {agent?.agent?.id ? (
            <DashboardTab
              agentId={agent.agent.id.toString()}
              visibility="public"
              isActive={isActive}
              setIsActive={setIsActive}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="monetization">
          <MonetizationTab
            plans={pricingPlans}
            isLoadingPlans={isLoadingPlans}
            isCreatingPlan={isCreatingPlan}
            isUpdatingPlan={isUpdatingPlan}
            isDeletingPlan={isDeletingPlan}
            onCreatePlan={handleCreatePlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
