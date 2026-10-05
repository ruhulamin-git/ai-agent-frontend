"use client";

import { lazy, Suspense, use } from "react";

import { CircularLoader } from "@/shared/components";

const ExternalAgentSettingsPage = lazy(() =>
    import("@/modules/studio/ai-studio/external-agents/external-agent-settings").then((mod) => ({
        default: mod.ExternalAgentSettingsPage,
    }))
);

const ExternalAgentSettingsRoute = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    return (
        <Suspense fallback={<CircularLoader />}>
            <ExternalAgentSettingsPage agentId={id} />
        </Suspense>
    );
};

export default ExternalAgentSettingsRoute;
