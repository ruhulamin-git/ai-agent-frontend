"use client";

import {
  IconCurrencyDollar,
  IconDeviceAnalytics,
  IconRobot,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionContainer } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { IntegrationLogo } from "@/shared/ui/integration-logos";

import { AgentPlatformComponent } from "./Overview";

const socialPlatforms = ["Slack", "Facebook", "Instagram", "Twitter", "LinkedIn", "Gmail"];

const badgeItems = [
  { text: "2,000+ Agents", icon: IconRobot },
  { text: "AI Marketplace", icon: IconShoppingBag },
  { text: "Deploy Instantly", icon: IconDeviceAnalytics },
  { text: "Earn Revenue", icon: IconCurrencyDollar },
];

export const HeroSection = () => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBadgeIndex((prev) => (prev + 1) % badgeItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-full overflow-hidden">
      {/* Main Hero Section */}
      <main className="relative z-10 w-full py-6 md:py-10 lg:py-14">
        <SectionContainer className="grid lg:grid-cols-2 gap-2 md:gap-5 lg:gap-5 items-center">
          {/* Hero Content */}
          <div className="space-y-4 md:space-y-5 lg:space-y-6 text-center md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center mt-4 md:mt-0 gap-2 px-10 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              {badgeItems.map((item, index) => (
                <div
                  key={item.text}
                  className={`flex items-center gap-1.5 transition-all duration-500 ${
                    index === currentBadgeIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 absolute"
                  }`}
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">{item.text}</span>
                </div>
              ))}
            </div>

            <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-semibold leading-[1.1] tracking-tight">
              <span className="font-serif ai-robotic-gradient">
                AI <br />{" "}
              </span>{" "}
              Marketplace <br />
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300  leading-relaxed">
              We deliver custom AI Agent. Browse 2000+ AI Agents or publish your own and earn upto
              70% of every sale.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-2 md:pt-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto px-8 md:px-10 lg:px-8 py-4 md:py-5 gold-gradient text-black font-medium rounded-md shadow-xl hover:brightness-110 transition-all duration-300 group text-sm"
              >
                <Link href="/marketplace" className="flex items-center justify-center gap-3">
                  Explore Agents
                  <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto px-8 md:px-10 lg:px-8 py-4 md:py-5 bg-transparent border border-primary text-primary font-medium rounded-md shadow-xl hover:brightness-110 hover:text-black transition-all duration-300 group text-sm"
              >
                <Link href="/start-building" className="flex items-center justify-center gap-3">
                  Start Building
                  <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                    <IconRobot className="w-5 h-5 md:w-6 md:h-6" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Status Bar */}
            <div className="flex justify-center md:justify-start items-center gap-6 pt-2 xl:pt-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Active Platform
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">2,000+</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Agents</span>
              </div>
            </div>
          </div>

          {/* Overview Platform  Visualization */}
          <div className="relative group mt-8 lg:mt-0">
            {/* Decorative back elements */}
            <div
              className="absolute inset-0 bg-indigo-700/50 blur-[80px] md:blur-[70px] rounded-full -z-10 animate-pulse"
              style={{ animationDuration: "4s" }}
            />

            <AgentPlatformComponent />
          </div>
        </SectionContainer>

        {/* Integration Logos Section - Separate from Card */}
        <div className="mt-5 md:mt-10 flex flex-col items-center gap-3 md:gap-4">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 text-center">
            Seamless Integration With
          </p>
          <div
            className="relative w-full max-w-150 md:max-w-187.5 lg:max-w-225 overflow-hidden mx-auto py-2"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex animate-marquee">
              {[...socialPlatforms, ...socialPlatforms, ...socialPlatforms].map(
                (platform, index) => (
                  <div
                    key={platform + index}
                    className="mx-3 md:mx-4 p-2 md:p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-primary/40 transition-all duration-300 hover:scale-105 shrink-0"
                  >
                    <IntegrationLogo name={platform} size={22} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
