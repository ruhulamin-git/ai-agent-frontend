"use client";

import React from "react";

import MainLayout from "@/modules/ai-builder/layout/MainLayout";

const AiBuilderToolsLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

export default AiBuilderToolsLayout;
