"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-up" | "slide-right" | "slide-left";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const ScrollAnimationWrapper = ({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
}: ScrollAnimationWrapperProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: threshold,
  });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && elementRef.current) {
      const element = elementRef.current;

      let initialVars: gsap.TweenVars = { opacity: 0 };
      const finalVars: gsap.TweenVars = { opacity: 1, duration, delay, ease: "power3.out" };

      switch (animation) {
        case "fade-up":
          initialVars = { ...initialVars, y: 50 };
          finalVars.y = 0;
          break;
        case "fade-in":
          // fast fade in, just opacity
          break;
        case "scale-up":
          initialVars = { ...initialVars, scale: 0.8 };
          finalVars.scale = 1;
          break;
        case "slide-right":
          initialVars = { ...initialVars, x: -50 };
          finalVars.x = 0;
          break;
        case "slide-left":
          initialVars = { ...initialVars, x: 50 };
          finalVars.x = 0;
          break;
      }

      gsap.fromTo(element, initialVars, finalVars);
    }
  }, [inView, animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      <div ref={elementRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </div>
  );
};
