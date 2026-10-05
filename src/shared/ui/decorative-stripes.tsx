"use client";

// Diagonal stripe decorative pattern used across landing sections - CSS Gradient implementation for infinite height

export const DecorativeStripes = () => {
  return (
    <div className="w-3 sm:w-6 md:w-8 lg:w-12 relative overflow-hidden hidden md:block shrink-0 self-stretch">
      <div
        className="absolute inset-0 w-[200%] h-full -left-[50%] text-slate-200/50 dark:text-slate-800/50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 6px)",
        }}
      />
    </div>
  );
};

export const DecorativeStripesRight = () => {
  return (
    <div className="w-3 sm:w-6 md:w-8 lg:w-12 relative overflow-hidden hidden md:block shrink-0 self-stretch">
      <div
        className="absolute inset-0 w-[200%] h-full -left-[50%] text-slate-200/50 dark:text-slate-800/50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 6px)",
        }}
      />
    </div>
  );
};
