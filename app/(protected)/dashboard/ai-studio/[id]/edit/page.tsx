"use client";

import { use } from "react";

import { AgentBuilderPage } from "@/modules/newdashboard/developer-dashboard/pages/agent-builder";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AIStudioEditPage = ({ params }: PageProps) => {
  const { id } = use(params);

  return <AgentBuilderPage agentId={id} />;
};

export default AIStudioEditPage;
