"use client";

import { useEffect, useRef, useState } from "react";

interface NeonBlobCursorProps {
  children: React.ReactNode;
  className?: string;
  blobColor?: string;
  blobSize?: number;
  intensity?: number;
}

export const NeonBlobCursor = ({
  children,
  className = "",
  blobColor = "#60a5fa",
  blobSize = 200,
  intensity = 0.8,
}: NeonBlobCursorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative isolate ${className}`}
      style={{ overflow: "hidden" }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {isHovering && (
          <div
            className="pointer-events-none absolute rounded-full transition-opacity duration-300"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              width: `${blobSize}px`,
              height: `${blobSize}px`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${blobColor} 0%, transparent 70%)`,
              opacity: intensity,
              filter: "blur(40px)",
            }}
          />
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
