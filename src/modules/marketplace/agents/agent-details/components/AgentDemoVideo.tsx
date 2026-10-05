"use client";

import type { Agent } from "../../shared/types";

interface AgentDemoVideoProps {
  agent: Agent;
}

export const AgentDemoVideo = ({ agent }: AgentDemoVideoProps) => {
  return (
    <section className="w-full ">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <span className="material-symbols-outlined text-base">play_circle</span>
            Demo Video
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl mb-4">
            See {agent.name} in Action
          </h2>
          <p className="text-lg text-slate-600 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Watch how {agent.name} works and discover its powerful capabilities.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-200 dark:border-border aspect-video">
          <video
            className="w-full h-full object-contain bg-black"
            controls
            preload="metadata"
            controlsList="nodownload"
          >
            <source src="/ai.mp4" type="video/mp4" />
            <track kind="captions" label="English" />
            <div className="flex items-center justify-center h-full bg-slate-900 text-slate-400">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl mb-2 block">video_library</span>
                <p>Your browser does not support the video tag.</p>
              </div>
            </div>
          </video>
        </div>
      </div>
    </section>
  );
};
