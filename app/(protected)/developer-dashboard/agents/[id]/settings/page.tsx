"use client";

import { use } from "react";

import { AgentSettings } from "@/modules/newdashboard/developer-dashboard/pages/agents/agent-settings";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const AgentSettingsPage = ({ params }: PageProps) => {
  const { id } = use(params);
  return <AgentSettings agentId={id} />;
};

export default AgentSettingsPage;
