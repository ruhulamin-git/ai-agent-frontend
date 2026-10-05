"use client";

import { useState } from "react";

import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

const features = [
  {
    title: "Multi-Agent Orchestration",
    description:
      "Connect specialized agents to work together as a unified digital workforce, sharing context and tasks.",
    icon: "hub",
    color: "from-blue-500/20 to-blue-500/5",
    stat: "12 Agents",
    metric: "Active",
  },
  {
    title: "Intelligent Workflows",
    description:
      "Automate complex business processes with logic-based routing and conditional execution paths.",
    icon: "account_tree",
    color: "from-purple-500/20 to-purple-500/5",
    stat: "2.4K",
    metric: "Workflows",
  },
  {
    title: "Real-time Analytics",
    description:
      "Monitor agent performance, task completion rates, and ROI with granular, real-time dashboards.",
    icon: "monitoring",
    color: "from-green-500/20 to-green-500/5",
    stat: "99.8%",
    metric: "Success Rate",
  },
  {
    title: "Seamless Integration",
    description:
      "Connect with your existing tools like Slack, Salesforce, and HubSpot in just a few clicks.",
    icon: "integration_instructions",
    color: "from-orange-500/20 to-orange-500/5",
    stat: "24+",
    metric: "Integrations",
  },
  {
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and SOC2 compliant infrastructure to keep your data safe and secure.",
    icon: "verified_user",
    color: "from-red-500/20 to-red-500/5",
    stat: "SOC2",
    metric: "Certified",
  },
  {
    title: "24/7 Availability",
    description:
      "Your digital agents never sleep, ensuring instant responses and continuous operation around the clock.",
    icon: "schedule",
    color: "from-primary/20 to-primary/5",
    stat: "100%",
    metric: "Uptime",
  },
];

const EFFICIENCY_MAX = 100;
const TASKS_MAX = 50;
const HOURS_MAX = 24;
const PERFORMANCE_MIN = 85;
const PERFORMANCE_RANGE = 15;

export const InteractiveFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Generate stable random values per feature using seeded pseudo-random
  const getStableRandom = (seed: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const stats = {
    efficiency: getStableRandom(activeFeature * 1, EFFICIENCY_MAX),
    tasks: getStableRandom(activeFeature * 2, TASKS_MAX),
    hours: getStableRandom(activeFeature * 3, HOURS_MAX),
    performance: PERFORMANCE_MIN + getStableRandom(activeFeature * 4, PERFORMANCE_RANGE),
  };

  return (
    <section className="w-full relative overflow-hidden border-y border-slate-200 dark:border-white/10">
      <div className="relative z-10 py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ScrollAnimationWrapper
            animation="fade-up"
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6">
              Everything you need to <span className="font-serif italic text-indigo-400">scale</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Powerful features designed to help you automate operations and grow your business
              faster.
            </p>
          </ScrollAnimationWrapper>

          {/* Dashboard Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Feature List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <button
                  key={feature.title}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 ${activeFeature === index
                    ? "bg-slate-50 dark:bg-slate-800 border-primary/40 shadow-lg shadow-primary/10"
                    : "bg-transparent dark:bg-slate-900 border-black/5 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800 hover:border-black/10 dark:hover:border-white/10"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center border border-white/10 flex-shrink-0`}
                    >
                      <span className="material-symbols-outlined text-xl text-white">
                        {feature.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base md:text-lg font-bold mb-1 transition-colors ${activeFeature === index
                          ? "text-indigo-400"
                          : "text-slate-900 dark:text-white"
                          }`}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-light line-clamp-1">
                        {feature.description}
                      </p>
                    </div>
                    {/* <span
                      className={`material-symbols-outlined text-xl transition-all ${activeFeature === index ? "text-primary rotate-90" : "text-slate-600"
                        }`}
                    >
                      chevron_right
                    </span> */}
                    <span
                      className={`material-symbols-outlined text-xl transition-all duration-300 ${activeFeature === index
                        ? "text-indigo-400 rotate-90"
                        : "text-slate-600 rotate-0"
                        }`}
                    >
                      {activeFeature === index ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Dashboard Preview */}
            <div className="relative">
              <ScrollAnimationWrapper animation="fade-up" delay={0.2}>
                <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                  {/* Dashboard Container */}
                  <div className="rounded-2xl p-6 md:p-8 min-h-[500px] flex flex-col relative overflow-hidden bg-white/50 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none border border-black/10 dark:border-white/10 shadow-xl dark:shadow-none">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {features[activeFeature].title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Live Dashboard</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                        </span>
                        <span className="text-xs font-bold text-green-300">LIVE</span>
                      </div>
                    </div>

                    {/* Main Stat */}
                    <div className="mb-8">
                      <div className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-2">
                        {features[activeFeature].stat}
                      </div>
                      <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {features[activeFeature].metric}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed mb-8">
                      {features[activeFeature].description}
                    </p>

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-auto">
                      <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-4 border border-black/5 dark:border-white/10">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {stats.efficiency}%
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Efficiency</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-4 border border-black/5 dark:border-white/10">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {stats.tasks}K
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Tasks</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-4 border border-black/5 dark:border-white/10">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {stats.hours}h
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Saved</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Performance
                        </span>
                        <span className="text-xs text-indigo-400 font-bold">{stats.performance}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                          style={{ width: `${stats.performance}%` }}
                        />
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 transition-opacity duration-500" />
                  </div>
                </NeonBlobCursor>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
