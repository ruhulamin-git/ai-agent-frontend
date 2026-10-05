"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Breadcrumb } from "@/shared/ui/breadcrumb";

import { useMyAgent } from "../service/hooks";

import { ApiKeysTab } from "./components/ApiKeysTab";
import { AddReviewTab } from "./components/AddReviewTab";
import { GeneralTab } from "./components/GeneralTab";
import { AdvancedTab } from "./components/AdvancedTab";

export const AgentUsageDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id as string;
  const [activeTab, setActiveTab] = useState("general");

  const { data: subscription, isLoading, error } = useMyAgent(Number(agentId));

  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-900 dark:text-white">Loading agent details...</div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="text-red-600 dark:text-red-400">
            Agent not found or you don&apos;t have access
          </div>
          <button
            onClick={() => router.push("/user-dashboard/my-agent")}
            className="px-4 py-2 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back to My Agents
          </button>
        </div>
      </div>
    );
  }

  const agent = subscription.agent;
  const displayTitle =
    (agent as any)?.display_title || (agent as any)?.displayTitle || agent?.name || "Agent";
  const iconUrl = (agent as any)?.icon_url || (agent as any)?.iconUrl;

  const breadcrumbItems = [
    { label: "My Agents", href: "/user-dashboard/my-agent" },
    { label: displayTitle, isActive: true },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-thin">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-primary/20 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-800/50">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`${displayTitle} icon`}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <span className="text-2xl">🤖</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{displayTitle}</h1>
              <p className="text-gray-600 dark:text-gray-400">Use and manage your AI agent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(subscription?.replicatedChatflowId || subscription?.replicated_chatflow_id) && (
              <button
                onClick={() => {
                  const chatflowId =
                    subscription.replicatedChatflowId || subscription.replicated_chatflow_id;
                  if (subscription.type === "MULTIAGENT") {
                    router.push(`/ai-builder/agentcanvas/${chatflowId}`);
                  } else {
                    router.push(`/ai-builder/canvas/${chatflowId}`);
                  }
                }}
                className="px-4 py-2 text-sm font-medium rounded border border-primary text-primary hover:bg-primary/10 transition-colors"
                title="Use Agent"
              >
                Use Agent
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
            activeTab === "general"
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("add-review")}
          className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
            activeTab === "add-review"
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
          }`}
        >
          Add Review
        </button>

        <button
          onClick={() => setActiveTab("advanced")}
          className={`px-4 py-2 cursor-pointer rounded text-sm font-medium transition-colors ${
            activeTab === "advanced"
              ? "text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90"
              : "border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/20"
          }`}
        >
          Advanced
        </button>
      </div>

      <div className="w-full">
        {activeTab === "general" && <GeneralTab subscription={subscription} />}
        {activeTab === "add-review" && <AddReviewTab agentId={agent.id} />}
        {activeTab === "advanced" && <AdvancedTab subscription={subscription} />}
      </div>
    </div>
  );
};
