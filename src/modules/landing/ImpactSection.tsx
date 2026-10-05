"use client";

const impacts = [
  {
    value: "24/7",
    label: "Always On",
    description: "Agents never sleep, ensuring zero downtime for your customers.",
    icon: "schedule",
  },
  {
    value: "10x",
    label: "Faster Execution",
    description: "Complex workflows automated in seconds, not hours.",
    icon: "bolt",
  },
  {
    value: "60%",
    label: "Cost Reduction",
    description: "Scale operations efficiently without linear headcount growth.",
    icon: "trending_down",
  },
  {
    value: "100%",
    label: "Consistency",
    description: "Eliminate human error with precise, rule-based execution.",
    icon: "verified",
  },
];

export const ImpactSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-24 border-y border-slate-200 dark:border-white/10">
      {/* Main Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
            <span className="font-serif italic text-indigo-400">Scale</span> your workforce,{" "}
            <span className="font-light">instantly</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
            Deploy intelligent agents that work alongside your team to maximize efficiency and drive
            growth from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {impacts.map((item) => (
            <div
              key={item.label}
              className="group relative flex flex-col p-6 md:p-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">
                  {item.icon}
                </span>
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                {item.value}
              </div>

              {/* Label */}
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-900 group-hover:dark:text-white transition-colors">
                {item.label}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                {item.description}
              </p>

              {/* Bottom Accent Line */}
              <div className="mt-6 h-1 w-12 bg-primary/30 rounded-full group-hover:w-full group-hover:bg-primary transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
