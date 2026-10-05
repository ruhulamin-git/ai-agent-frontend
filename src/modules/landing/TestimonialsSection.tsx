"use client";

import Image from "next/image";

import { NeonBlobCursor } from "@/shared/ui/neon-blob-cursor";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

const ANIMATION_DELAY_MULTIPLIER = 0.1;

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        'AI Workforce Hub takes the pain out of building powerful AI Agents. Building Agents is very much a "team sport" and our platform makes it fun to work together and build customer facing use-cases and internal AI applications.',
      name: "Victor Algaze",
      company: "CISCO",
      role: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victor",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg",
    },
    {
      quote:
        "Our platform is a very versatile tool, combining visual flows with strong API capabilities and also providing a code editor and functions, for developers.",
      name: "Ciprian Nastase",
      company: "TRILOGY",
      role: "L3 Support AI Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ciprian",
      logo: "https://images.squarespace-cdn.com/content/v1/56896264d8af105e60802773/1544607739989-D5O6L7Q8R4X7Y0Z1A2B3/Trilogy+Logo+Blue.png",
    },
    {
      quote:
        "AI Workforce Hub provides us with massive acceleration, enabling us to experiment without fear... our platform allowed us to focus on value-adding activities like orchestration and building a robust, generative conversational architecture.",
      name: "Andre Fredericks",
      company: "Sanlam",
      role: "Chief Operating Officer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andre",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Sanlam_logo.svg",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-24 lg:py-32">
      {/* Main Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <ScrollAnimationWrapper animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
            Trusted by <span className="font-serif italic text-primary">leading teams</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-400 dark:text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
            See how companies are transforming their operations with our AI agents.
          </p>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimationWrapper
              key={`${testimonial.name}-${testimonial.company}`}
              animation="fade-up"
              delay={index * ANIMATION_DELAY_MULTIPLIER}
            >
              <NeonBlobCursor blobColor="rgba(56, 242, 203, 0.4)" blobSize={300} intensity={0.6}>
                <div className="border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col h-full transition-all duration-500 relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg
                      className="w-10 h-10 text-primary/40 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 flex-1">
                    {testimonial.quote}
                  </p>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                  {/* Author Section */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 transition-all flex-shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-base mb-1">{testimonial.name}</div>
                      <div className="text-slate-400 text-sm font-light mb-2">
                        {testimonial.role}
                      </div>
                      {/* Company Logo Small */}
                      <div className="h-5 flex items-center">
                        <Image
                          src={testimonial.logo}
                          alt={testimonial.company}
                          width={80}
                          height={20}
                          className="h-full w-auto object-contain opacity-50 transition-opacity dark:invert"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (target.nextElementSibling) {
                              target.nextElementSibling.classList.remove("hidden");
                            }
                          }}
                        />
                        <span className="hidden text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {testimonial.company}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 transition-opacity duration-500" />
                </div>
              </NeonBlobCursor>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
