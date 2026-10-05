"use client";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { AgentCard } from "@/modules/newmarketplace/components/AgentCard";
import { useUIAgents } from "@/modules/newmarketplace/service/hooks";
import { SectionContainer } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";
import { Skeleton } from "@/shared/ui/skeleton";

export const TopRatedAgents = () => {
  // Fetch top-rated agents (limit to 6 for the landing page)
  const {
    data: agents = [],
    isLoading,
    isError,
  } = useUIAgents(
    {}, // No specific filters
    { page: 1, page_size: 6 } // Limit to 6 agents for landing page
  );

  return (
    <SectionContainer>
      {/* Section header */}
      <ScrollAnimationWrapper
        animation="fade-up"
        className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
      >
        <h2 className="section-title mb-4 md:mb-6">
          Top Rated <span className="text-primary">AI Agents</span>
        </h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Discover our highest-performing agents, trusted by thousands of businesses worldwide
        </p>
      </ScrollAnimationWrapper>

      {/* Agent cards grid */}
      <ScrollAnimationWrapper animation="fade-up" delay={0.2}>
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative w-full h-full min-h-[380px] rounded-xl p-4 flex flex-col border border-white/10 bg-gray-900/50 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-6">
                  <Skeleton className="w-16 h-16 rounded-lg bg-gray-800/50" />
                  <Skeleton className="w-20 h-7 rounded-full bg-gray-800/50" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <Skeleton className="h-7 w-3/4 bg-gray-800/50" />
                    <Skeleton className="h-6 w-20 bg-gray-800/50" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full bg-gray-800/50" />
                    <Skeleton className="h-4 w-2/3 bg-gray-800/50" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-3 w-10 bg-gray-800/50" />
                    <Skeleton className="h-3 w-12 bg-gray-800/50" />
                    <Skeleton className="h-3 w-20 bg-gray-800/50" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Skeleton className="h-7 w-20 bg-gray-800/50" />
                    <Skeleton className="h-7 w-16 bg-gray-800/50" />
                    <Skeleton className="h-7 w-24 bg-gray-800/50" />
                  </div>
                  <Skeleton className="mt-auto h-10 w-full rounded-md bg-gray-800/50" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No response from server</h3>
            <p className="text-slate-400 max-w-xs mx-auto">
              We are having trouble connecting to our servers. Please try again later.
            </p>
          </div>
        ) : (
          // Agent cards
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {agents
              .sort((a, b) => b.rating - a.rating)
              .map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
          </div>
        )}
      </ScrollAnimationWrapper>

      {/* CTA Button */}
      <ScrollAnimationWrapper animation="fade-up" delay={0.4}>
        <div className="text-center mt-12 md:mt-16">
          <Button
            size="lg"
            asChild
            className="px-4 md:px-6 lg:px-8 py-3 md:py-3 bg-primary text-black font-semibold rounded-md shadow-xl hover:brightness-110 transition-all duration-300 group text-sm md:text-base"
          >
            <Link href="/marketplace" className="flex items-center justify-center gap-3">
              Browse All Agents
              <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </Button>
        </div>
      </ScrollAnimationWrapper>
    </SectionContainer>
  );
};
