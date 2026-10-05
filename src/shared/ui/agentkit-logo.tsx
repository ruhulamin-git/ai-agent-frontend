interface AgentKitLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const AgentKitLogo = ({
  size = "md",
  showText = true,
}: AgentKitLogoProps) => {
  const sizeClasses = {
    sm: { icon: "w-6 h-6", text: "text-base", gap: "gap-1.5" },
    md: { icon: "w-8 h-8", text: "text-xl", gap: "gap-2" },
    lg: { icon: "w-10 h-10", text: "text-2xl", gap: "gap-2.5" },
  };

  return (
    <div className={`flex items-center ${sizeClasses[size].gap} cursor-pointer`}>
      {/* Logo Icon - Geometric A with Kit box */}
      <div className={`${sizeClasses[size].icon} relative shrink-0`}>
        {/* Background circle */}
        <div className="absolute inset-0 bg-gray-900/10 dark:bg-white/10 rounded-lg rotate-45" />

        {/* A letter with toolbox design */}
        <div
          className={`relative ${sizeClasses[size].icon} flex items-center justify-center text-gray-900 dark:text-white font-bold`}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stylized "A" with toolbox elements */}
            <path
              d="M16 6L9 24H12L13.5 20H18.5L20 24H23L16 6Z"
              fill="currentColor"
              className="opacity-90"
            />
            <rect x="14" y="14" width="4" height="2" fill="currentColor" className="opacity-100" />
            {/* Small dots representing tools/kit */}
            <circle cx="11" cy="18" r="1" fill="currentColor" />
            <circle cx="21" cy="18" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <span className={`${sizeClasses[size].text} text-gray-900 dark:text-white font-bold tracking-tight`}>
          Agent<span className="text-primary"> Kit</span>
        </span>
      )}
    </div>
  );
};
