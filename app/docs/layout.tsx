"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ExternalLink } from "lucide-react";
import { DocsSidebar } from "@/modules/docs/components/DocsSidebar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AgentKitLogo } from "@/shared/ui/agentkit-logo";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-[#030712] text-foreground flex flex-col selection:bg-teal-500/20 selection:text-teal-200">
        {/* Dedicated Docs Topbar Header (No Parent Landing Header) */}
        <header className="sticky top-0 z-40 h-14 bg-[#030712]/90 backdrop-blur-md border-b border-gray-800/80">
          <div className="max-w-[1600px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
            {/* Left: Mobile Toggle + Logo + Docs Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                aria-label="Toggle documentation navigation"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
                <AgentKitLogo size="sm" />
              </Link>

              <span className="text-gray-700 select-none">/</span>

              <Link
                href="/docs"
                className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-teal-300 transition-colors"
              >
                <span>Docs</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  v1.0
                </span>
              </Link>
            </div>

            {/* Right: Quick Links + Back to App */}
            <div className="flex items-center gap-3 sm:gap-5">
              <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-400">
                <Link
                  href="/marketplace"
                  className="hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="/start-building"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>AI Builder</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Support
                </Link>
              </nav>

              <div className="hidden sm:block h-3.5 w-px bg-gray-800" />

              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all flex items-center gap-1.5"
              >
                <span>Main App</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-[1600px] w-full mx-auto flex flex-1">
          {/* Desktop Sticky Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 border-r border-gray-800/80 sticky top-14 h-[calc(100vh-56px)]">
            <DocsSidebar />
          </div>

          {/* Mobile Slide-over Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
              <div className="w-80 max-w-[85vw] h-full bg-[#030712] border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AgentKitLogo size="sm" />
                    <span className="text-xs font-semibold text-white">Docs Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <DocsSidebar onItemClick={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Docs Body (No Parent Landing Footer) */}
          <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-10 flex flex-col justify-between">
            <div>{children}</div>

            {/* Subtle, Clean Docs Footer */}
            <footer className="mt-16 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
              <p>© {new Date().getFullYear()} AI Agent Platform. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/contact" className="hover:text-gray-300 transition-colors">
                  Need Help?
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-300 transition-colors">
                  Terms
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
