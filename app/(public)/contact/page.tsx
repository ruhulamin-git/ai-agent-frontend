"use client";

import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";

import { ContactForm } from "@/modules/contact";
import { SectionContainer } from "@/shared/components/SectionContainer";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

const ContactPage = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 py-12">
        <SectionContainer>
          <div className="text-center mb-12">
            <h1 className="section-title mb-4">
              <span>Contact</span> Us
            </h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Have questions about our AI agents? Want to discuss custom integrations? Our team is
              here to help you transform your business with intelligent automation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <ScrollAnimationWrapper animation="fade-up">
              <div className="space-y-6 md:space-y-8 -mt-10 lg:-mt-28">
                {/* Contact Info Cards */}
                <div className="space-y-4 pt-8">
                  <ContactInfoCard
                    icon={<Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                    title="Email Us"
                    content="hello@devxhub.com"
                    description="We'll respond within 24 hours"
                  />
                  <ContactInfoCard
                    icon={<MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                    title="Live Chat"
                    content="Available 24/7"
                    description="Enterprise customers get priority support"
                  />
                  <ContactInfoCard
                    icon={<Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                    title="Phone"
                    content="+880 1326 506464"
                    description="Mon-Fri, 9AM-6PM GMT+6"
                  />
                  <ContactInfoCard
                    icon={<MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                    title="Office"
                    content="Rajshahi, Bangladesh"
                    description="158/27, Kazla, Boalia, Rajshahi"
                  />
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Right Form Card */}
            <ScrollAnimationWrapper animation="fade-up" delay={0.2}>
              <div className="relative group">
                {/* Glass Card */}
                <div className="border border-white/10 hover:border-primary/30 rounded-2xl p-6 md:p-8 lg:p-10 transition-all duration-300">
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Send us a message</h2>
                    <p className="text-slate-400 text-sm md:text-base">
                      We&apos;ll get back to you as soon as possible
                    </p>
                  </div>

                  <ContactForm />
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

export default ContactPage;

const ContactInfoCard = ({
  icon,
  title,
  content,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  description: string;
}) => (
  <div className="flex gap-4 items-start p-4 md:p-5 rounded-xl transition-all duration-300 border border-white/10 hover:border-primary/30 group">
    <div className="size-12 md:size-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-xs font-bold text-slate-500 uppercase break-all mb-1">{title}</h3>
      <p className="text-base md:text-lg font-bold text-white mb-0.5 break-all">{content}</p>
      <p className="text-xs md:text-sm text-slate-400">{description}</p>
    </div>
  </div>
);
