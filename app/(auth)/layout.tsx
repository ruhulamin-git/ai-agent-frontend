"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { AgentKitLogo } from "@/shared/ui/agentkit-logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-gray-950 text-foreground relative">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4">
          <div className="mb-8">
            <AgentKitLogo size="lg" />
          </div>
          <div className="w-full max-w-125 bg-[#161b22]/80 dark:bg-[#161b22]/90 rounded-xl shadow-2xl border border-slate-800/60 p-8 md:p-10 backdrop-blur-sm hover:border-slate-700/80 transition-all duration-300">
            {children}
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
};

export default AuthLayout;
