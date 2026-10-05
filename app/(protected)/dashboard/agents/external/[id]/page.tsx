"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { PageContainer } from "@/shared/components";

const ExternalAgentDetail = dynamic(
    () =>
        import("@/modules/marketplace/agents/external-agents/components/ExternalAgentDetail").then(
            (mod) => mod.ExternalAgentDetail
        ),
    {
        loading: () => <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-96 rounded-xl" />,
    }
);

const Page = () => {
    const { t } = useTranslation();
    const params = useParams();
    const id = params?.id as string;

    return (
        <PageContainer title={t("navigation.agents")} description={t("pages.agents.page_description")}>
            <ExternalAgentDetail id={id} />
        </PageContainer>
    );
};

export default Page;