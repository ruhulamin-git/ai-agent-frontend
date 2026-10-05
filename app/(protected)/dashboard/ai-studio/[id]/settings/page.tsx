"use client";

import { lazy, Suspense, use } from "react";

import { CircularLoader } from "@/shared/components";

const AgentSettingsPage = lazy(() =>
  import("@/modules/studio/manage-agents").then((mod) => ({
    default: mod.AgentSettingsPage,
  }))
);

const AgentSettingsRoute = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <Suspense fallback={<CircularLoader />}>
      <AgentSettingsPage agentId={id} />
    </Suspense>
  );
};

export default AgentSettingsRoute;
