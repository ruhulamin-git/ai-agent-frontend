"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { IntegrationLogo } from "@/shared/ui/integration-logos";

const FULL_ROTATION = 360;
const REVERSE_ROTATION = -360;
const BASE_DURATION = 20;
const DURATION_INCREMENT = 10;
const OPACITY_SCALE = 0.5;

export const IntegrationVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const integrations = [
    // Inner ring
    { name: "Slack", x: -50, y: 0 },
    { name: "Notion", x: 50, y: 0 },
    // Middle ring
    { name: "Facebook", x: 0, y: -85 },
    { name: "Instagram", x: 60, y: 60 },
    { name: "Messenger", x: -60, y: 60 },
    // Outer ring
    { name: "Twitter", x: -85, y: -60 },
    { name: "LinkedIn", x: 85, y: -60 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const logos = gsap.utils.toArray<HTMLElement>(".integration-item");
      const rings = gsap.utils.toArray<HTMLElement>(".concentric-ring");

      // Pulse core and aura
      gsap.to(".core-inner", {
        scale: 1.15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".core-aura", {
        scale: 1.4,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Rotating rings
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          rotation: i % 2 === 0 ? FULL_ROTATION : REVERSE_ROTATION,
          duration: BASE_DURATION + i * DURATION_INCREMENT,
          repeat: -1,
          ease: "none",
        });
      });

      // Orbiting movement for logos
      logos.forEach((logo, i) => {
        gsap.to(logo, {
          x: "+=5",
          y: "+=5",
          duration: 2 + i * OPACITY_SCALE,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden scale-75"
    >
      {/* Concentric rings */}
      <div className="concentric-ring absolute w-[240px] h-[240px] rounded-full border border-slate-200/50 dark:border-slate-700/50" />
      <div className="concentric-ring absolute w-[170px] h-[170px] rounded-full border border-slate-200/60 dark:border-slate-700/60" />
      <div className="concentric-ring absolute w-[100px] h-[100px] rounded-full border border-slate-200/70 dark:border-slate-700/70" />

      {/* Beautiful Central AI Core */}
      <div className="absolute flex items-center justify-center z-10">
        {/* Pulsing Aura */}
        <div className="core-aura absolute w-20 h-20 rounded-full bg-primary/20 blur-xl dark:bg-primary/10" />

        {/* Outer Glow Ring */}
        <div className="absolute w-14 h-14 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />

        {/* Glowing Orb */}
        <div className="core-inner relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] dark:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          {/* Internal Mesh/Pattern effect */}
          <div className="absolute inset-0 rounded-full opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:4px_4px]" />
          <svg className="w-6 h-6 text-white z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
          </svg>
        </div>
      </div>

      {/* Integration logos on rings */}
      {integrations.map((integration) => (
        <div
          key={integration.name}
          className="integration-item absolute w-10 h-10 flex items-center justify-center hover:scale-110 transition-all duration-300"
          style={{ transform: `translate(${integration.x}px, ${integration.y}px)` }}
          title={integration.name}
        >
          <IntegrationLogo name={integration.name} size={32} />
        </div>
      ))}
    </div>
  );
};
