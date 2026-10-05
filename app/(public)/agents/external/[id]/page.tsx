"use client";

import dynamic from "next/dynamic";
import { use } from "react";

import { Skeleton } from "@/shared/ui/skeleton";

const PublicExternalAgentDetail = dynamic(
    () => import("@/modules/marketplace/agents/external-agents/components/PublicExternalAgentDetail").then((mod) => mod.PublicExternalAgentDetail),
    {
        loading: () => (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
        ),
    }
);

interface PageProps {
    params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
    const { id } = use(params);
    return <PublicExternalAgentDetail id={id} />;
};

export default Page;