import Link from "next/link";

import type { UserAgent } from "../service/types";

interface AgentCardProps {
  agent: UserAgent;
  formatTimeAgo: (dateString: string) => string;
}

export const AgentCard = ({ agent, formatTimeAgo }: AgentCardProps) => {
  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full min-h-[320px] rounded-xl p-4 flex flex-col overflow-hidden border border-gray-300 dark:border-white/10 hover:border-purple-500/30 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-500">
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-lg border border-purple-500/20 shadow-lg flex items-center justify-center bg-gray-200 dark:bg-gray-800/50 overflow-hidden">
              {agent.iconUrl ? (
                <img src={agent.iconUrl} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">{agent.sourceType === "visual" ? "✨" : "🔌"}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800/50">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${agent.publishStatus === "published" ? "bg-green-500" : "bg-yellow-500"
                    }/40 opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${agent.publishStatus === "published" ? "bg-green-500" : agent.publishStatus === "pending_review" ? "bg-blue-500" : "bg-yellow-500"
                    }`}
                />
              </span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-white/90 uppercase tracking-wider">
                {agent.publishStatus}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{agent.name}</h3>

            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{agent.description}</p>

            {/* Tags */}
            {agent.tags && agent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {agent.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    +{agent.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Last Modified */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-500">Updated {formatTimeAgo(agent.createdAt)}</div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <div
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${agent.publishStatus === "published"
                  ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30"
                  : agent.publishStatus === "pending_review"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-500/30"
                    : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30"
                  }`}
              >
                {agent.publishStatus === "published"
                  ? "Live & Published"
                  : agent.publishStatus === "pending_review"
                    ? "Pending Review"
                    : "Draft Mode"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-2">
              <Link href={`/developer-dashboard/agents/${agent.id}/edit`} className="flex-1">
                <button className="w-full px-3 py-1.5 text-sm font-medium rounded border border-purple-300 dark:border-purple-600/30 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  Edit Additional Info
                </button>
              </Link>
              <div className="flex gap-2">

                {agent.chatflowId && (
                  <Link href={agent.type === "MULTIAGENT" ? `/ai-builder/agentcanvas/${agent.chatflowId}` : `/ai-builder/canvas/${agent.chatflowId}`} className="w-full">
                    <button className="w-full px-3 py-1.5 text-sm font-medium rounded bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-200 dark:hover:bg-purple-600/30 border border-purple-300 dark:border-purple-600/30 hover:border-purple-400 dark:hover:border-purple-600/50 text-purple-700 dark:text-white transition-colors">
                      Edit Agent
                    </button>
                  </Link>
                )}
                <Link href={`/developer-dashboard/agents/${agent.id}/settings`} className="flex-1">
                  <button className="w-full px-3 py-1.5 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
