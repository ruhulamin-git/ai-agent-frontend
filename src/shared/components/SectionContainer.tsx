import type { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export const SectionContainer = ({ children, className = "" }: SectionContainerProps) => {
  return (
    <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
};
