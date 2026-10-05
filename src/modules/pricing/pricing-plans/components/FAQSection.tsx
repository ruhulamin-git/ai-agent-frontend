"use client";

import { useState } from "react";

import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: "Yes, absolutely. Changes take effect at the end of your current billing cycle.",
  },
  {
    question: "Is my data used to train your public models?",
    answer:
      "No. We have a strict zero-retention policy. Your data is never used to train our base models.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes! Contact our sales team with proof of non-profit status to receive 20% off.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full overflow-hidden py-24 lg:py-32">
      {/* Main Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollAnimationWrapper animation="fade-up" className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
              <span className="font-serif italic text-primary">Questions?</span>{" "}
              <span className="font-light">We&apos;ve got answers</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about our pricing. Can&apos;t find what you&apos;re
              looking for? Contact our support team.
            </p>
          </ScrollAnimationWrapper>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, faqIndex) => {
              const isOpen = openIndex === faqIndex;
              const ANIMATION_DELAY_MULTIPLIER = 0.05;

              return (
                <ScrollAnimationWrapper
                  key={`${faq.question}-${faqIndex}`}
                  animation="fade-up"
                  delay={faqIndex * ANIMATION_DELAY_MULTIPLIER}
                >
                  <div
                    className={`group glass-panel rounded-2xl overflow-hidden transition-all duration-500 border ${
                      isOpen
                        ? "neo-shadow-active border-primary/40"
                        : "neo-shadow border-white/10 hover:border-primary/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(faqIndex)}
                      className="w-full px-6 md:px-8 py-6 md:py-7 flex justify-between items-start gap-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-medium text-base md:text-lg leading-relaxed transition-colors ${
                          isOpen ? "text-white" : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isOpen
                            ? "bg-primary text-black rotate-180 shadow-lg shadow-primary/30"
                            : "bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
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
                        <div className="px-6 md:px-8 pb-6 md:pb-7 text-sm md:text-base text-slate-400 font-light leading-relaxed border-t border-white/10 pt-6">
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
      </div>
    </section>
  );
};
