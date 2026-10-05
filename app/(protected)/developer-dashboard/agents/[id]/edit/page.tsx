"use client";

import { use } from "react";

import { AgentEdit } from "@/modules/newdashboard/developer-dashboard/pages/agents/agent-edit";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const AgentEditPage = ({ params }: PageProps) => {
  const { id } = use(params);
  return <AgentEdit agentId={id} />;
};

export default AgentEditPage;
