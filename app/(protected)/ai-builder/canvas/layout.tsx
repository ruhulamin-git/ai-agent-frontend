import type { ReactNode } from "react";

/** Server layout: no `'use client'` so this is not a separate ClientSegmentRoot. That avoids Emotion/MUI style injection reordering against this wrapper during hydration (see Next.js hydration docs). */
const AiBuilderCanvasLayout = ({ children }: { children: ReactNode }) => (
  <div className="ai-builder-canvas-root" style={{ minHeight: "100vh", width: "100%" }}>
    {children}
  </div>
);

export default AiBuilderCanvasLayout;
