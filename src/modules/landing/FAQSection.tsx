"use client";

import { useState } from "react";

import { SectionContainer } from "@/shared/components";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is AI Agent Marketplace and who is it for?",
    answer:
      "AI Agent Marketplace is the premier platform for discovering, buying, and selling AI agents. It's designed for developers looking to monetize their AI creations and businesses seeking ready-to-use AI solutions.",
  },
  {
    question: "How do I publish my AI agent?",
    answer:
      "Publishing is simple! Create your agent, upload it to the marketplace with pricing details, and set your revenue share. Your agent will be available to thousands of potential buyers immediately.",
  },
  {
    question: "What can I earn from selling agents?",
    answer:
      "You can earn up to 70% of every sale on the platform. The more popular your agent becomes, the more revenue you generate. Top sellers are making significant income through our marketplace.",
  },
  {
    question: "Can I test agents before buying?",
    answer:
      "Yes! Many agents offer free trials or demo versions so you can test functionality before purchasing. Read reviews and check agent ratings to make informed decisions.",
  },
  {
    question: "How are payments handled?",
    answer:
      "We handle all payment processing securely. Sellers receive their earnings automatically through our payment system with transparent tracking and regular payouts.",
  },
  {
    question: "How do I get started?",
    answer:
      "Getting started is simple! Sign up for a free account, browse our catalog of 2000+ AI agents, or start publishing your own creations. No credit card required to explore.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full overflow-hidden pb-4 md:pb-4 lg:pb-6">
      {/* Main Content */}
      <div className="relative z-10">
        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <ScrollAnimationWrapper
              animation="fade-up"
              className="text-center mb-8 md:mb-10 lg:mb-12"
            >
              <h2 className="section-title mb-4">
                <span className="text-primary">Questions?</span> <span>We&apos;ve got answers</span>
              </h2>
              <p className="section-subtitle text-slate-400 dark:text-slate-400  max-w-2xl mx-auto">
                Everything you need to know about AI Agent Marketplace. Can&apos;t find what
                you&apos;re looking for? Contact our support team.
              </p>
            </ScrollAnimationWrapper>

            {/* FAQ List */}
            <div className="space-y-3">
              {faqData.map((faq, faqIndex) => {
                const isOpen = openIndex === faqIndex;
                const ANIMATION_DELAY_MULTIPLIER = 0.05;

                return (
                  <ScrollAnimationWrapper
                    key={`${faq.question}-${faqIndex}`}
                    animation="fade-up"
                    delay={faqIndex * ANIMATION_DELAY_MULTIPLIER}
                  >
                    <div
                      className={`group glass-panel rounded-md overflow-hidden transition-all duration-500 border ${
                        isOpen
                          ? "neo-shadow-active border-primary/40"
                          : "neo-shadow border-white/10 hover:border-primary/20"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(faqIndex)}
                        className="w-full px-4 py-3 flex justify-between items-start gap-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`font-medium text-sm md:text-base leading-relaxed transition-colors ${
                            isOpen ? "text-primary" : "text-slate-300 group-hover:text-primary"
                          }`}
                        >
                          {faq.question}
                        </span>
                        <div
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isOpen
                              ? "bg-primary text-black rotate-180 shadow-lg shadow-primary/30"
                              : "bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimationWrapper>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};
