"use client";

import { Button } from "@/shared/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  activeFilter: "all" | "active" | "pending" | "cancelled";
}

export const EmptyState = ({ activeFilter }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🤖</div>
      <h3 className="text-lg text-gray-900 dark:text-white mb-2">No agents found</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {activeFilter === "all"
          ? "You haven't subscribed to any AI agents yet."
          : `No ${activeFilter} agents found.`}
      </p>
      <Link href="/marketplace">  
      <Button className="hover:bg-gray-100 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800/90">Browse Marketplace</Button>
    </Link>
    </div>
  );
};
