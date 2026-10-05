"use client";

import React from "react";

import { AiBuilderProvider } from "@/modules/ai-builder/AiBuilderProvider";

/** Redux + MUI theme for all ai-builder routes. Per Flowise, canvas uses MinimalLayout (no shell); list pages add MainLayout in their own layout.tsx. */
const AiBuilderLayout = ({ children }: { children: React.ReactNode }) => (
  <AiBuilderProvider>{children}</AiBuilderProvider>
);

export default AiBuilderLayout;
