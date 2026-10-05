"use client";

import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

import { agents } from "./data";

export const FeaturesGrid = () => {
  const features = [
    {
      title: "Multi-Agent Orchestration",
      description:
        "Multiple AI agents work together in real-time, communicating and collaborating like a unified team.",
      icon: "hub",
      gradient: "from-primary to-indigo-500",
    },
    {
      title: "Intelligent Workflows",
      description:
        "Automated task handoffs between agents. When one completes, the next begins automatically.",
      icon: "conversion_path",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Real-Time Analytics",
      description:
        "AI-powered insights and predictions from your Analytics Agent, tracking every KPI.",
      icon: "insights",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Seamless Integrations",
      description:
        "Connect with Slack, Salesforce, HubSpot, Zendesk, and 50+ other tools instantly.",
      icon: "cable",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary, #6366f1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollAnimationWrapper animation="fade-up" className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="material-symbols-outlined text-sm text-primary">grid_view</span>
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Built for <span className="text-primary">Maximum Efficiency</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Every feature designed to help your AI workforce operate at peak performance
          </p>
        </ScrollAnimationWrapper>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Large feature card */}
          <ScrollAnimationWrapper
            animation="fade-up"
            delay={0.2}
            className="lg:col-span-2 group relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 lg:p-10 overflow-hidden"
          >
            {/* Glowing orb effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                <span className="material-symbols-outlined text-2xl text-white">hub</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Your Complete AI Workforce</h3>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-lg">
                Deploy all 5 specialized agents simultaneously. They communicate, share data, and
                collaborate—transforming how your business operates.
              </p>

              {/* Mini agent grid */}
              <div className="flex flex-wrap gap-3">
                {agents.slice(0, 5).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${agent.bgColor} flex items-center justify-center`}
                    >
                      <span
                        className={`material-symbols-outlined text-sm bg-gradient-to-r ${agent.color} bg-clip-text text-transparent`}
                      >
                        {agent.icon}
                      </span>
                    </div>
                    <span className="text-sm text-white font-medium">{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Stats card */}
          <ScrollAnimationWrapper
            animation="fade-up"
            delay={0.3}
            className="group relative rounded-3xl bg-gradient-to-br from-primary to-indigo-500 p-8 overflow-hidden h-full"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-xl text-white">trending_up</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">85% Time Saved</h3>
                <p className="text-white/80 text-sm">Average time saved on repetitive tasks</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["SC", "MR", "JM"].map((initials) => (
                      <div
                        key={initials}
                        className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs text-white font-medium"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-white/80">2,000+ companies</span>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Feature cards */}
          {features.map((feature, index) => (
            <ScrollAnimationWrapper
              key={feature.title}
              animation="fade-up"
              delay={0.4 + index * 0.1}
              className="group relative rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                style={{
                  boxShadow: `0 10px 30px -10px ${
                    feature.gradient.includes("primary") || feature.gradient.includes("indigo")
                      ? "rgba(99,102,241,0.4)"
                      : feature.gradient.includes("cyan")
                      ? "rgba(6,182,212,0.4)"
                      : feature.gradient.includes("violet")
                      ? "rgba(139,92,246,0.4)"
                      : "rgba(249,115,22,0.4)"
                  }`,
                }}
              >
                <span className="material-symbols-outlined text-xl text-white">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
