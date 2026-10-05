"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { SectionContainer } from "@/shared/components";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

// const companies = [
//   { name: "Slack", logo: "/logos/slack.png" },
//   { name: "Notion", logo: "/logos/notion.svg" },
//   { name: "Salesforce", logo: "/logos/salesforce.png" },
//   { name: "HubSpot", logo: "/logos/hubspot.png" },
//   { name: "Jira", logo: "/logos/jira.svg" },
//   { name: "Zendesk", logo: "/logos/zendesk.png" },
// ];

const stats = [
  { value: "2,000+", label: "Agents" },
  { value: "500+", label: "Subscribers" },
  { value: "1000+", label: "Developers" },
];

const AnimatedStat = ({ value, label }: { value: string; label: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const spanRef = useRef<HTMLSpanElement>(null);

  // Extract number and suffix for animation
  const rawValue = value.replace(/,/g, "");
  const match = rawValue.match(/([\d.]+)(.*)/);
  const numValue = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const isFloat = match ? match[1].includes(".") : false;

  useEffect(() => {
    if (inView && spanRef.current) {
      const proxy = { val: 0 };

      gsap.to(proxy, {
        val: numValue,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (spanRef.current) {
            let formatted;
            if (isFloat) {
              formatted = proxy.val.toFixed(1);
            } else {
              formatted = Math.round(proxy.val).toLocaleString();
            }
            spanRef.current.textContent = formatted;
          }
        },
      });
    }
  }, [inView, numValue, isFloat]);

  return (
    <div ref={ref} className="text-center group">
      <div className="section-title mb-2 transition-colors duration-300">
        <span ref={spanRef}>0</span>
        {suffix}
      </div>
      <div className="text-xs md:text-sm lg:text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export const SocialProof = () => {
  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative z-10 py-4">
        <SectionContainer>
          {/* Header
          <ScrollAnimationWrapper
            animation="fade-up"
            className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-4">
              Confidence backed by <span className="font-serif italic text-primary">results</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              Join thousands of companies transforming their operations with AI
            </p>
          </ScrollAnimationWrapper> */}

          {/* Stats - Inline Style */}
          <ScrollAnimationWrapper animation="fade-up" delay={0.2}>
            <div className="flex flex-wrap items-center pt-8 md:pt-10 lg:pt-16 py-0 md:py-2 lg:py-10 justify-center gap-8 md:gap-12 lg:gap-16">
              {stats.map((stat) => (
                <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </ScrollAnimationWrapper>

          {/* Company logos - Simple Grid */}
          {/* <ScrollAnimationWrapper animation="fade-up" delay={0.4}>
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-500 text-center mb-8 md:mb-10">
              Trusted by Industry Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12">
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-primary/40 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 relative flex items-center justify-center bg-white rounded-lg p-1.5">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={40}
                      height={40}
                      sizes="(max-width: 768px) 40px, 40px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-base md:text-lg font-medium text-slate-800 dark:text-white/90">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollAnimationWrapper> */}
        </SectionContainer>
      </div>
    </section>
  );
};
