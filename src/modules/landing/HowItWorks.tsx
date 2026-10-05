"use client";

import { IconDownload, IconSearch, IconTrendingUp } from "@tabler/icons-react";

import { SectionContainer } from "@/shared/components";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

const steps = [
  {
    icon: IconSearch,
    title: "Discover",
    description: "Browse and explore 2000+ AI agents tailored to your needs",
    bgColor: "bg-primary/10",
    color: "white",
  },
  {
    icon: IconDownload,
    title: "Install",
    description: "Seamlessly integrate agents into your workflow with one click",
    bgColor: "bg-primary/10",
    color: "white",
  },
  {
    icon: IconTrendingUp,
    title: "Track",
    description: "Monitor performance and optimize your AI agent experience",
    bgColor: "bg-primary/10",
    color: "white",
  },
];

export const HowItWorks = () => {
  return (
    <section className="w-full py-12">
      <SectionContainer>
        {/* Header */}
        <ScrollAnimationWrapper animation="fade-up" className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="section-title mb-4">
            How <span className="text-primary">Marketplace</span> Works
          </h2>
          <p className="section-subtitle">
            Get started with AI agents Marketplace in three simple steps
          </p>
        </ScrollAnimationWrapper>

        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <ScrollAnimationWrapper key={step.title} animation="fade-up" delay={0.2 + index * 0.1}>
              <div className="flex flex-col items-center text-center p-6 md:p-8 group">
                {/* Icon with Step Number Badge */}
                <div className="relative mb-5">
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 shadow-lg shadow-primary/50`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border border-primary bg-black text-primary text-[10px] md:text-xs font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 transition-all duration-300 group-hover:text-blue-400 dark:group-hover:text-blue-400 group-hover:scale-105">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};
