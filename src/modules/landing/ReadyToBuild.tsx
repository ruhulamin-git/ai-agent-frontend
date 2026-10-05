import { IconRobot } from "@tabler/icons-react";
import Link from "next/link";

import { SectionContainer } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

export const ReadyToBuild = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-14 lg:py-16">
      <div className="relative z-10">
        <SectionContainer>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollAnimationWrapper animation="fade-up" className="mb-8 md:mb-10 lg:mb-12">
              <h2 className="section-title mb-4">
                <span>Ready to build your</span> <span className="text-primary">AI Agent?</span>
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Join the AI Agent marketplace, browse 2000+ agents. Build your own and get revenue.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-6 lg:pt-10">
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto px-8 md:px-10 lg:px-8 py-4 md:py-5 gold-gradient text-black font-medium rounded-md shadow-xl hover:brightness-110 transition-all duration-300 group text-sm"
                >
                  <Link href="/marketplace" className="flex items-center justify-center gap-3">
                    Browse Agents
                    <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto px-8 md:px-10 lg:px-8 py-4 md:py-5 bg-transparent border border-primary text-primary font-medium rounded-md shadow-xl hover:brightness-110 hover:text-black transition-all duration-300 group text-sm"
                >
                  <Link href="/start-building" className="flex items-center justify-center gap-3">
                    Start Building
                    <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">
                      <IconRobot className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                  </Link>
                </Button>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};
