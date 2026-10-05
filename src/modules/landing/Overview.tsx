"use client";

import Image from "next/image";
import { useState } from "react";

import { AgentKitLogo } from "@/shared/ui/agentkit-logo";

const lifecycleSteps = [
  {
    image: "/images/hero-overview/buy.png",
    title: "Buy",
    description: "Discover & purchase agents",
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    image: "/images/hero-overview/agent.png",
    title: "Create",
    description: "Build custom agents",
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    image: "/images/hero-overview/publish.png",
    title: "Publish",
    description: "Deploy to marketplace",
    color: "from-green-500 to-emerald-500",
    textColor: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  {
    image: "/images/hero-overview/earn.png",
    title: "Earn",
    description: "Generate revenue",
    color: "from-yellow-500 to-orange-500",
    textColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
];

export const AgentPlatformComponent = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className="relative">
      {/* Main rounded container */}
      <div className="relative p-8 overflow-hidden">
        {/* Circular Lifecycle Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Outer ring */}
          <div className="relative w-72 h-74 md:w-80 md:h-86 mx-auto">
            {/* Steps positioned in a circle */}
            {lifecycleSteps.map((step, index) => {
              const angle = (index * 90 - 90) * (Math.PI / 180);
              const radius = 38; // percentage from center
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <div
                  key={step.title}
                  className="absolute z-10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div
                    className="relative flex flex-col items-center text-center transition-transform duration-300 p-4 -m-4"
                    style={{
                      transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Step Circle */}
                    <div
                      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-md border-primary/50 border flex items-center justify-center`}
                    >
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={48}
                        height={48}
                        className="w-8 h-8 md:w-9 md:h-9"
                      />

                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 rounded-full border border-primary bg-gray-950 text-[9px] md:text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-1.5">
                      <h4 className="font-semibold text-[10px] md:text-xs text-slate-900 dark:text-white mb-0.5 hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h4>
                      <p className="text-[9px] md:text-[10px] text-slate-600 dark:text-slate-400 leading-tight max-w-[70px] md:max-w-[90px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 md:w-28 md:h-28 rounded-lg bg-primary/10 border border-primary/50 flex items-center justify-center">
                  <AgentKitLogo size="lg" showText={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
