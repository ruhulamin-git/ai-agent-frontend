"use client";

import dynamic from "next/dynamic";
import { use } from "react";

import { Skeleton } from "@/shared/ui/skeleton";

const AgentDetailPage = dynamic(
  () => import("@/modules/marketplace/agents").then((mod) => mod.AgentDetailPage),
  {
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const { slug } = use(params);
  return <AgentDetailPage slug={slug} />;
};

export default Page;
