import { ScrollAnimationWrapper } from "@/shared/ui/scroll-animation-wrapper";

export const PricingHero = () => {
  return (
    <section className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center overflow-hidden">
      {/* Animated Primary Color Orb - Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary rounded-full blur-[140px] animate-float opacity-40" />

      <ScrollAnimationWrapper animation="fade-up" className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Simple Pricing
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6">
          <span className="font-serif italic text-primary">Transparent Pricing</span>
          <br />
          <span>for Every Stage</span>
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto mb-12">
          Scale your AI workforce without breaking the bank. Start for free, upgrade as you grow.
        </p>
      </ScrollAnimationWrapper>
    </section>
  );
};
