"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export const MetricsVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray<HTMLElement>(".metric-bar");

      // Dynamic Numbers - One-time count up then subtle fluctuation
      const stats = { tasks: 1100, accuracy: 92.0 };
      const tasksEl = containerRef.current?.querySelector(".tasks-count");
      const accuracyEl = containerRef.current?.querySelector(".accuracy-count");

      if (tasksEl && accuracyEl) {
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(stats, {
          tasks: 1284,
          accuracy: 98.5,
          duration: 3,
          ease: "power2.out",
          onUpdate: () => {
            tasksEl.textContent = Math.floor(stats.tasks).toLocaleString();
            accuracyEl.textContent = stats.accuracy.toFixed(1) + "%";
          },
        })
          .to({}, { duration: 2 }) // Hold
          .to(stats, {
            tasks: 1250,
            accuracy: 97.2,
            duration: 2,
            ease: "sine.inOut",
            onUpdate: () => {
              tasksEl.textContent = Math.floor(stats.tasks).toLocaleString();
              accuracyEl.textContent = stats.accuracy.toFixed(1) + "%";
            },
          })
          .to({}, { duration: 1 }); // Hold before reset
      }

      // Professional Chart Animation - Sequential growing bars
      gsap.set(bars, { height: "20%" });
      gsap.to(bars, {
        height: (i) => `${60 + (i % 3) * 15}%`,
        duration: 1.5,
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
        ease: "power1.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[260px] h-[180px]">
        {/* Back card */}
        <div className="metric-card absolute left-1/2 -translate-x-1/2 top-0 w-[200px] h-[140px] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" />

        {/* Middle card */}
        <div className="metric-card absolute left-1/2 -translate-x-1/2 top-3 w-[220px] h-[150px] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md" />

        {/* Front card with content */}
        <div className="metric-card absolute left-1/2 -translate-x-1/2 top-6 w-[240px] h-[160px] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-800 dark:text-white">
              Agent Performance
            </span>
            <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
              Live
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-2">
              <div className="text-[9px] text-slate-500 dark:text-slate-400">Tasks Done</div>
              <div className="tasks-count text-sm font-bold text-slate-800 dark:text-white">
                1,284
              </div>
              <div className="text-[8px] text-primary font-medium">+12%</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-2">
              <div className="text-[9px] text-slate-500 dark:text-slate-400">Accuracy</div>
              <div className="accuracy-count text-sm font-bold text-slate-800 dark:text-white">
                98.5%
              </div>
              <div className="text-[8px] text-primary font-medium">+2.3%</div>
            </div>
          </div>

          {/* Mini chart */}
          <div className="flex items-end gap-1 h-[30px]">
            {(() => {
              const CHART_BAR_COUNT = 8;
              return Array.from({ length: CHART_BAR_COUNT }).map((_, i) => (
                <div
                  key={`chart-bar-${i}`}
                  className="metric-bar flex-1 bg-linear-to-t from-primary to-indigo-400 rounded-t"
                  style={{ height: `${40 + (i % 3) * 20}%` }}
                />
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
