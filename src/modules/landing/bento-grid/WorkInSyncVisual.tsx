"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export const WorkInSyncVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const messages = gsap.utils.toArray<HTMLElement>(".chat-message");

      const tl = gsap.timeline({ repeat: -1 });

      // Hide all initially
      gsap.set(messages, { opacity: 0, y: 10 });
      gsap.set(".typing-indicator", { opacity: 0 });

      messages.forEach((msg) => {
        // Show typing
        tl.to(".typing-indicator", { opacity: 1, duration: 0.3 })
          .to(".typing-indicator", { opacity: 1, duration: 1 }) // Wait while typing
          .to(".typing-indicator", { opacity: 0, duration: 0.3 })
          // Show message
          .to(msg, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" })
          .to({}, { duration: 1.5 }); // Pause after message
      });

      // Reset for loop
      tl.to(messages, { opacity: 0, duration: 0.5, stagger: 0.1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="w-[280px] space-y-3 scale-95">
        {/* Message 1 - Left */}
        <div className="chat-message flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            S
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 max-w-[200px]">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              New lead qualified: Acme Corp
            </span>
          </div>
        </div>

        {/* Message 2 - Right */}
        <div className="chat-message flex items-start gap-2 justify-end">
          <div className="bg-slate-800 dark:bg-slate-700 rounded-2xl px-3 py-2 max-w-[200px]">
            <span className="text-xs font-medium text-white">Adding to CRM pipeline now</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            C
          </div>
        </div>

        {/* Message 3 - Left */}
        <div className="chat-message flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 max-w-[200px]">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Predicted close rate: 78%
            </span>
          </div>
        </div>

        {/* Typing indicator */}
        <div className="typing-indicator flex items-center gap-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-fit">
          <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
          <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
          <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
        </div>

        {/* Input area */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-2 text-xs text-slate-400">
            Agents communicating...
          </div>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">arrow_upward</span>
          </div>
        </div>
      </div>
    </div>
  );
};
