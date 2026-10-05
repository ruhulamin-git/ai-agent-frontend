import { lazy } from "react";

import MinimalLayout from "@/modules/ai-builder/layout/MinimalLayout";
import { RequireAuth } from "@/modules/ai-builder/routes/RequireAuth";
// project imports
import Loadable from "@/modules/ai-builder/ui-component/loading/Loadable";

// canvas routing
const Canvas = Loadable(lazy(() => import("@/views/canvas")));
const CanvasV2 = Loadable(lazy(() => import("@/views/agentflowsv2/Canvas")));

// ==============================|| CANVAS ROUTING ||============================== //

const CanvasRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/canvas",
      element: (
        <RequireAuth permission={"chatflows:view"}>
          <Canvas />
        </RequireAuth>
      ),
    },
    {
      path: "/canvas/:id",
      element: (
        <RequireAuth permission={"chatflows:view"}>
          <Canvas />
        </RequireAuth>
      ),
    },
    {
      path: "/agentcanvas",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <CanvasV2 />
        </RequireAuth>
      ),
    },
    {
      path: "/agentcanvas/:id",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <CanvasV2 />
        </RequireAuth>
      ),
    },

  ],
};

export default CanvasRoutes;
