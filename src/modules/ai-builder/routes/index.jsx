import { useRoutes } from "react-router-dom";

import config from "@/modules/ai-builder/config";

import CanvasRoutes from "./CanvasRoutes";
import ChatbotRoutes from "./ChatbotRoutes";
// routes
import MainRoutes from "./MainRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, CanvasRoutes, ChatbotRoutes], config.basename);
}
