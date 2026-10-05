"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import { AgentDetails } from "@/modules/newmarketplace/agent-details/AgentDetails";
import { useAgent, useAgentBySlug } from "@/modules/newmarketplace/service/getAgent";
import { convertToUIAgent } from "@/modules/newmarketplace/service/type";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const { slug } = use(params);
  const router = useRouter();

  // Check if slug is numeric (ID) or text (slug)
  const isNumeric = /^\d+$/.test(slug);

  // Use appropriate hook based on whether it's an ID or slug
  const {
    data: agentById,
    isLoading: isLoadingById,
    error: errorById,
  } = useAgent(isNumeric ? slug : "", isNumeric);

  const {
    data: agentBySlug,
    isLoading: isLoadingBySlug,
    error: errorBySlug,
  } = useAgentBySlug(!isNumeric ? slug : "", !isNumeric);

  const agent = isNumeric ? agentById : agentBySlug;
  const isLoading = isNumeric ? isLoadingById : isLoadingBySlug;
  const error = isNumeric ? errorById : errorBySlug;

  const handleBack = () => {
    router.push("/marketplace");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading agent details...</div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Agent not found</div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded-md text-white transition-all duration-300"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Convert API agent to UI agent format
  const uiAgent = convertToUIAgent(agent);

  return <AgentDetails agent={uiAgent} originalAgent={agent} onBack={handleBack} />;
};

export default Page;
