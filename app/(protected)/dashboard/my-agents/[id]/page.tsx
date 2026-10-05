"use client";

import dynamic from "next/dynamic";

import { UserAgentDetailSkeleton } from "@/modules/marketplace/agents/user-agents/web-agent/chat";

// Lazy load module component
const UserAgentDetail = dynamic(
  () =>
    import("@/modules/marketplace/agents/user-agents/web-agent/chat").then(
      (mod) => mod.UserAgentDetail
    ),
  { loading: () => <UserAgentDetailSkeleton /> }
);

const MyAgentDetailPage = () => {
  return <UserAgentDetail />;
};

export default MyAgentDetailPage;
