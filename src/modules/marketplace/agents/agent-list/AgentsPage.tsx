"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { ErrorState } from "@/shared/components";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import { AgentCard } from "./components";
import { useAgentsData } from "./hooks";

import type { Category } from "../shared/types";

const categories: Category[] = ["All", "internal", "user_created"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Workaround for React 19 types compatibility with framer-motion v10
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as React.ComponentType<any>;

export const AgentsPage = () => {
  const {
    agents: filteredAgents,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    category,
    setCategory,
  } = useAgentsData({ isPublic: true });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-background">
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <ErrorState
            title="Marketplace Unavailable"
            message="We're having trouble loading the AI workforce. Please check your connection or try again."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 pt-16 md:pt-20 lg:pt-24 pb-6 md:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <ScrollAnimationWrapper animation="fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    AI Workforce Marketplace
                  </span>
                </div>
              </ScrollAnimationWrapper>

              {/* Main Heading */}
              <ScrollAnimationWrapper animation="fade-up" delay={0.1}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6">
                  Discover your new{" "}
                  <span className="font-serif italic text-primary">AI workforce</span>
                </h1>
              </ScrollAnimationWrapper>

              {/* Description */}
              <ScrollAnimationWrapper animation="fade-up" delay={0.2}>
                <p className="text-base md:text-lg lg:text-xl text-slate-400 dark:text-slate-400 font-light leading-relaxed mb-12 max-w-3xl mx-auto">
                  Deploy specialized AI agents to automate your sales, support, and operations. Each
                  agent is an expert in their field, ready to work 24/7 with zero downtime.
                </p>
              </ScrollAnimationWrapper>

              {/* Search Bar with Glass Effect */}
              <ScrollAnimationWrapper animation="fade-up" delay={0.3}>
                <div className="relative max-w-2xl mx-auto mb-10">
                  <div
                    className="relative rounded-xl p-1 border border-white/10 hover:border-primary/30 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.03) 100%)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    }}
                  >
                    <div className="relative flex items-center">
                      <Search className="absolute left-5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by role, skill, or name..."
                        className="w-full h-14 pl-14 pr-6 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>

              {/* Filter Categories */}
              <ScrollAnimationWrapper animation="fade-up" delay={0.4}>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        category === cat
                          ? "bg-primary text-black shadow-lg shadow-primary/25 scale-105"
                          : "glass-panel border border-white/10 text-slate-400 hover:border-primary/40 hover:text-white"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative w-full overflow-hidden">
        <div className="flex relative z-10">
          <div className="flex-1 border-x border-slate-200 dark:border-white/10 py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <MotionDiv
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredAgents.map((agent, index) => {
                  const ANIMATION_DELAY_STEP = 0.1;
                  return (
                    <ScrollAnimationWrapper
                      key={agent.id}
                      animation="fade-up"
                      delay={index * ANIMATION_DELAY_STEP}
                    >
                      <MotionDiv variants={item}>
                        <AgentCard agent={agent} isPublic />
                      </MotionDiv>
                    </ScrollAnimationWrapper>
                  );
                })}
              </MotionDiv>

              {/* Empty State */}
              {filteredAgents.length === 0 && (
                <ScrollAnimationWrapper animation="fade-up">
                  <div className="text-center py-20">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl mb-6 border border-white/10">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      No agents found
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed max-w-md mx-auto mb-8">
                      We couldn&apos;t find any agents matching your search criteria. Try using
                      different keywords or clearing your filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                      className="px-6 py-3 rounded-xl glass-panel border border-white/10 text-sm font-medium text-white hover:border-primary/40 hover:bg-white/5 transition-all duration-300"
                    >
                      Clear all filters
                    </button>
                  </div>
                </ScrollAnimationWrapper>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
