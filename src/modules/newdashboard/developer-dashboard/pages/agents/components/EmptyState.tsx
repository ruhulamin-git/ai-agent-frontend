import Link from "next/link";

import { Button } from "@/shared/ui/button";

interface EmptyStateProps {
  activeFilter: "all" | "published" | "draft";
}

export const EmptyState = ({ activeFilter }: EmptyStateProps) => {
  return (
    <div className="relative w-full min-h-[320px] rounded-xl p-12 flex flex-col items-center justify-center overflow-hidden border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-purple-600 dark:text-purple-400 text-3xl">🤖</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No agents found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {activeFilter === "all"
            ? "Start building your first AI agent"
            : `No ${activeFilter} agents yet`}
        </p>
        {activeFilter === "all" && (
          <Link href="/ai-builder/chatflows">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Create Your First Agent
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
