"use client";

import React from "react";

import { Toaster } from "sonner";

import { ThemeProvider } from "@/providers/ThemeProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="newdashboard-theme" disableTransitionOnChange>
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
};

export default RootLayout;
