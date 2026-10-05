import React from "react";
import Link from "next/link";
import {
  Rocket,
  Globe,
  Layers,
  ShoppingBag,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Documentation & Developer Hub | Dual-Role AI Agent Marketplace",
  description: "Comprehensive guides for the Dual-Role AI Agent Marketplace (Chatflow-Only) MVP V1: Unified Account, Consumer Experience, Chatflow Builder, and SaaS Tiers.",
};

export default function DocsLandingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-6 sm:p-10 border border-gray-800 bg-gradient-to-br from-gray-900/90 via-gray-950 to-gray-900/40 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Role AI Agent Marketplace — MVP V1</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Unified Account. Consumer & Creator Power.
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Operate seamlessly as both a Normal User (Consumer) and a Developer (Creator). Browse and subscribe to Chatflow agents via Stripe, or build visual conversation flows, save drafts, and submit to the Admin Approval Queue for monetization.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started/dual-role-architecture"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors shadow-lg shadow-teal-500/20"
            >
              <Users className="w-4 h-4" />
              <span>Dual-Role Architecture</span>
            </Link>
            <Link
              href="/docs/getting-started/quickstart"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700/80 rounded-lg transition-colors"
            >
              <Rocket className="w-4 h-4 text-teal-400" />
              <span>Chatflow Quickstart</span>
            </Link>
            <Link
              href="/docs/marketplace/user-subscriptions"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700/80 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Marketplace & Subscriptions</span>
            </Link>
            <Link
              href="/docs/marketplace/developer-tiers"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Developer SaaS Tiers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dual Role Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Normal User (Consumer Mode)</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Discover and hire verified, live Chatflow agents. Inspect capabilities and pricing, complete Stripe subscription checkout, start immediate chat sessions, and embed widgets onto your website.
          </p>
          <div className="pt-2 flex flex-col gap-2 text-xs">
            <Link
              href="/docs/marketplace/user-subscriptions"
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1.5"
            >
              <span>• Marketplace Browsing & Stripe Subscription Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/docs/deployment/embed-chat-widget"
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1.5"
            >
              <span>• Embed Subscribed Agents on Third-Party Websites</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Developer (Creator Mode)</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Build strictly Chatflow Agents on the visual canvas. Test live in the built-in Test Chat interface, save drafts to your Agent Library, configure monetization, and submit to the Admin Approval Queue.
          </p>
          <div className="pt-2 flex flex-col gap-2 text-xs">
            <Link
              href="/docs/ai-builder/visual-builder"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>• Chatflow Canvas, Test Chat & Draft Lifecycle</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/docs/marketplace/publishing-agents"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>• Monetization Settings & Admin Approval Queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/docs/marketplace/developer-tiers"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>• Developer Tiers: Free (1), Basic (3), Pro (10)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Directory of Topics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <span>Documentation Directory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Getting Started */}
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Rocket className="w-4 h-4 text-teal-400" />
              <span>Getting Started</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs/getting-started/overview"
                  className="text-gray-300 hover:text-teal-300 transition-colors flex items-center justify-between"
                >
                  <span>Dual-Role Overview (MVP V1)</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/getting-started/dual-role-architecture"
                  className="text-gray-300 hover:text-teal-300 transition-colors flex items-center justify-between"
                >
                  <span>Dual-Role Architecture & Modes</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/getting-started/quickstart"
                  className="text-gray-300 hover:text-teal-300 transition-colors flex items-center justify-between"
                >
                  <span>5-Minute Chatflow Quickstart</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Normal User (User Mode) */}
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Normal User (User Mode)</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs/marketplace/user-subscriptions"
                  className="text-gray-300 hover:text-teal-300 transition-colors flex items-center justify-between"
                >
                  <span>Marketplace Browsing & Stripe</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/deployment/embed-chat-widget"
                  className="text-gray-300 hover:text-teal-300 transition-colors flex items-center justify-between"
                >
                  <span>Subscribed Agents & Website Embed</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developer (Developer Mode) */}
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Developer (Developer Mode)</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/docs/ai-builder/visual-builder"
                  className="text-gray-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                >
                  <span>Chatflow Canvas & Test Chat</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/marketplace/publishing-agents"
                  className="text-gray-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                >
                  <span>Monetization & Admin Approval</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/marketplace/developer-tiers"
                  className="text-gray-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                >
                  <span>Developer SaaS Tiers (Free/Basic/Pro)</span>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
