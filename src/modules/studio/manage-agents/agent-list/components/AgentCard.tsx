"use client";

import { Calendar, Settings, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import type { UserAgent } from "../../types";

interface AgentCardProps {
  agent: UserAgent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const formattedDate = new Date(agent.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 h-full hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_0_1px_rgba(var(--primary)/0.1)] hover:-translate-y-0.5 group">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative py-5 px-5 pb-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-3.5 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
          {agent.iconUrl ? (
            <Image
              src={agent.iconUrl}
              alt={agent.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <Sparkles size={20} className="text-primary" />
          )}
        </div>
        <h3 className="font-bold text-base text-foreground mb-1 leading-snug">{agent.name}</h3>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {agent.description}
        </p>
      </div>

      <div className="flex items-center gap-4 py-3.5 px-5 mt-auto">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            agent.publishStatus === "published"
              ? "bg-green-500/10 text-green-500"
              : "bg-muted-foreground/10 text-muted-foreground"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {agent.publishStatus === "published"
            ? t("pages.ai_studio.published")
            : t("pages.ai_studio.draft")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar size={12} />
          {formattedDate}
        </div>
      </div>

      <div className="flex items-center gap-2 py-3.5 px-5 border-t border-border">
        <button
          className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 no-underline"
          onClick={() => router.push(`/dashboard/ai-studio/${agent.id}/settings`)}
        >
          <Settings size={13} />
          {t("pages.ai_studio.manage_agent")}
        </button>
      </div>
    </div>
  );
};

export { AgentCard };
