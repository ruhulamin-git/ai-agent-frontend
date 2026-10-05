"use client";

import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import {
  AgentOrchestrationVisual,
  IntegrationVisual,
  MetricsVisual,
  WorkInSyncVisual,
} from "./bento-grid";

export const BentoGridSection = () => {
  return (
    <section className="w-full bg-white dark:bg-background relative overflow-hidden border-y border-slate-200 dark:border-white/10">
      <div className="flex relative z-10">
        {/* <DecorativeStripes /> */}

        <div className="flex-1 border-x border-slate-200 dark:border-white/10 py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <ScrollAnimationWrapper
              animation="fade-up"
              className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6">
                Built for absolute <span className="font-serif italic text-primary">clarity</span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Stay focused with AI agents that organize, connect and turn information into
                confident decisions.
              </p>
            </ScrollAnimationWrapper>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Top Left - Smart Agent Orchestration */}
              <ScrollAnimationWrapper
                animation="fade-up"
                delay={0.1}
                className="p-6 md:p-8 lg:p-10 flex flex-col gap-6"
              >
                <div className="mb-2">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Smart. Simple. Brilliant.
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    Your agent tasks are beautifully organized so you see everything clearly without
                    the clutter.
                  </p>
                </div>
                <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                  <div className="relative w-full h-[220px] sm:h-[280px] rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black/40 border border-black/5 dark:border-white/5">
                    <AgentOrchestrationVisual />
                  </div>
                </NeonBlobCursor>
              </ScrollAnimationWrapper>

              {/* Top Right - Work in sync */}
              <ScrollAnimationWrapper
                animation="fade-up"
                delay={0.2}
                className="p-6 md:p-8 lg:p-10  flex flex-col gap-6"
              >
                <div className="mb-2">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Your agents, in sync
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    Every update flows instantly across your AI team and keeps collaboration
                    effortless and fast.
                  </p>
                </div>
                <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                  <div className="relative w-full h-[220px] sm:h-[280px] rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black/40 border border-black/5 dark:border-white/5">
                    <WorkInSyncVisual />
                  </div>
                </NeonBlobCursor>
              </ScrollAnimationWrapper>

              {/* Bottom Left - Effortless integration */}
              <ScrollAnimationWrapper
                animation="fade-up"
                delay={0.3}
                className="p-6 md:p-8 lg:p-10  flex flex-col gap-6"
              >
                <div className="mb-2">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Effortless integration
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    All your favorite tools connect in one place and work together seamlessly by
                    design.
                  </p>
                </div>
                <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                  <div className="relative w-full h-[220px] sm:h-[280px] rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black/40 border border-black/5 dark:border-white/5">
                    <IntegrationVisual />
                  </div>
                </NeonBlobCursor>
              </ScrollAnimationWrapper>

              {/* Bottom Right - Numbers that speak */}
              <ScrollAnimationWrapper
                animation="fade-up"
                delay={0.4}
                className="p-6 md:p-8 lg:p-10 flex flex-col gap-6"
              >
                <div className="mb-2">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Metrics that matter
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    Track AI performance with precision and turn raw data into confident decisions
                    you can trust.
                  </p>
                </div>
                <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                  <div className="relative w-full h-[220px] sm:h-[280px] rounded-lg flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black/40 border border-black/5 dark:border-white/5">
                    <MetricsVisual />
                  </div>
                </NeonBlobCursor>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>

        {/* <DecorativeStripesRight /> */}
      </div>
    </section>
  );
};
