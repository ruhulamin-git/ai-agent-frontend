"use client";

import { useEffect, useState } from "react";

import { agents } from "./data";

// AI Hub Visualization Component
const PULSE_COUNT = 5;
const PULSE_INTERVAL_MS = 2000;
const AGENT_RADIUS = 140;
const HOVER_SCALE = 1.15;

export const AIHubVisualization = () => {
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Animate connection pulses
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % PULSE_COUNT);
    }, PULSE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Calculate positions for agents in a circle
  const getAgentPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Start from top
    const radius = AGENT_RADIUS; // Distance from center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const handleAgentFocus = (index: number) => setActiveAgent(index);
  const handleAgentBlur = () => setActiveAgent(null);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-[340px] h-[340px] rounded-full border border-slate-200/30 animate-pulse" />
      <div
        className="absolute w-[280px] h-[280px] rounded-full border border-primary/10"
        style={{ animation: "pulse 3s ease-in-out infinite" }}
      />
      <div
        className="absolute w-[220px] h-[220px] rounded-full border border-primary/20"
        style={{ animation: "pulse 3s ease-in-out infinite 0.5s" }}
      />

      {/* Connection lines SVG */}
      <svg
        className="absolute w-[340px] h-[340px]"
        viewBox="-170 -170 340 340"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Gradient definitions */}
        <defs>
          {agents.map((agent) => (
            <linearGradient
              key={`gradient-${agent.id}`}
              id={`line-gradient-${agent.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="rgb(79, 70, 229)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.6" />
            </linearGradient>
          ))}
          {/* Animated pulse gradient */}
          <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0">
              <animate attributeName="offset" values="0;1" dur="1.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="20%" stopColor="rgb(129, 140, 248)" stopOpacity="1">
              <animate attributeName="offset" values="0.2;1" dur="1.5s" repeatCount="indefinite" />
            </stop>
            <stop offset="40%" stopColor="rgb(99, 102, 241)" stopOpacity="0">
              <animate attributeName="offset" values="0.4;1" dur="1.5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Connection lines from center to each agent */}
        {agents.map((agent, i) => {
          const pos = getAgentPosition(i, agents.length);
          const isActive = pulseIndex === i;
          return (
            <g key={`connection-${agent.id}`}>
              {/* Base line */}
              <line
                x1="0"
                y1="0"
                x2={pos.x}
                y2={pos.y}
                stroke={`url(#line-gradient-${agent.id})`}
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-40"
              />
              {/* Animated pulse line */}
              {isActive && (
                <line
                  x1="0"
                  y1="0"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="url(#pulse-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* Inter-agent connection lines (showing collaboration) */}
        {agents.map((agent, i) => {
          const nextIndex = (i + 1) % agents.length;
          const nextAgent = agents[nextIndex];
          const pos1 = getAgentPosition(i, agents.length);
          const pos2 = getAgentPosition(nextIndex, agents.length);
          return (
            <line
              key={`inter-${agent.id}-${nextAgent.id}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="rgb(99, 102, 241)"
              strokeWidth="1"
              strokeDasharray="2 6"
              className="opacity-20"
            />
          );
        })}
      </svg>

      {/* Central Hub */}
      <div className="absolute z-20">
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-3 bg-linear-to-br from-primary/30 to-indigo-400/30 rounded-full blur-xl animate-pulse" />
          {/* Main hub */}
          <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-primary via-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-primary/30 border-2 border-white/50">
            <span className="material-symbols-outlined text-white text-3xl">hub</span>
          </div>
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
          </div>
        </div>
      </div>

      {/* Agent Nodes */}
      {agents.map((agent, i) => {
        const pos = getAgentPosition(i, agents.length);
        const isHovered = activeAgent === i;
        const isPulsing = pulseIndex === i;

        return (
          <button
            key={agent.id}
            type="button"
            className="absolute z-10 transition-all duration-300 cursor-pointer bg-transparent border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${isHovered ? HOVER_SCALE : 1})`,
            }}
            onMouseEnter={() => handleAgentFocus(i)}
            onMouseLeave={handleAgentBlur}
            onFocus={() => handleAgentFocus(i)}
            onBlur={handleAgentBlur}
            aria-label={`${agent.name} - ${agent.capabilities[0]}`}
          >
            {/* Agent node */}
            <div className="relative group">
              {/* Glow effect */}
              <div
                className={`absolute -inset-2 rounded-full blur-lg transition-opacity duration-300 ${
                  isPulsing || isHovered ? "opacity-60" : "opacity-0"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${
                    agent.color.includes("primary") || agent.color.includes("indigo")
                      ? "rgb(99, 102, 241)"
                      : agent.color.includes("cyan")
                      ? "rgb(34, 211, 238)"
                      : agent.color.includes("violet")
                      ? "rgb(167, 139, 250)"
                      : agent.color.includes("orange")
                      ? "rgb(251, 146, 60)"
                      : "rgb(251, 113, 133)"
                  }, transparent)`,
                }}
              />

              {/* Main node */}
              <div
                className={`relative w-14 h-14 rounded-xl ${agent.bgColor} ${
                  agent.borderColor
                } border-2 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  isHovered ? "shadow-xl" : ""
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl bg-linear-to-r ${agent.color} bg-clip-text text-transparent`}
                >
                  {agent.icon}
                </span>
              </div>

              {/* Status dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPulsing ? "bg-primary/60 animate-pulse" : "bg-primary"
                  }`}
                />
              </div>

              {/* Tooltip on hover */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-14 whitespace-nowrap transition-all duration-200 ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
                  {agent.name}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* Floating activity cards */}
      <div
        className="absolute -right-4 top-8 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-2.5 animate-bounce [animation-duration:3s]"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
          </div>
          <div>
            <div className="text-[10px] font-medium text-white">Lead Qualified</div>
            <div className="text-[9px] text-slate-400">Sales → CRM</div>
          </div>
        </div>
      </div>

      <div
        className="absolute -left-4 bottom-12 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-2.5 animate-bounce [animation-duration:3.5s] [animation-delay:1s]"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-cyan-400 text-sm">call</span>
          </div>
          <div>
            <div className="text-[10px] font-medium text-white">Call Completed</div>
            <div className="text-[9px] text-slate-400">Call → Analytics</div>
          </div>
        </div>
      </div>
    </div>
  );
};
