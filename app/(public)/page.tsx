import dynamic from "next/dynamic";

import { HeroSection } from "@/modules/landing";
import { ReadyToBuild } from "@/modules/landing/ReadyToBuild";

// const AgentCollaboration = dynamic(() =>
//   import("@/modules/landing/AgentCollaboration").then((mod) => mod.AgentCollaboration)
// );
const AgentShowcase = dynamic(() =>
  import("@/modules/landing/AgentShowcase").then((mod) => mod.AgentShowcase)
);
// const BentoGridSection = dynamic(() =>
//   import("@/modules/landing/BentoGridSection").then((mod) => mod.BentoGridSection)
// );
const FAQSection = dynamic(() =>
  import("@/modules/landing/FAQSection").then((mod) => mod.FAQSection)
);
// const ImpactSection = dynamic(() =>
//   import("@/modules/landing/ImpactSection").then((mod) => mod.ImpactSection)
// );
// const InteractiveFeatures = dynamic(() =>
//   import("@/modules/landing/InteractiveFeatures").then((mod) => mod.InteractiveFeatures)
// );
const SocialProof = dynamic(() =>
  import("@/modules/landing/SocialProof").then((mod) => mod.SocialProof)
);
const HowItWorks = dynamic(() =>
  import("@/modules/landing/HowItWorks").then((mod) => mod.HowItWorks)
);
// const TestimonialsSection = dynamic(() =>
//   import("@/modules/landing/TestimonialsSection").then((mod) => mod.TestimonialsSection)
// );
const TopRatedAgents = dynamic(() =>
  import("@/modules/landing/TopRatedAgents").then((mod) => mod.TopRatedAgents)
);

export const metadata = {
  title: "AI Agent Platform - Automate Your Business with Intelligent Agents",
  description:
    "Deploy a workforce of specialized AI agents to handle your sales, support, and marketing. Scale your operations with intelligent automation.",
};

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <TopRatedAgents />
      <AgentShowcase />
      {/* <InteractiveFeatures /> */}
      {/* <BentoGridSection /> */}
      {/* <AgentCollaboration /> */}
      {/* <ImpactSection /> */}
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <ReadyToBuild />
    </div>
  );
};

export default LandingPage;
