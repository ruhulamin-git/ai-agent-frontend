"use client";

import dynamic from "next/dynamic";
import React from "react";

const CanvasV2 = dynamic(() => import("@/modules/ai-builder/views/agentflowsv2/Canvas"), { ssr: false });

const AgentCanvasIdPage = () => <CanvasV2 />;

export default AgentCanvasIdPage;
