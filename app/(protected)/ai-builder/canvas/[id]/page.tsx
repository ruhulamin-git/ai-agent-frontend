"use client";

import dynamic from "next/dynamic";
import React from "react";

const Canvas = dynamic(() => import("@/modules/ai-builder/views/canvas/index"), { ssr: false });

const CanvasIdPage = () => <Canvas />;

export default CanvasIdPage;
