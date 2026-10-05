import { lazy } from "react";

// project imports
import MainLayout from "@/modules/ai-builder/layout/MainLayout";
import { DefaultRedirect } from "@/modules/ai-builder/routes/DefaultRedirect";
import { RequireAuth } from "@/modules/ai-builder/routes/RequireAuth";
import Loadable from "@/modules/ai-builder/ui-component/loading/Loadable";

// chatflows routing
const Chatflows = Loadable(lazy(() => import("@/views/chatflows")));

// agents routing
const Agentflows = Loadable(lazy(() => import("@/views/agentflows")));
const AgentExecutions = Loadable(lazy(() => import("@/modules/ai-builder/views/agentexecutions")));
const DocumentStores = Loadable(lazy(() => import("@/modules/ai-builder/views/docstore")));
const Credentials = Loadable(lazy(() => import("@/modules/ai-builder/views/credentials")));
const Tools = Loadable(lazy(() => import("@/modules/ai-builder/views/tools")));
const Variables = Loadable(lazy(() => import("@/modules/ai-builder/views/variables")));
const APIKeys = Loadable(lazy(() => import("@/modules/ai-builder/views/apikey")));
const Datasets = Loadable(lazy(() => import("@/modules/ai-builder/views/datasets")));
const DatasetItems = Loadable(lazy(() => import("@/modules/ai-builder/views/datasets/DatasetItems")));
const Evaluators = Loadable(lazy(() => import("@/modules/ai-builder/views/evaluators")));
const Evaluations = Loadable(lazy(() => import("@/modules/ai-builder/views/evaluations")));
const EvaluationResult = Loadable(lazy(() => import("@/modules/ai-builder/views/evaluations/EvaluationResult")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DefaultRedirect />,
    },
    {
      path: "/chatflows",
      element: (
        <RequireAuth permission={"chatflows:view"}>
          <Chatflows />
        </RequireAuth>
      ),
    },
    {
      path: "/agentflows",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Agentflows />
        </RequireAuth>
      ),
    },
    {
      path: "/agentexecutions",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <AgentExecutions />
        </RequireAuth>
      ),
    },
    {
      path: "/document-stores",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <DocumentStores />
        </RequireAuth>
      ),
    },
    {
      path: "/credentials",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Credentials />
        </RequireAuth>
      ),
    },
    {
      path: "/tools",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Tools />
        </RequireAuth>
      ),
    },
    {
      path: "/variables",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Variables />
        </RequireAuth>
      ),
    },
    {
      path: "/api-keys",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <APIKeys />
        </RequireAuth>
      ),
    },
    {
      path: "/datasets",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Datasets />
        </RequireAuth>
      ),
    },
    {
      path: "/dataset_rows/:id",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <DatasetItems />
        </RequireAuth>
      ),
    },
    {
      path: "/evaluators",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Evaluators />
        </RequireAuth>
      ),
    },
    {
      path: "/evaluations",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <Evaluations />
        </RequireAuth>
      ),
    },
    {
      path: "/evaluation_results/:id",
      element: (
        <RequireAuth permission={"agentflows:view"}>
          <EvaluationResult />
        </RequireAuth>
      ),
    },
  ],
};

export default MainRoutes;
