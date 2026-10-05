"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  variant?: "default" | "compact";
}

export const FAQSection = ({
  title = "Frequently Asked Questions",
  subtitle,
  faqs,
  variant = "default",
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`w-full ${variant === "default" ? "py-20 lg:py-24" : "py-12 lg:py-16"}`}>
      <div
        className={`${
          variant === "default" ? "max-w-4xl" : "max-w-3xl"
        } mx-auto px-4 sm:px-6 lg:px-8`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqKey = `${faq.question}-${index}`;

            return (
              <div
                key={faqKey}
                className={`group rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-card border-primary shadow-lg shadow-primary/5"
                    : "bg-slate-50/50 dark:bg-muted border-slate-200 dark:border-border hover:border-primary/30 hover:bg-white dark:hover:bg-card"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 flex justify-between items-center gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-medium leading-relaxed transition-colors ${
                      isOpen
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-primary text-white rotate-180 shadow-md shadow-primary/20"
                        : "bg-slate-100 dark:bg-muted text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-border pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        {variant === "default" && (
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Still have questions?</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
            >
              Contact our support team
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
