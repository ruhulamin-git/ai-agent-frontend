import { DollarSign, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";

import { AgentAvatar } from "../../shared/components/AgentAvatar";

import type { Agent } from "../../shared/types";

interface AgentHeroProps {
  agent: Agent;
}

export const AgentHero = ({ agent }: AgentHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-background  pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Icon with animated gradient background */}
          <div className="mb-8">
            <AgentAvatar agent={agent} size="lg" className="animate-fade-in-up" />
          </div>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {agent.category} • Active
          </div>

          {/* Title */}
          <h1 className="mb-4 text-5xl font-semibold tracking-tight text-slate-900 dark:text-foreground sm:text-6xl lg:text-7xl animate-fade-in-up [animation-delay:100ms]">
            {agent.name}
          </h1>

          {/* Role */}
          <p className="mb-4 text-2xl font-medium text-primary animate-fade-in-up [animation-delay:200ms]">
            {agent.role}
          </p>

          {/* Owner, Price and Sales */}
          <div className="flex flex-col sm:flex-row md:gap-4 lg:gap-6 justify-around">
            <p className="lg:mb-2 max-w-3xl text-lg font-semibold text-slate-600 dark:text-muted-foreground leading-relaxed flex items-center gap-1">
              <User className="w-5 h-5 text-primary" />
              Owner: Devxhub
            </p>
            <p className="lg:mb-2 max-w-3xl text-lg font-semibold text-slate-600 dark:text-muted-foreground leading-relaxed flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-primary" />
              Price: $49
            </p>
            <p className="mb-2 max-w-3xl text-lg font-semibold text-slate-600 dark:text-muted-foreground leading-relaxed flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Total Sales: 166
            </p>
          </div>

          {/* Description */}
          <p className="mb-10 max-w-3xl text-xl text-slate-600 dark:text-muted-foreground leading-relaxed animate-fade-in-up [animation-delay:300ms]">
            {agent.longDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:400ms]">
            <Button
              size="lg"
              className="px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
              asChild
            >
              <Link href="/auth/register">
                <span className="material-symbols-outlined text-base mr-2">play_arrow</span>
                Deploy {agent.name}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-base mr-2">description</span>
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b ${agent.bgColor} to-transparent opacity-40 blur-3xl pointer-events-none -z-10`}
      />
    </div>
  );
};
