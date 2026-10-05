// material-ui
import { AppBar, Box, Button, Fab, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// icons
import {
  IconArtboard,
  IconArtboardOff,
  IconMagnet,
  IconMagnetOff,
  IconRefreshAlert,
  IconX,
} from "@tabler/icons-react";
import { cloneDeep, omit } from "lodash";
import { axios as djangoAxios } from "@/utils/axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, { addEdge, Background, Controls, useEdgesState, useNodesState } from "reactflow";

import chatflowsApi from "@/modules/ai-builder/api/chatflows";
// API
import nodesApi from "@/modules/ai-builder/api/nodes";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
import { useAuth } from "@/modules/ai-builder/hooks/useAuth";
import useConfirm from "@/modules/ai-builder/hooks/useConfirm";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  REMOVE_DIRTY,
  SET_CHATFLOW,
  SET_DIRTY,
} from "@/modules/ai-builder/store/actions";
// const
import { FLOWISE_CREDENTIAL_ID } from "@/modules/ai-builder/store/constant";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
// utils
import {
  getUniqueNodeId,
  getUpsertDetails,
  initNode,
  rearrangeToolsOrdering,
  updateOutdatedNodeData,
  updateOutdatedNodeEdge,
} from "@/modules/ai-builder/utils/genericHelper";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";
import { usePrompt } from "@/modules/ai-builder/utils/usePrompt";
import ChatPopUp from "@/modules/ai-builder/views/chatmessage/ChatPopUp";
import VectorStorePopUp from "@/modules/ai-builder/views/vectorstore/VectorStorePopUp";

import AddNodes from "./AddNodes";
import ButtonEdge from "./ButtonEdge";
import CanvasHeader from "./CanvasHeader";
// project imports
import CanvasNode from "./CanvasNode";
import StickyNote from "./StickyNote";

import "reactflow/dist/style.css";
import "./index.css";

// ==============================|| CANVAS ||============================== //

const Canvas = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname() || "";
  const params = useParams();
  const { hasAssignedWorkspace } = useAuth();

  // Next App Router: derive id on first render. Reading `window` in an effect raced
  // with the mount-only init effect and skipped `getSpecificChatflow`, so the canvas stayed empty.
  const idParam = params?.id;
  const chatflowId =
    typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] ?? "" : "";
  const isAgentCanvas = pathname.includes("agentcanvas");
  const canvasTitle = isAgentCanvas ? "Agent" : "Chatflow";

  const [mounted, setMounted] = useState(false);

  const nodeTypes = useMemo(
    () => ({
      customNode: CanvasNode,
      stickyNote: StickyNote,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      buttonedge: ButtonEdge,
    }),
    []
  );

  // Get templateFlowData from session storage or URL params
  const [templateFlowData, setTemplateFlowData] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to get from session storage first
      const storedData = sessionStorage.getItem("templateFlowData");
      if (storedData) {
        setTemplateFlowData(storedData);
      }
    }
  }, []);

  const { confirm } = useConfirm();

  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  // Use theme.palette.mode as source of truth for dark mode (synced from next-themes)
  const isDark = theme.palette.mode === "dark";
  const canvas = useSelector((state) => state.canvas);
  const [canvasDataStore, setCanvasDataStore] = useState(canvas);
  const [chatflow, setChatflow] = useState(null);
  const { reactFlowInstance, setReactFlowInstance } = useContext(flowContext);

  // ==============================|| Snackbar ||============================== //

  useNotifier();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  // ==============================|| ReactFlow ||============================== //

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const [selectedNode, setSelectedNode] = useState(null);
  const [isUpsertButtonEnabled, setIsUpsertButtonEnabled] = useState(false);
  const [isSyncNodesButtonEnabled, setIsSyncNodesButtonEnabled] = useState(false);
  const [isSnappingEnabled, setIsSnappingEnabled] = useState(false);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(true);

  const reactFlowWrapper = useRef(null);

  const [lastUpdatedDateTime, setLasUpdatedDateTime] = useState("");
  const [chatflowName, setChatflowName] = useState("");
  const [flowData, setFlowData] = useState("");

  // ==============================|| Chatflow API ||============================== //

  const getNodesApi = useApi(nodesApi.getAllNodes);
  const updateChatflowApi = useApi(chatflowsApi.updateChatflow);
  const getSpecificChatflowApi = useApi(chatflowsApi.getSpecificChatflowDjango);
  const getHasChatflowChangedApi = useApi(chatflowsApi.getHasChatflowChanged);

  // ==============================|| Events & Actions ||============================== //

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      type: "buttonedge",
      id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
    };

    const targetNodeId = params.targetHandle.split("-")[0];
    const sourceNodeId = params.sourceHandle.split("-")[0];
    const targetInput = params.targetHandle.split("-")[2];

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === targetNodeId) {
          setTimeout(() => setDirty(), 0);
          let value;
          const inputAnchor = node.data.inputAnchors.find((ancr) => ancr.name === targetInput);
          const inputParam = node.data.inputParams.find((param) => param.name === targetInput);

          if (inputAnchor?.list) {
            const newValues = node.data.inputs[targetInput] || [];
            if (targetInput === "tools") {
              rearrangeToolsOrdering(newValues, sourceNodeId);
            } else {
              newValues.push(`{{${sourceNodeId}.data.instance}}`);
            }
            value = newValues;
          } else if (inputParam?.acceptVariable) {
            value = node.data.inputs[targetInput] || "";
          } else {
            value = `{{${sourceNodeId}.data.instance}}`;
          }
          node.data = {
            ...node.data,
            inputs: {
              ...node.data.inputs,
              [targetInput]: value,
            },
          };
        }
        return node;
      })
    );

    setEdges((eds) => addEdge(newEdge, eds));
  };

  const handleLoadFlow = (file) => {
    try {
      const flowData = JSON.parse(file);
      const edges = flowData.edges || [];

      // Normalize imported nodes: some exported JSONs place outputAnchors,
      // inputAnchors, and inputParams at the node level instead of inside
      // node.data. CanvasNode expects them inside data, so merge them in.
      const nodes = (flowData.nodes || []).map((node) => {
        const d = node.data || {};
        return {
          ...node,
          data: {
            ...d,
            outputAnchors: d.outputAnchors || node.outputAnchors || [],
            inputAnchors: d.inputAnchors || node.inputAnchors || [],
            inputParams: d.inputParams || node.inputParams || [],
          },
        };
      });

      setNodes(nodes);
      setEdges(edges);
      setTimeout(() => setDirty(), 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFlow = async () => {
    const confirmPayload = {
      title: `Delete`,
      description: `Delete ${canvasTitle} ${chatflow.name}?`,
      confirmButtonName: "Delete",
      cancelButtonName: "Cancel",
    };
    const isConfirmed = await confirm(confirmPayload);

    if (isConfirmed) {
      try {
        let targetId = chatflow.django_id || (Number.isInteger(chatflow.id) ? chatflow.id : null);

        // If still missing, try a last-resort sync
        if (!targetId) {
          console.log("[Django Delete] Missing numeric ID, performing last-resort lookup...");
          const response = await djangoAxios.get('/api/ai-agents/v1/user-created-agents/');
          const agents = response?.data?.data || response?.data || [];
          const currentAgent = agents.find(a => a.chatbot_id === chatflow.id || a.uuid === chatflow.id || String(a.id) === String(chatflow.id));
          if (currentAgent) {
            targetId = currentAgent.id;
            console.log("[Django Delete] Found ID during lookup:", targetId);
          }
        }

        if (!targetId) {
          throw new Error("Could not find numeric ID for this agent. Please refresh and try again.");
        }

        console.log("[Django] Deleting with numeric ID:", targetId);
        await djangoAxios.delete(`/api/ai-agents/v1/user-created-agents/${targetId}/`);
        localStorage.removeItem(`${chatflow.id}_INTERNAL`);
        router.push(isAgentCanvas ? "/ai-builder/agentflows" : "/ai-builder/chatflows");
      } catch (error) {
        console.error("[Django] Delete failed:", error);
        enqueueSnackbar({
          message: error.message || error?.response?.data?.message || error?.response?.data?.detail || "Delete failed",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            persist: true,
            action: (key) => (
              <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
                <IconX />
              </Button>
            ),
          },
        });
      }
    }
  };

  const handleSaveFlow = async (chatflowName) => {
    if (reactFlowInstance) {
      const nodes = reactFlowInstance.getNodes().map((node) => {
        const nodeData = cloneDeep(node.data);
        if (Object.prototype.hasOwnProperty.call(nodeData.inputs, FLOWISE_CREDENTIAL_ID)) {
          nodeData.credential = nodeData.inputs[FLOWISE_CREDENTIAL_ID];
          nodeData.inputs = omit(nodeData.inputs, [FLOWISE_CREDENTIAL_ID]);
        }
        node.data = {
          ...nodeData,
          selected: false,
        };
        return node;
      });

      const rfInstanceObject = reactFlowInstance.toObject();
      rfInstanceObject.nodes = nodes;
      const flowData = JSON.stringify(rfInstanceObject);

      if (!chatflow.django_id && !Number.isInteger(chatflow.id)) {
        // POST to Django API for new agent creation
        try {
          const formData = new FormData();
          formData.append("name", chatflowName);
          formData.append("description", chatflowName);
          formData.append("type", isAgentCanvas ? "multiagent" : "chatflow");
          formData.append("source_type", "canvas");
          formData.append("workflow_definition", flowData);
          formData.append("is_active", "true");

          const response = await djangoAxios.post(
            "/api/ai-agents/v1/user-created-agents/",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          const agentData = response?.data ?? response;
          const chatbotId = agentData.chatflow_id || agentData.chatbot_id || agentData.uuid || agentData.id;

          dispatch({
            type: SET_CHATFLOW,
            chatflow: {
              ...agentData,
              id: chatbotId,
              django_id: agentData.id,
              flowData
            }
          });
          saveChatflowSuccess();
          router.replace(
            isAgentCanvas
              ? `/ai-builder/agentcanvas/${chatbotId}`
              : `/ai-builder/canvas/${chatbotId}`
          );
        } catch (err) {
          console.error("[Django] Failed to create agent:", err);
          const errMsg = err?.response?.data?.message || err?.response?.data?.detail || "Unknown error";
          errorFailed(`Failed to create ${canvasTitle}: ${errMsg}`);
        }
      } else {
        // PUT to Django API for existing agent update
        try {
          const targetId = chatflow.django_id || chatflow.id;
          const formData = new FormData();
          formData.append("name", chatflowName);
          formData.append("workflow_definition", flowData);

          const response = await djangoAxios.put(
            `/api/ai-agents/v1/user-created-agents/${targetId}/`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          const agentData = response?.data ?? response;
          dispatch({
            type: SET_CHATFLOW,
            chatflow: {
              ...agentData,
              id: chatflow.id,
              django_id: agentData.id,
              flowData
            }
          });
          setLasUpdatedDateTime(agentData.updated_at || agentData.updatedDate);
          saveChatflowSuccess();
        } catch (err) {
          console.error("[Django] Failed to update agent:", err);
          const errMsg = err?.response?.data?.message || err?.response?.data?.detail || "Unknown error";
          errorFailed(`Failed to update ${canvasTitle}: ${errMsg}`);
        }
      }
    }
  };

  // eslint-disable-next-line
  const onNodeClick = useCallback((event, clickedNode) => {
    setSelectedNode(clickedNode);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === clickedNode.id) {
          node.data = {
            ...node.data,
            selected: true,
          };
        } else {
          node.data = {
            ...node.data,
            selected: false,
          };
        }

        return node;
      })
    );
  });

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      let nodeData = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof nodeData === "undefined" || !nodeData) {
        return;
      }

      nodeData = JSON.parse(nodeData);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      });

      const newNodeId = getUniqueNodeId(nodeData, reactFlowInstance.getNodes());

      const newNode = {
        id: newNodeId,
        position,
        type: nodeData.type !== "StickyNote" ? "customNode" : "stickyNote",
        data: initNode(nodeData, newNodeId),
      };

      setSelectedNode(newNode);
      setNodes((nds) =>
        nds.concat(newNode).map((node) => {
          if (node.id === newNode.id) {
            node.data = {
              ...node.data,
              selected: true,
            };
          } else {
            node.data = {
              ...node.data,
              selected: false,
            };
          }

          return node;
        })
      );
      setTimeout(() => setDirty(), 0);
    },

    // eslint-disable-next-line
    [reactFlowInstance]
  );

  const syncNodes = () => {
    const componentNodes = canvas.componentNodes;

    const cloneNodes = cloneDeep(nodes);
    const cloneEdges = cloneDeep(edges);
    const toBeRemovedEdges = [];

    for (let i = 0; i < cloneNodes.length; i++) {
      const node = cloneNodes[i];
      const componentNode = componentNodes.find((cn) => cn.name === node.data.name);
      if (componentNode && componentNode.version > node.data.version) {
        const clonedComponentNode = cloneDeep(componentNode);
        cloneNodes[i].data = updateOutdatedNodeData(clonedComponentNode, node.data);
        toBeRemovedEdges.push(...updateOutdatedNodeEdge(cloneNodes[i].data, cloneEdges));
      }
    }

    setNodes(cloneNodes);
    setEdges(cloneEdges.filter((edge) => !toBeRemovedEdges.includes(edge)));
    setDirty();
    setIsSyncNodesButtonEnabled(false);
  };

  const saveChatflowSuccess = () => {
    dispatch({ type: REMOVE_DIRTY });
    enqueueSnackbar({
      message: `${canvasTitle} saved`,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "success",
        action: (key) => (
          <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
            <IconX />
          </Button>
        ),
      },
    });
  };

  const errorFailed = (message) => {
    enqueueSnackbar({
      message,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "error",
        persist: true,
        action: (key) => (
          <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
            <IconX />
          </Button>
        ),
      },
    });
  };

  const setDirty = () => {
    dispatch({ type: SET_DIRTY });
  };

  const checkIfUpsertAvailable = (nodes, edges) => {
    const upsertNodeDetails = getUpsertDetails(nodes, edges);
    if (upsertNodeDetails.length) setIsUpsertButtonEnabled(true);
    else setIsUpsertButtonEnabled(false);
  };

  const checkIfSyncNodesAvailable = (nodes) => {
    const componentNodes = canvas.componentNodes;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const componentNode = componentNodes.find((cn) => cn.name === node.data.name);
      if (componentNode && componentNode.version > node.data.version) {
        setIsSyncNodesButtonEnabled(true);
        return;
      }
    }

    setIsSyncNodesButtonEnabled(false);
  };

  // ==============================|| useEffect ||============================== //

  // Get specific chatflow successful (from Django)
  useEffect(() => {
    if (getSpecificChatflowApi.data) {
      const chatflowData = getSpecificChatflowApi.data;
      // In Django flow, workspaceId might be missing or handled differently.
      // For now, we skip the hasAssignedWorkspace check if it's missing,
      // as Django handles its own permissions.
      const workspaceId = chatflowData.workspaceId;
      if (workspaceId && !hasAssignedWorkspace(workspaceId)) {
        router.push("/unauthorized");
        return;
      }
      const rawFlowData = chatflowData.flowData;
      const initialFlow = typeof rawFlowData === 'string' ? JSON.parse(rawFlowData) : (rawFlowData || []);
      setLasUpdatedDateTime(chatflowData.updatedDate);
      setNodes(initialFlow.nodes || []);
      setEdges(initialFlow.edges || []);
      dispatch({ type: SET_CHATFLOW, chatflow: chatflowData });
    } else if (getSpecificChatflowApi.error) {
      const errorMsg = getSpecificChatflowApi.error?.response?.data?.message ||
        getSpecificChatflowApi.error?.response?.data?.detail ||
        getSpecificChatflowApi.error?.message ||
        "Unknown error";
      errorFailed(`Failed to retrieve ${canvasTitle}: ${errorMsg}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSpecificChatflowApi.data, getSpecificChatflowApi.error]);

  // Node-based update effects removed as we moved to Django PUT

  useEffect(() => {
    setChatflow(canvasDataStore.chatflow);
    if (canvasDataStore.chatflow) {
      const rawFlowData = canvasDataStore.chatflow.flowData;
      const flowData = typeof rawFlowData === 'string' ? JSON.parse(rawFlowData) : (rawFlowData || []);
      checkIfUpsertAvailable(flowData.nodes || [], flowData.edges || []);
      checkIfSyncNodesAvailable(flowData.nodes || []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasDataStore.chatflow]);

  // Track when component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Node catalog (Flowise /api/v1/nodes) — once per canvas mount
  useEffect(() => {
    getNodesApi.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load chatflow when route id is known or user opens a blank canvas
  useEffect(() => {
    setIsSyncNodesButtonEnabled(false);
    setIsUpsertButtonEnabled(false);
    if (chatflowId) {
      getSpecificChatflowApi.request(chatflowId);
    } else {
      if (localStorage.getItem("duplicatedFlowData")) {
        handleLoadFlow(localStorage.getItem("duplicatedFlowData"));
        setTimeout(() => localStorage.removeItem("duplicatedFlowData"), 0);
      } else {
        setNodes([]);
        setEdges([]);
      }
      dispatch({
        type: SET_CHATFLOW,
        chatflow: {
          name: `Untitled ${canvasTitle}`,
        },
      });
    }

    return () => {
      setTimeout(() => dispatch({ type: REMOVE_DIRTY }), 0);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatflowId]);

  useEffect(() => {
    setCanvasDataStore(canvas);
  }, [canvas]);

  useEffect(() => {
    function handlePaste(e) {
      const pasteData = e.clipboardData.getData("text");
      //TODO: prevent paste event when input focused, temporary fix: catch chatflow syntax
      if (pasteData.includes('{"nodes":[') && pasteData.includes('],"edges":[')) {
        handleLoadFlow(pasteData);
      }
    }

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      templateFlowData &&
      templateFlowData.includes('"nodes":[') &&
      templateFlowData.includes('],"edges":[')
    ) {
      handleLoadFlow(templateFlowData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateFlowData]);

  usePrompt("You have unsaved changes! Do you want to navigate away?", canvasDataStore.isDirty);

  return (
    <Box>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: isDark ? "rgb(17 24 39)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid",
          borderColor: isDark ? "rgb(31 41 55)" : "rgb(229 231 235)",
        }}
      >
        <Toolbar sx={{ minHeight: "60px !important", height: "60px" }}>
          <CanvasHeader
            chatflow={chatflow}
            handleSaveFlow={handleSaveFlow}
            handleDeleteFlow={handleDeleteFlow}
            handleLoadFlow={handleLoadFlow}
            isAgentCanvas={isAgentCanvas}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ pt: "60px", height: "100vh", width: "100%" }}>
        <div className="reactflow-parent-wrapper">
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodeClick={onNodeClick}
              onEdgesChange={onEdgesChange}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={setDirty}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              fitView
              deleteKeyCode={canvas.canvasDialogShow ? null : ["Delete"]}
              minZoom={0.1}
              snapGrid={[25, 25]}
              snapToGrid={isSnappingEnabled}
              className={`chatflow-canvas${mounted && isDark ? " dark-mode-canvas" : ""}`}
            >
              <Controls
                className={mounted && isDark ? "dark-mode-controls" : ""}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  className="react-flow__controls-button react-flow__controls-interactive"
                  onClick={() => {
                    setIsSnappingEnabled(!isSnappingEnabled);
                  }}
                  title="toggle snapping"
                  aria-label="toggle snapping"
                >
                  {isSnappingEnabled ? <IconMagnet /> : <IconMagnetOff />}
                </button>
                <button
                  className="react-flow__controls-button react-flow__controls-interactive"
                  onClick={() => {
                    setIsBackgroundEnabled(!isBackgroundEnabled);
                  }}
                  title="toggle background"
                  aria-label="toggle background"
                >
                  {isBackgroundEnabled ? <IconArtboard /> : <IconArtboardOff />}
                </button>
              </Controls>
              {isBackgroundEnabled && <Background color={isDark ? "#555" : "#aaa"} gap={16} />}
              <AddNodes
                isAgentCanvas={isAgentCanvas}
                nodesData={getNodesApi.data}
                node={selectedNode}
              />
              {isSyncNodesButtonEnabled && (
                <Fab
                  sx={{
                    left: 40,
                    top: 20,
                    color: "white",
                    background: "orange",
                    "&:hover": {
                      background: "orange",
                      backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`,
                    },
                  }}
                  size="small"
                  aria-label="sync"
                  title="Sync Nodes"
                  onClick={() => syncNodes()}
                >
                  <IconRefreshAlert />
                </Fab>
              )}
              {isUpsertButtonEnabled && <VectorStorePopUp chatflowid={chatflowId} />}
              <ChatPopUp isAgentCanvas={isAgentCanvas} chatflowid={chatflowId} />
            </ReactFlow>
          </div>
        </div>
      </Box>
      <ConfirmDialog />
    </Box>
  );
};

export default Canvas;
