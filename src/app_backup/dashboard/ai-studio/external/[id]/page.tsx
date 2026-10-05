import { ExternalAgentSettingsPage } from "@/modules/studio/ai-studio/external-agents/external-agent-settings";

interface ExternalAgentDetailProps {
    params: {
        id: string;
    };
}

const ExternalAgentDetail = ({ params }: ExternalAgentDetailProps) => {
    return <ExternalAgentSettingsPage agentId={params.id} />;
};

export default ExternalAgentDetail;