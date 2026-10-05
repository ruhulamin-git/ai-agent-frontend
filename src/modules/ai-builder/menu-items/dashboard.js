import { IconHierarchy, IconUsersGroup, IconHistory, IconFiles, IconLock, IconTool, IconTypography, IconKey, IconDatabase, IconClipboardCheck, IconChartHistogram } from "@tabler/icons-react";

// constant
const icons = {
  IconHierarchy,
  IconUsersGroup,
  IconHistory,
  IconFiles,
  IconLock,
  IconTool,
  IconTypography,
  IconKey,
  IconDatabase,
  IconClipboardCheck,
  IconChartHistogram,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "",
  type: "group",
  children: [
    {
      id: "primary",
      title: "",
      type: "group",
      children: [
        {
          id: "chatflows",
          title: "Chatflows",
          type: "item",
          url: "/ai-builder/chatflows",
          icon: icons.IconHierarchy,
          breadcrumbs: true,
          permission: "chatflows:view",
        },
        {
          id: "agentflows",
          title: "Agentflows",
          type: "item",
          url: "/ai-builder/agentflows",
          icon: icons.IconUsersGroup,
          breadcrumbs: true,
          permission: "agentflows:view",
        },
        {
          id: "agentexecutions",
          title: "Executions",
          type: "item",
          url: "/ai-builder/agentexecutions",
          icon: icons.IconHistory,
          breadcrumbs: true,
          permission: "agentflows:view",
        },
        {
          id: "document-stores",
          title: "Document Stores",
          type: "item",
          url: "/ai-builder/document-stores",
          icon: icons.IconFiles,
          breadcrumbs: true,
          permission: "agentflows:view",
        },
        {
          id: "credentials",
          title: "Credentials",
          type: "item",
          url: "/ai-builder/credentials",
          icon: icons.IconLock,
          breadcrumbs: true,
          permission: "agentflows:view",
        },
        // {
        //   id: "tools",
        //   title: "Tools",
        //   type: "item",
        //   url: "/ai-builder/tools",
        //   icon: icons.IconTool,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
        // {
        //   id: "variables",
        //   title: "Variables",
        //   type: "item",
        //   url: "/ai-builder/variables",
        //   icon: icons.IconTypography,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
        // {
        //   id: "api-keys",
        //   title: "API Keys",
        //   type: "item",
        //   url: "/ai-builder/api-keys",
        //   icon: icons.IconKey,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
        // {
        //   id: "datasets",
        //   title: "Datasets",
        //   type: "item",
        //   url: "/ai-builder/datasets",
        //   icon: icons.IconDatabase,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
        // {
        //   id: "evaluators",
        //   title: "Evaluators",
        //   type: "item",
        //   url: "/ai-builder/evaluators",
        //   icon: icons.IconClipboardCheck,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
        // {
        //   id: "evaluations",
        //   title: "Evaluations",
        //   type: "item",
        //   url: "/ai-builder/evaluations",
        //   icon: icons.IconChartHistogram,
        //   breadcrumbs: true,
        //   permission: "agentflows:view",
        // },
      ],
    },
  ],
};

export default dashboard;
