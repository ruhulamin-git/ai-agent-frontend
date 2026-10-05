"use client";

import { SectionContainer } from "@/shared/components";
import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import { agents } from "./data";

export const AgentShowcase = () => {
  const ANIMATION_DELAY_MULTIPLIER = 0.1;

  return (
    <section className="w-full relative overflow-hidden">
      <div className="flex relative z-10">
        {/* <DecorativeStripes />  */}

        {/* Main Content */}
        <div className="flex-1 border-x border-slate-200 dark:border-white/10 py-16 md:py-20 lg:py-24">
          <SectionContainer>
            {/* Section header */}
            <ScrollAnimationWrapper
              animation="fade-up"
              className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            >
              <h2 className="section-title mb-4 md:mb-6">
                Meet The New <span className="text-primary">Digital Team</span>
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Each agent is an expert in their field, ready to deploy instantly. They collaborate,
                share context, and execute complex workflows 24/7.
              </p>
            </ScrollAnimationWrapper>
            {/* Agent cards grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {agents.map((agent, index) => {
                return (
                  <ScrollAnimationWrapper
                    key={agent.id}
                    animation="fade-up"
                    delay={index * ANIMATION_DELAY_MULTIPLIER}
                  >
                    <NeonBlobCursor blobColor="#60a5fa" blobSize={200} intensity={0.3}>
                      <div className="rounded-lg p-4 py-6 transition-all duration-500 overflow-hidden flex flex-col items-center text-center relative border border-white/10 hover:border-primary/40 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm">
                        <div className="relative flex flex-col items-center z-10 w-full">
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-full ${agent.bgColor} border border-primary/20 shadow-lg backdrop-blur-sm flex items-center justify-center mb-3`}
                          >
                            <span className={`material-symbols-outlined text-2xl ${agent.color}`}>
                              {agent.icon}
                            </span>
                          </div>

                          {/* Content */}
                          <h3 className="text-sm font-semibold mb-1 text-slate-900 dark:text-white">
                            {agent.name}
                          </h3>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                            {agent.description}
                          </p>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
                      </div>
                    </NeonBlobCursor>
                  </ScrollAnimationWrapper>
                );
              })}
            </div>
          </SectionContainer>
        </div>
      </div>
    </section>
  );
};
