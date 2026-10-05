"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import type { ReactNode } from "react";

/** Root-level Emotion cache for MUI + Next App Router so SSR style order matches the client (fixes hydration under nested layouts). */
export function MuiAppRouterCache({ children }: { children: ReactNode }) {
  return <AppRouterCacheProvider options={{ key: "mui" }}>{children}</AppRouterCacheProvider>;
}
