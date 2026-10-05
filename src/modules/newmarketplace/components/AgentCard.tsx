import { useRouter } from "next/navigation";
import type { UIAgent } from "../service/type";

interface ServerCardProps {
  agent: UIAgent;
  onInstall?: (agent: UIAgent) => void;
  onViewDetails?: (agent: UIAgent) => void;
}

export const AgentCard = ({ agent }: ServerCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    const agentSlug = agent.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.push(`/marketplace/${agentSlug}`);
  };

  const getStatusColor = (status: UIAgent["status"]) => {
    switch (status) {
      case "online":
        return "text-primary bg-primary/10 border-primary/20";
      case "offline":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "maintenance":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getPricingBadge = (pricing: UIAgent["pricing"]) => {
    switch (pricing) {
      case "free":
        return "bg-gradient-to-r from-emerald-900/70 to-green-800/70 text-emerald-200 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]";

      case "freemium": // Silver
        return "bg-gradient-to-r from-slate-800 to-zinc-700 text-slate-100 border-slate-400/40 shadow-[0_0_20px_rgba(148,163,184,0.25)]";

      case "premium": // Gold
        return "bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-700 text-yellow-100 border-yellow-500/40 shadow-[0_0_20px_rgba(245,158,11,0.35)]";

      default:
        return "bg-slate-800 text-slate-200 border-slate-600";
    }
  };


  return (
    <div
      onClick={handleViewDetails}
      className="group relative flex flex-col justify-between h-full min-h-[260px] rounded-lg border border-slate-800/60 bg-[#161b22]/60 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-[#1c212c]/80 shadow-lg cursor-pointer"
    >
      <div>
        {/* Top Header Row: Status Indicator & Pricing Badge */}
        <div className="flex items-center justify-between w-full mb-4">
          {/* Status Dot with Glow */}
          <div className={`flex justify-center rounded items-center px-2.5 pt-1 border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(agent.status)}`}>
            {agent.status}
          </div>

          {/* Premium/Free Badge */}
          <span className={`border px-2.5 pt-1 rounded text-[10px] font-bold tracking-wider ${getPricingBadge(agent.pricing)}`}>
            {agent.pricing.toUpperCase()}
          </span>
        </div>

        {/* Identity & Meta info */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-100 tracking-wide group-hover:text-white transition-colors line-clamp-1">
            {agent.name}
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            by <span className="text-slate-300 font-medium">{agent.author}</span>
          </p>

          {/* Rating & Installs */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <span className="text-amber-500 text-xs">★</span>
              <span className="text-slate-200 font-semibold">{agent.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-700">•</span>
            <span>
              {agent.originalAgent?.total_purchases ?? agent.downloads ?? 0} installed
            </span>
          </div>
        </div>

        {/* Description Text */}
        <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Footer: Capabilities tags & Action Button */}
      <div className="mt-5 space-y-4">
        {/* Compact Tags inside the image format */}
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 2).map((capability) => (
            <span
              key={`capability-${capability}`}
              className="rounded bg-[#21262d] px-2 py-1 text-[10px] font-medium text-slate-300 border border-slate-800"
            >
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 2 && (
            <span className="rounded bg-[#21262d]/40 px-1.5 py-1 text-[10px] font-medium text-slate-500">
              +{agent.capabilities.length - 2} more
            </span>
          )}
        </div>

        {/* Exact Premium Action Button from the Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="flex w-full items-center justify-center rounded-md bg-[#21262d] border border-slate-700 px-4 py-2 cursor-pointer text-xs font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:bg-[#2d333b] hover:text-white active:scale-[0.98]"
        >
          View details
        </button>
      </div>
    </div>
  );
};