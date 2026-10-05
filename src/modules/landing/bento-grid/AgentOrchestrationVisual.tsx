"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export const AgentOrchestrationVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".orchestration-card");
      const items = gsap.utils.toArray<HTMLElement>(".task-item");

      // Floating animation for cards
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Sequential reveal of task items
      gsap.from(items, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.2,
        repeat: -1,
        repeatDelay: 2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center scale-90"
    >
      <div className="relative w-[200px] h-[180px]">
        {/* Back card - tilted left */}
        <div
          className="orchestration-card absolute left-0 top-4 w-[140px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-3"
          style={{ transform: "rotate(-8deg)" }}
        >
          {/* Amber task */}
          <div className="task-item w-full h-[42px] rounded-lg overflow-hidden bg-amber-50 dark:bg-amber-900/20 flex mb-2">
            <div className="w-[3px] bg-amber-500" />
            <div className="p-2 flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-medium text-amber-800 dark:text-amber-400">
                  2:00 PM
                </span>
                <span className="w-4 h-4 rounded-full bg-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white">videocam</span>
                </span>
              </div>
              <div className="text-[10px] font-semibold text-amber-900 dark:text-amber-100">
                Sales Call Review
              </div>
            </div>
          </div>
          {/* Sky task */}
          <div className="task-item w-full h-[52px] rounded-lg overflow-hidden bg-sky-50 dark:bg-sky-900/20 flex">
            <div className="w-[3px] bg-sky-500" />
            <div className="p-2 flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-medium text-sky-800 dark:text-sky-400">
                  3:30 PM
                </span>
              </div>
              <div className="text-[10px] font-semibold text-sky-900 dark:text-sky-100">
                CRM Data Sync
              </div>
              <div className="text-[9px] text-sky-700 dark:text-sky-300 mt-0.5">Auto-triggered</div>
            </div>
          </div>
        </div>

        {/* Front card - tilted right */}
        <div
          className="orchestration-card absolute right-0 top-0 w-[140px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-3"
          style={{ transform: "rotate(5deg)" }}
        >
          {/* Emerald task -> Primary */}
          <div className="task-item w-full h-[42px] rounded-lg overflow-hidden bg-primary/5 dark:bg-primary/10 flex mb-2">
            <div className="w-[3px] bg-primary" />
            <div className="p-2 flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-medium text-primary dark:text-primary/70">
                  Now
                </span>
                <span className="relative flex h-1.5 w-1.5 min-w-[6px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
              </div>
              <div className="text-[10px] font-semibold text-primary dark:text-primary-foreground/90">
                Lead Scoring
              </div>
            </div>
          </div>
          {/* Purple task */}
          <div className="task-item w-full h-[52px] rounded-lg overflow-hidden bg-violet-50 dark:bg-violet-900/20 flex">
            <div className="w-[3px] bg-violet-500" />
            <div className="p-2 flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-medium text-violet-800 dark:text-violet-400">
                  4:00 PM
                </span>
              </div>
              <div className="text-[10px] font-semibold text-violet-900 dark:text-violet-100">
                Analytics Report
              </div>
              <div className="text-[9px] text-violet-700 dark:text-violet-300 mt-0.5">
                5 agents synced
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
