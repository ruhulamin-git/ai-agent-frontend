import { lazy } from "react";

import MinimalLayout from "@/modules/ai-builder/layout/MinimalLayout";
// project imports
import Loadable from "@/modules/ai-builder/ui-component/loading/Loadable";

// canvas routing
const ChatbotFull = Loadable(lazy(() => import("@/views/chatbot")));

// ==============================|| CANVAS ROUTING ||============================== //

const ChatbotRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/chatbot/:id",
      element: <ChatbotFull />,
    },
  ],
};

export default ChatbotRoutes;
