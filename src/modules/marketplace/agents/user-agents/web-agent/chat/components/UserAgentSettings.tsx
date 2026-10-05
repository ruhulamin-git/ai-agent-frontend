"use client";

import { ArrowLeft, Code, Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { BasicSettings, WidgetSettings } from "../../settings/components";
import { useDeleteUserAgent, useUserAgentDetails } from "../../settings/services";

export const UserAgentSettings = () => {
  const { t } = useTranslation();
  const params = useParams();
  const agentId = params?.id as string;

  const { data: userAgent, isLoading, isError } = useUserAgentDetails({ agentId });
  const deleteMutation = useDeleteUserAgent();

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!confirm(t("pages.my_agents.agent_settings.delete_confirmation"))) return;
    try {
      await deleteMutation.mutateAsync(agentId);
      toast.success(t("pages.my_agents.agent_settings.deleted_success"));
      window.location.href = "/dashboard/my-agents";
    } catch {
      toast.error(t("pages.my_agents.agent_settings.delete_failed"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !userAgent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <Settings className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{t("pages.my_agents.agent_not_found")}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          {t("pages.my_agents.go_back")}
        </Button>
      </div>
    );
  }

  const isMessagingAgent = userAgent.agent.agentType === "messaging";

  return (
    <div>
      {/* ── Header ── */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate">
              {userAgent.name}
            </h1>
            <Badge
              variant={userAgent.isActive ? "default" : "secondary"}
              className="shrink-0 text-[10px] font-medium"
            >
              {userAgent.isActive
                ? t("pages.my_agents.agent_settings.active")
                : t("pages.my_agents.agent_settings.inactive")}
            </Badge>
          </div>

          <Link href={`/dashboard/my-agents/${agentId}`} className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              {t("pages.my_agents.back_to_chat")}
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="grid gap-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic" className="gap-2">
              <Settings className="h-4 w-4" />
              {t("pages.my_agents.agent_settings.basic_tab")}
            </TabsTrigger>
            {!isMessagingAgent && (
              <TabsTrigger value="widget" className="gap-2">
                <Code className="h-4 w-4" />
                {t("pages.my_agents.agent_settings.widget_tab")}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("pages.my_agents.agent_settings.agent_configuration")}</CardTitle>
                <CardDescription>
                  {t("pages.my_agents.agent_settings.agent_configuration_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BasicSettings agentId={agentId} />
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {t("pages.my_agents.agent_settings.delete_agent")}
                </CardTitle>
                <CardDescription>
                  {t("pages.my_agents.agent_settings.delete_agent_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending
                    ? t("pages.my_agents.agent_settings.deleting")
                    : t("pages.my_agents.agent_settings.delete_agent_button")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {!isMessagingAgent && (
            <TabsContent value="widget">
              <Card>
                <CardHeader>
                  <CardTitle>{t("pages.my_agents.agent_settings.embed_appearance")}</CardTitle>
                  <CardDescription>
                    {t("pages.my_agents.agent_settings.embed_appearance_description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WidgetSettings agentId={agentId} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};
