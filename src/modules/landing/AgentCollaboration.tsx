"use client";

import { agents } from "./data";

export const AgentCollaboration = () => {
  return (
    <section className="relative w-full overflow-hidden py-24 lg:py-32">
      {/* Main Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
            <span className="font-serif italic text-indigo-400">Agents</span> that work as one.{" "}
            <br className="hidden sm:block" />
            <span className="font-light">No more silos.</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
            Your team runs on AI agents that share context, built around unified memory that lives
            across your entire workflow.
          </p>
        </div>

        {/* Agent Cards - Glass Panel Style */}
        <div className="border border-black/5 dark:border-white/10 rounded-xl p-6 md:p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {/* Agent Icon */}
                <div className="mb-4">
                  <span
                    className={`material-symbols-outlined text-4xl md:text-5xl bg-linear-to-r ${agent.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}
                  >
                    {agent.icon}
                  </span>
                </div>

                {/* Agent Name */}
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 text-center group-hover:text-slate-900 group-hover:dark:text-white transition-colors">
                  {agent.name}
                </span>

                {/* Active Indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs">✓</span>
                  <span>Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-6 md:mt-8 p-4 md:p-5 rounded-xl bg-primary/5 dark:bg-slate-800 border border-primary/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-lg">🔗</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
                    Unified Memory Layer
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-500">
                    All agents connected in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-green-300">SYNCED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
