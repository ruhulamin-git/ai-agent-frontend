"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";

export const QuickActions = () => {
  const router = useRouter();

  const actions = [
    {
      title: "Agent Builder",
      desc: "Create custom AI behavior",
      icon: "construction",
      route: "/dashboard/agents/new",
      color: "bg-indigo-500 text-white",
    },
    {
      title: "Marketplace",
      desc: "Browse premium agents",
      icon: "storefront",
      route: "/dashboard/agents",
      color: "bg-emerald-500 text-white",
    },
    {
      title: "Agent Combiner",
      desc: "Create composite agents",
      icon: "join_inner",
      route: "/dashboard/agents/combine",
      color: "bg-amber-500 text-white",
    },
    {
      title: "Manage Channels",
      desc: "FB, WhatsApp, Telegram",
      icon: "hub",
      route: "/dashboard/integrations",
      color: "bg-slate-800 text-white",
    },
  ];

  return (
    <div className="rounded-4xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 h-full flex flex-col">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
        System Actions
      </h3>

      <div className="grid gap-3 flex-1">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="ghost"
            onClick={() => router.push(action.route)}
            className="h-auto flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all text-left justify-start w-full group"
          >
            <div
              className={`w-10 h-10 rounded-xl ${action.color} shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center shrink-0`}
            >
              <span className="material-symbols-outlined text-xl">{action.icon}</span>
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                {action.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {action.desc}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="ghost"
          className="w-full text-slate-500 dark:text-slate-400 text-xs font-semibold hover:text-primary gap-2"
        >
          <span className="material-symbols-outlined text-lg">help_outline</span>
          System Documentation
          <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            open_in_new
          </span>
        </Button>
      </div>
    </div>
  );
};
