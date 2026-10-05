import IconAutoFixHigh from "@mui/icons-material/AutoFixHigh";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popper,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useGridApiContext } from "@mui/x-data-grid";
import {
  IconAlertTriangle,
  IconArrowsMaximize,
  IconBulb,
  IconCopy,
  IconEdit,
  IconRefresh,
  IconVariable,
  IconWand,
  IconX,
} from "@tabler/icons-react";
import parser from "html-react-parser";
import { cloneDeep } from "lodash";
import { useParams } from "next/navigation";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import showdown from "showdown";

// API
import assistantsApi from "@/modules/ai-builder/api/assistants";
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
import documentstoreApi from "@/modules/ai-builder/api/documentstore";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// const
import { baseURL, FLOWISE_CREDENTIAL_ID } from "@/modules/ai-builder/store/constant";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import { ArrayRenderer } from "@/modules/ai-builder/ui-component/array/ArrayRenderer";
import ConditionDialog from "@/modules/ai-builder/ui-component/dialog/ConditionDialog";
import ExpandRichInputDialog from "@/modules/ai-builder/ui-component/dialog/ExpandRichInputDialog";
import ExpandTextDialog from "@/modules/ai-builder/ui-component/dialog/ExpandTextDialog";
import FormatPromptValuesDialog from "@/modules/ai-builder/ui-component/dialog/FormatPromptValuesDialog";
import InputHintDialog from "@/modules/ai-builder/ui-component/dialog/InputHintDialog";
import ManageScrapedLinksDialog from "@/modules/ai-builder/ui-component/dialog/ManageScrapedLinksDialog";
import NvidiaNIMDialog from "@/modules/ai-builder/ui-component/dialog/NvidiaNIMDialog";
import PromptGeneratorDialog from "@/modules/ai-builder/ui-component/dialog/PromptGeneratorDialog";
import PromptLangsmithHubDialog from "@/modules/ai-builder/ui-component/dialog/PromptLangsmithHubDialog";
import { AsyncDropdown } from "@/modules/ai-builder/ui-component/dropdown/AsyncDropdown";
// project import
import { Dropdown } from "@/modules/ai-builder/ui-component/dropdown/Dropdown";
import { MultiDropdown } from "@/modules/ai-builder/ui-component/dropdown/MultiDropdown";
import { CodeEditor } from "@/modules/ai-builder/ui-component/editor/CodeEditor";
import { File } from "@/modules/ai-builder/ui-component/file/File";
import { DataGrid } from "@/modules/ai-builder/ui-component/grid/DataGrid";
import { Input } from "@/modules/ai-builder/ui-component/input/Input";
import { RichInput } from "@/modules/ai-builder/ui-component/input/RichInput";
import { JsonEditorInput } from "@/modules/ai-builder/ui-component/json/JsonEditor";
import { BackdropLoader } from "@/modules/ai-builder/ui-component/loading/BackdropLoader";
import { DatePicker } from "@/modules/ai-builder/ui-component/picker/DatePicker";
import { MonthDaysPicker } from "@/modules/ai-builder/ui-component/picker/MonthDaysPicker";
import { TimePicker } from "@/modules/ai-builder/ui-component/picker/TimePicker";
import { WeekDaysPicker } from "@/modules/ai-builder/ui-component/picker/WeekDaysPicker";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import { Tab } from "@/modules/ai-builder/ui-component/tabs/Tab";
import { TabPanel } from "@/modules/ai-builder/ui-component/tabs/TabPanel";
import { TabsList } from "@/modules/ai-builder/ui-component/tabs/TabsList";
import { TooltipWithParser } from "@/modules/ai-builder/ui-component/tooltip/TooltipWithParser";
// utils
import {
  getAvailableNodesForVariable,
  getCustomConditionOutputs,
  getInputVariables,
  initNode,
  isValidConnection,
} from "@/modules/ai-builder/utils/genericHelper";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";
import { ConfigInput } from "@/modules/ai-builder/views/agentflowsv2/ConfigInput";
import AssistantDialog from "@/modules/ai-builder/views/assistants/openai/AssistantDialog";
import DocStoreInputHandler from "@/modules/ai-builder/views/docstore/DocStoreInputHandler";
import ToolDialog from "@/modules/ai-builder/views/tools/ToolDialog";

import CredentialInputHandler from "./CredentialInputHandler";

const EDITABLE_OPTIONS = ["selectedTool", "selectedAssistant"];

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const StyledPopper = styled(Popper)({
  boxShadow:
    "0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)",
  borderRadius: "10px",
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 10,
      margin: 10,
    },
  },
});

const markdownConverter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
});

// ===========================|| NodeInputHandler ||=========================== //

const NodeInputHandler = ({
  inputAnchor,
  inputParam,
  data,
  disabled = false,
  isAdditionalParams = false,
  disablePadding = false,
  parentParamForArray = null,
  arrayIndex = null,
  onHideNodeInfoDialog,
  onCustomDataChange,
}) => {
  const { id: chatflowIdFromParams } = useParams();
  const canvasChatflow = useSelector((state) => state.canvas.chatflow);
  const chatflowId = chatflowIdFromParams || canvasChatflow?.id;

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const ref = useRef(null);
  const { reactFlowInstance, deleteEdge, onNodeDataChange } = useContext(flowContext);
  const updateNodeInternals = useUpdateNodeInternals();

  useNotifier();
  const dispatch = useDispatch();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [position, setPosition] = useState(0);
  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});
  const [showExpandRichDialog, setShowExpandRichDialog] = useState(false);
  const [expandRichDialogProps, setExpandRichDialogProps] = useState({});
  const [showAsyncOptionDialog, setAsyncOptionEditDialog] = useState("");
  const [asyncOptionEditDialogProps, setAsyncOptionEditDialogProps] = useState({});
  const [reloadTimestamp, setReloadTimestamp] = useState(Date.now().toString());
  const [showFormatPromptValuesDialog, setShowFormatPromptValuesDialog] = useState(false);
  const [formatPromptValuesDialogProps, setFormatPromptValuesDialogProps] = useState({});
  const [showPromptHubDialog, setShowPromptHubDialog] = useState(false);
  const [showManageScrapedLinksDialog, setShowManageScrapedLinksDialog] = useState(false);
  const [manageScrapedLinksDialogProps, setManageScrapedLinksDialogProps] = useState({});
  const [showInputHintDialog, setShowInputHintDialog] = useState(false);
  const [inputHintDialogProps, setInputHintDialogProps] = useState({});
  const [showConditionDialog, setShowConditionDialog] = useState(false);
  const [conditionDialogProps, setConditionDialogProps] = useState({});
  const [isNvidiaNIMDialogOpen, setIsNvidiaNIMDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Webhook secret — holds plaintext only for the current session (generate/regenerate response).
  // Cleared on page reload; the configured state comes from canvasChatflow.webhookSecretConfigured.
  const [webhookSecretPlaintext, setWebhookSecretPlaintext] = useState(null);

  const handleSetWebhookSecret = async () => {
    if (!chatflowId) return;
    try {
      const resp = await chatflowsApi.setWebhookSecret(chatflowId);
      setWebhookSecretPlaintext(resp.data.webhookSecret);
      dispatch({
        type: SET_CHATFLOW,
        chatflow: { ...canvasChatflow, webhookSecretConfigured: true },
      });
      enqueueSnackbar({
        message: "Webhook secret generated.",
        options: { key: new Date().getTime() + Math.random(), variant: "success" },
      });
    } catch (error) {
      enqueueSnackbar({
        message: error?.response?.data?.message || "Failed to generate webhook secret.",
        options: { key: new Date().getTime() + Math.random(), variant: "error" },
      });
    }
  };

  const handleClearWebhookSecret = async () => {
    if (!chatflowId) return;
    try {
      await chatflowsApi.clearWebhookSecret(chatflowId);
      setWebhookSecretPlaintext(null);
      dispatch({
        type: SET_CHATFLOW,
        chatflow: { ...canvasChatflow, webhookSecretConfigured: false },
      });
      enqueueSnackbar({
        message: "Webhook secret removed.",
        options: { key: new Date().getTime() + Math.random(), variant: "success" },
      });
    } catch (error) {
      enqueueSnackbar({
        message: error?.response?.data?.message || "Failed to remove webhook secret.",
        options: { key: new Date().getTime() + Math.random(), variant: "error" },
      });
    }
  };

  const [modelSelectionDialogOpen, setModelSelectionDialogOpen] = useState(false);
  const [availableChatModels, setAvailableChatModels] = useState([]);
  const [availableChatModelsOptions, setAvailableChatModelsOptions] = useState([]);
  const [selectedTempChatModel, setSelectedTempChatModel] = useState({});
  const [modelSelectionCallback, setModelSelectionCallback] = useState(null);
  const [loading, setLoading] = useState(false);

  const [promptGeneratorDialogOpen, setPromptGeneratorDialogOpen] = useState(false);
  const [promptGeneratorDialogProps, setPromptGeneratorDialogProps] = useState({});

  const handleDataChange = ({ inputParam, newValue }) => {
    data.inputs[inputParam.name] = newValue;
    const allowedShowHideInputTypes = [
      "boolean",
      "asyncOptions",
      "asyncMultiOptions",
      "options",
      "multiOptions",
    ];
    if (allowedShowHideInputTypes.includes(inputParam.type)) {
      if (onCustomDataChange) {
        onCustomDataChange({ nodeId: data.id, inputParam, newValue });
      } else {
        onNodeDataChange({ nodeId: data.id, inputParam, newValue });
      }
    }
  };

  const onInputHintDialogClicked = (hint) => {
    const dialogProps = {
      ...hint,
    };
    setInputHintDialogProps(dialogProps);
    setShowInputHintDialog(true);
  };

  const onExpandDialogClicked = (value, inputParam, languageType) => {
    const dialogProps = {
      value,
      inputParam,
      disabled,
      languageType,
      nodes: reactFlowInstance?.getNodes() || [],
      edges: reactFlowInstance?.getEdges() || [],
      nodeId: data.id,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    if (inputParam.acceptVariable) {
      setExpandRichDialogProps(dialogProps);
      setShowExpandRichDialog(true);
    } else {
      setExpandDialogProps(dialogProps);
      setShowExpandDialog(true);
    }
  };

  const onConditionDialogClicked = (inputParam) => {
    const dialogProps = {
      data,
      inputParam,
      disabled,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setConditionDialogProps(dialogProps);
    setShowConditionDialog(true);
    onHideNodeInfoDialog(true);
  };

  const onShowPromptHubButtonClicked = () => {
    setShowPromptHubDialog(true);
  };

  const onShowPromptHubButtonSubmit = (templates) => {
    setShowPromptHubDialog(false);
    for (const t of templates) {
      if (Object.prototype.hasOwnProperty.call(data.inputs, t.type)) {
        data.inputs[t.type] = t.template;
      }
    }
  };

  const onManageLinksDialogClicked = (url, selectedLinks, relativeLinksMethod, limit) => {
    const dialogProps = {
      url,
      relativeLinksMethod,
      limit,
      selectedLinks,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setManageScrapedLinksDialogProps(dialogProps);
    setShowManageScrapedLinksDialog(true);
  };

  const onManageLinksDialogSave = (url, links) => {
    setShowManageScrapedLinksDialog(false);
    data.inputs.url = url;
    data.inputs.selectedLinks = links;
  };

  const getJSONValue = (templateValue) => {
    if (!templateValue) return "";
    const obj = {};
    const inputVariables = getInputVariables(templateValue);
    for (const inputVariable of inputVariables) {
      obj[inputVariable] = "";
    }
    if (Object.keys(obj).length) return JSON.stringify(obj);
    return "";
  };

  const getDataGridColDef = (columns, inputParam) => {
    const colDef = [];
    for (const column of columns) {
      const stateNode = reactFlowInstance
        ? reactFlowInstance.getNodes().find((node) => node.data.name === "seqState")
        : null;
      if (column.type === "asyncSingleSelect" && column.loadMethod?.includes("loadStateKeys")) {
        if (stateNode) {
          const tabParam = stateNode.data.inputParams.find((param) => param.tabIdentifier);
          if (tabParam && tabParam.tabs.length > 0) {
            const selectedTabIdentifier = tabParam.tabIdentifier;

            const selectedTab =
              stateNode.data.inputs[`${selectedTabIdentifier}_${stateNode.data.id}`] ||
              tabParam.default ||
              tabParam.tabs[0].name;

            const datagridValues = stateNode.data.inputs[selectedTab];
            if (datagridValues) {
              try {
                const parsedDatagridValues = JSON.parse(datagridValues);
                const keys = Array.isArray(parsedDatagridValues)
                  ? parsedDatagridValues.map((item) => item.key)
                  : Object.keys(parsedDatagridValues);
                colDef.push({
                  ...column,
                  field: column.field,
                  headerName: column.headerName,
                  type: "singleSelect",
                  editable: true,
                  valueOptions: keys,
                });
              } catch (error) {
                console.error("Error parsing stateMemory", error);
              }
            }
          }
        } else {
          colDef.push({
            ...column,
            field: column.field,
            headerName: column.headerName,
            type: "singleSelect",
            editable: true,
            valueOptions: [],
          });
        }
      } else if (column.type === "freeSolo") {
        const preLoadOptions = [];
        if (column.loadMethod?.includes("getPreviousMessages")) {
          const nodes = getAvailableNodesForVariable(
            reactFlowInstance?.getNodes() || [],
            reactFlowInstance?.getEdges() || [],
            data.id,
            inputParam.id
          );
          for (const node of nodes) {
            preLoadOptions.push({
              value: `$${node.id}`,
              label: `Output from ${node.data.id}`,
            });
          }
        }
        if (column.loadMethod?.includes("loadStateKeys")) {
          if (stateNode) {
            const tabParam = stateNode.data.inputParams.find((param) => param.tabIdentifier);
            if (tabParam && tabParam.tabs.length > 0) {
              const selectedTabIdentifier = tabParam.tabIdentifier;

              const selectedTab =
                stateNode.data.inputs[`${selectedTabIdentifier}_${stateNode.data.id}`] ||
                tabParam.default ||
                tabParam.tabs[0].name;

              const datagridValues = stateNode.data.inputs[selectedTab];
              if (datagridValues) {
                try {
                  const parsedDatagridValues = JSON.parse(datagridValues);
                  const keys = Array.isArray(parsedDatagridValues)
                    ? parsedDatagridValues.map((item) => item.key)
                    : Object.keys(parsedDatagridValues);
                  for (const key of keys) {
                    preLoadOptions.push({
                      value: `$flow.state.${key}`,
                      label: `Value from ${key}`,
                    });
                  }
                } catch (error) {
                  console.error("Error parsing stateMemory", error);
                }
              }
            }
          }
        }
        colDef.push({
          ...column,
          field: column.field,
          headerName: column.headerName,
          renderEditCell: ({ id, field, value }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const apiRef = useGridApiContext();
            return (
              <Autocomplete
                id={column.field}
                freeSolo
                fullWidth
                options={[...preLoadOptions, ...column.valueOptions]}
                value={value}
                PopperComponent={StyledPopper}
                renderInput={(params) => <TextField {...params} />}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <div>
                        <strong>{option.value}</strong>
                        <br />
                        <small>{option.label}</small>
                      </div>
                    </li>
                  );
                }}
                getOptionLabel={(option) => {
                  return typeof option === "string" ? option : option.value;
                }}
                onInputChange={(event, newValue) => {
                  apiRef.current.setEditCellValue({ id, field, value: newValue });
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "50px", // Adjust this value as needed
                  },
                  "& .MuiOutlinedInput-root": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            );
          },
        });
      } else {
        colDef.push(column);
      }
    }
    return colDef;
  };

  const getDropdownOptions = (inputParam) => {
    const preLoadOptions = [];
    if (inputParam.loadPreviousNodes) {
      const nodes = getAvailableNodesForVariable(
        reactFlowInstance?.getNodes() || [],
        reactFlowInstance?.getEdges() || [],
        data.id,
        inputParam.id
      );
      for (const node of nodes) {
        preLoadOptions.push({
          name: `{{ ${node.data.id} }}`,
          label: `{{ ${node.data.id} }}`,
          description: `Output from ${node.data.id}`,
        });
      }
    }
    return [...preLoadOptions, ...inputParam.options];
  };

  const getTabValue = (inputParam) => {
    return inputParam.tabs.findIndex(
      (item) => item.name === data.inputs[`${inputParam.tabIdentifier}_${data.id}`]
    ) >= 0
      ? inputParam.tabs.findIndex(
          (item) => item.name === data.inputs[`${inputParam.tabIdentifier}_${data.id}`]
        )
      : tabValue;
  };

  const onEditJSONClicked = (value, inputParam) => {
    // Preset values if the field is format prompt values
    let inputValue = value;
    if (inputParam.name === "promptValues" && !value) {
      const templateValue =
        (data.inputs["template"] ?? "") +
        (data.inputs["systemMessagePrompt"] ?? "") +
        (data.inputs["humanMessagePrompt"] ?? "") +
        (data.inputs["workerPrompt"] ?? "");
      inputValue = getJSONValue(templateValue);
    }
    const dialogProp = {
      value: inputValue,
      inputParam,
      nodes: reactFlowInstance?.getNodes() || [],
      edges: reactFlowInstance?.getEdges() || [],
      nodeId: data.id,
      data,
    };
    setFormatPromptValuesDialogProps(dialogProp);
    setShowFormatPromptValuesDialog(true);
  };

  const onExpandDialogSave = (newValue, inputParamName) => {
    data.inputs[inputParamName] = newValue;
    setShowExpandDialog(false);
  };

  const onExpandRichDialogSave = (newValue, inputParamName) => {
    data.inputs[inputParamName] = newValue;
    setShowExpandRichDialog(false);
  };

  const onConditionDialogSave = (newData, inputParam, tabValue) => {
    data.inputs[`${inputParam.tabIdentifier}_${data.id}`] = inputParam.tabs[tabValue].name;

    const existingEdges =
      reactFlowInstance?.getEdges().filter((edge) => edge.source === data.id) || [];
    const { outputAnchors, toBeRemovedEdgeIds } = getCustomConditionOutputs(
      newData.inputs[inputParam.tabs[tabValue].name],
      data.id,
      existingEdges,
      inputParam.tabs[tabValue].type === "datagrid"
    );
    if (!outputAnchors) return;
    data.outputAnchors = outputAnchors;
    for (const edgeId of toBeRemovedEdgeIds) {
      deleteEdge(edgeId);
    }
    setShowConditionDialog(false);
    onHideNodeInfoDialog(false);
  };

  const editAsyncOption = (inputParamName, inputValue) => {
    if (inputParamName === "selectedTool") {
      setAsyncOptionEditDialogProps({
        title: "Edit Tool",
        type: "EDIT",
        cancelButtonName: "Cancel",
        confirmButtonName: "Save",
        toolId: inputValue,
      });
    } else if (inputParamName === "selectedAssistant") {
      setAsyncOptionEditDialogProps({
        title: "Edit Assistant",
        type: "EDIT",
        cancelButtonName: "Cancel",
        confirmButtonName: "Save",
        assistantId: inputValue,
      });
    }
    setAsyncOptionEditDialog(inputParamName);
  };

  const addAsyncOption = (inputParamName) => {
    if (inputParamName === "selectedTool") {
      setAsyncOptionEditDialogProps({
        title: "Add New Tool",
        type: "ADD",
        cancelButtonName: "Cancel",
        confirmButtonName: "Add",
      });
    } else if (inputParamName === "selectedAssistant") {
      setAsyncOptionEditDialogProps({
        title: "Add New Assistant",
        type: "ADD",
        cancelButtonName: "Cancel",
        confirmButtonName: "Add",
      });
    }
    setAsyncOptionEditDialog(inputParamName);
  };

  const onConfirmAsyncOption = (selectedOptionId = "") => {
    if (!selectedOptionId) {
      data.inputs[showAsyncOptionDialog] = "";
      handleDataChange({ inputParam: { name: showAsyncOptionDialog }, newValue: "" });
    } else {
      data.inputs[showAsyncOptionDialog] = selectedOptionId;
      handleDataChange({ inputParam: { name: showAsyncOptionDialog }, newValue: selectedOptionId });
      setReloadTimestamp(Date.now().toString());
    }
    setAsyncOptionEditDialogProps({});
    setAsyncOptionEditDialog("");
  };

  const handleNvidiaNIMDialogComplete = (containerData) => {
    if (containerData) {
      data.inputs["basePath"] = containerData.baseUrl;
      data.inputs["modelName"] = containerData.image;
    }
  };

  const loadChatModels = async () => {
    try {
      const resp = await assistantsApi.getChatModels();
      if (resp.data) {
        const chatModels = resp.data ?? [];
        const chatModelsOptions = chatModels.map((model) => ({
          name: model.name,
          label: model.label,
          description: model.description,
          imageSrc: `${baseURL}/api/v1/node-icon/${model.name}`,
        }));
        setAvailableChatModels(chatModels);
        setAvailableChatModelsOptions(chatModelsOptions);
      }
    } catch (error) {
      console.error("Error loading chat models:", error);
    }
  };

  const checkInputParamsMandatory = () => {
    let canSubmit = true;

    if (selectedTempChatModel && Object.keys(selectedTempChatModel).length > 0) {
      const inputParams = (selectedTempChatModel.inputParams ?? []).filter(
        (inputParam) => !inputParam.hidden
      );
      for (const inputParam of inputParams) {
        if (
          !inputParam.optional &&
          (!selectedTempChatModel.inputs[inputParam.name] || !selectedTempChatModel.credential)
        ) {
          if (inputParam.type === "credential" && !selectedTempChatModel.credential) {
            canSubmit = false;
            break;
          } else if (
            inputParam.type !== "credential" &&
            !selectedTempChatModel.inputs[inputParam.name]
          ) {
            canSubmit = false;
            break;
          }
        }
      }
    }

    return canSubmit;
  };

  const displayWarning = () => {
    enqueueSnackbar({
      message: "Please fill in all mandatory fields.",
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "warning",
        action: (key) => (
          <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
            <IconX />
          </Button>
        ),
      },
    });
  };

  const generateDocStoreToolDesc = async (storeId) => {
    if (!storeId) {
      enqueueSnackbar({
        message: "Please select a knowledge base",
        options: {
          key: new Date().getTime() + Math.random(),
          variant: "error",
          action: (key) => (
            <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
              <IconX />
            </Button>
          ),
        },
      });
      return;
    }
    storeId = storeId.split(":")[0];
    const isValid = checkInputParamsMandatory();
    if (!isValid) {
      displayWarning();
      return;
    }

    // Check if model is already selected in the node
    const currentNode = reactFlowInstance?.getNodes().find((node) => node.id === data.id);
    const currentNodeInputs = currentNode?.data?.inputs;

    const existingModel =
      currentNodeInputs?.llmModel ||
      currentNodeInputs?.agentModel ||
      currentNodeInputs?.humanInputModel;
    if (existingModel) {
      try {
        setLoading(true);
        const selectedChatModelObj = {
          name: existingModel,
          inputs:
            currentNodeInputs?.llmModelConfig ||
            currentNodeInputs?.agentModelConfig ||
            currentNodeInputs?.humanInputModelConfig,
        };
        const resp = await documentstoreApi.generateDocStoreToolDesc(storeId, {
          selectedChatModel: selectedChatModelObj,
        });
        if (resp.data) {
          setLoading(false);
          const content = resp.data?.content || resp.data.kwargs?.content;
          // Update the input value directly
          data.inputs[inputParam.name] = content;
          enqueueSnackbar({
            message: "Document Store Tool Description generated successfully",
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
        }
      } catch (error) {
        console.error("Error generating doc store tool desc", error);
        setLoading(false);
        enqueueSnackbar({
          message:
            typeof error.response.data === "object"
              ? error.response.data.message
              : error.response.data,
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
      return;
    }

    // If no model selected, load chat models and open model selection dialog
    await loadChatModels();
    setModelSelectionCallback(() => async (selectedModel) => {
      try {
        setLoading(true);
        const selectedChatModelObj = {
          name: selectedModel.name,
          inputs: selectedModel.inputs,
        };
        const resp = await documentstoreApi.generateDocStoreToolDesc(storeId, {
          selectedChatModel: selectedChatModelObj,
        });
        if (resp.data) {
          setLoading(false);
          const content = resp.data?.content || resp.data.kwargs?.content;
          // Update the input value directly
          data.inputs[inputParam.name] = content;
          enqueueSnackbar({
            message: "Document Store Tool Description generated successfully",
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
        }
      } catch (error) {
        console.error("Error generating doc store tool desc", error);
        setLoading(false);
        enqueueSnackbar({
          message:
            typeof error.response.data === "object"
              ? error.response.data.message
              : error.response.data,
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
    });
    setModelSelectionDialogOpen(true);
  };

  const generateInstruction = async () => {
    const isValid = checkInputParamsMandatory();
    if (!isValid) {
      displayWarning();
      return;
    }

    const currentNode = reactFlowInstance?.getNodes().find((node) => node.id === data.id);
    const currentNodeInputs = currentNode?.data?.inputs;

    // Check if model is already selected in the node
    const existingModel =
      currentNodeInputs?.llmModel ||
      currentNodeInputs?.agentModel ||
      currentNodeInputs?.humanInputModel;
    if (existingModel) {
      // Open prompt generator dialog directly with existing model
      setPromptGeneratorDialogProps({
        title: "Generate Instructions",
        description: "You can generate a prompt template by sharing basic details about your task.",
        data: {
          selectedChatModel: {
            name: existingModel,
            inputs:
              currentNodeInputs?.llmModelConfig ||
              currentNodeInputs?.agentModelConfig ||
              currentNodeInputs?.humanInputModelConfig,
          },
        },
      });
      setPromptGeneratorDialogOpen(true);
      return;
    }

    // If no model selected, load chat models and open model selection dialog
    await loadChatModels();
    setModelSelectionCallback(() => async (selectedModel) => {
      // After model selection, open prompt generator dialog
      setPromptGeneratorDialogProps({
        title: "Generate Instructions",
        description: "You can generate a prompt template by sharing basic details about your task.",
        data: { selectedChatModel: selectedModel },
      });
      setPromptGeneratorDialogOpen(true);
    });
    setModelSelectionDialogOpen(true);
  };

  useEffect(() => {
    if (ref.current?.offsetTop && ref.current.clientHeight) {
      setPosition(ref.current.offsetTop + ref.current.clientHeight / 2);
      updateNodeInternals(data.id);
    }
  }, [data.id, ref, updateNodeInternals]);

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.id, position, updateNodeInternals]);

  const webhookMethod = data.inputs?.webhookMethod ?? "POST";
  const webhookUrlBase = chatflowId ? `${baseURL}/api/v1/webhook/${chatflowId}` : null;
  const webhookUrl = webhookUrlBase
    ? `${webhookMethod} ${webhookUrlBase}`
    : "Save the flow first to generate the webhook URL";

  return (
    <div ref={ref}>
      {inputAnchor && (
        <>
          <CustomWidthTooltip placement="left" title={inputAnchor.type}>
            <Handle
              type="target"
              position={Position.Left}
              key={inputAnchor.id}
              id={inputAnchor.id}
              isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
              style={{
                height: 10,
                width: 10,
                backgroundColor: data.selected
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                top: position,
              }}
            />
          </CustomWidthTooltip>
          <Box sx={{ p: 2 }}>
            <Typography>
              {inputAnchor.label}
              {!inputAnchor.optional && <span style={{ color: "red" }}>&nbsp;*</span>}
              {inputAnchor.description && (
                <TooltipWithParser style={{ marginLeft: 10 }} title={inputAnchor.description} />
              )}
            </Typography>
          </Box>
        </>
      )}

      {((inputParam && !inputParam.additionalParams) || isAdditionalParams) && (
        <>
          {inputParam.acceptVariable && !isAdditionalParams && (
            <CustomWidthTooltip placement="left" title={inputParam.type}>
              <Handle
                type="target"
                position={Position.Left}
                key={inputParam.id}
                id={inputParam.id}
                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: data.selected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  top: position,
                }}
              />
            </CustomWidthTooltip>
          )}
          <Box sx={{ p: disablePadding ? 0 : 2 }}>
            {(data.name === "promptTemplate" || data.name === "chatPromptTemplate") &&
              (inputParam.name === "template" || inputParam.name === "systemMessagePrompt") && (
                <>
                  <Button
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                    disabled={disabled}
                    sx={{ borderRadius: 25, width: "100%", mb: 2, mt: 0 }}
                    variant="outlined"
                    onClick={() => onShowPromptHubButtonClicked()}
                    endIcon={<IconAutoFixHigh />}
                  >
                    Langchain Hub
                  </Button>
                  <PromptLangsmithHubDialog
                    promptType={inputParam.name}
                    show={showPromptHubDialog}
                    onCancel={() => setShowPromptHubDialog(false)}
                    onSubmit={onShowPromptHubButtonSubmit}
                  />
                </>
              )}
            {data.name === "chatNvidiaNIM" && inputParam.name === "modelName" && (
              <Button
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
                sx={{ borderRadius: "12px", width: "100%", mb: 2, mt: -1 }}
                variant="outlined"
                onClick={() => setIsNvidiaNIMDialogOpen(true)}
              >
                Setup NIM Locally
              </Button>
            )}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Typography>
                {inputParam.label}
                {!inputParam.optional && <span style={{ color: "red" }}>&nbsp;*</span>}
                {inputParam.description && (
                  <TooltipWithParser style={{ marginLeft: 10 }} title={inputParam.description} />
                )}
              </Typography>
              <div style={{ flexGrow: 1 }} />
              {inputParam.hint && !isAdditionalParams && (
                <IconButton
                  size="small"
                  sx={{
                    height: 25,
                    width: 25,
                  }}
                  title={inputParam.hint.label}
                  color="secondary"
                  onClick={() => onInputHintDialogClicked(inputParam.hint)}
                >
                  <IconBulb />
                </IconButton>
              )}
              {inputParam.hint && isAdditionalParams && (
                <Button
                  sx={{ p: 0, px: 2 }}
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    onInputHintDialogClicked(inputParam.hint);
                  }}
                  startIcon={<IconBulb size={17} />}
                >
                  {inputParam.hint.label}
                </Button>
              )}
              {inputParam.acceptVariable && inputParam.type === "string" && (
                <Tooltip title="Type {{ to select variables">
                  <IconVariable size={20} style={{ color: "teal" }} />
                </Tooltip>
              )}
              {inputParam.generateDocStoreDescription && (
                <IconButton
                  title="Generate knowledge base description"
                  sx={{
                    height: 25,
                    width: 25,
                  }}
                  size="small"
                  color="secondary"
                  onClick={() => generateDocStoreToolDesc(data.inputs["documentStore"])}
                >
                  <IconWand />
                </IconButton>
              )}
              {inputParam.generateInstruction && (
                <IconButton
                  title="Generate instructions"
                  sx={{
                    height: 25,
                    width: 25,
                    ml: 0.5,
                  }}
                  size="small"
                  color="secondary"
                  onClick={() => generateInstruction()}
                >
                  <IconWand />
                </IconButton>
              )}
              {((inputParam.type === "string" && inputParam.rows) ||
                inputParam.type === "code") && (
                <IconButton
                  size="small"
                  sx={{
                    height: 25,
                    width: 25,
                    ml: 0.5,
                  }}
                  title="Expand"
                  color="primary"
                  onClick={() =>
                    onExpandDialogClicked(
                      data.inputs[inputParam.name] ?? inputParam.default ?? "",
                      inputParam
                    )
                  }
                >
                  <IconArrowsMaximize />
                </IconButton>
              )}
            </div>
            {inputParam.warning && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 10,
                  background: "rgb(254,252,191)",
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <IconAlertTriangle size={30} color="orange" />
                <span style={{ color: "rgb(116,66,16)", marginLeft: 10 }}>
                  {parser(inputParam.warning)}
                </span>
              </div>
            )}
            {inputParam.type === "credential" && (
              <CredentialInputHandler
                disabled={disabled}
                data={data}
                inputParam={inputParam}
                onSelect={(newValue) => {
                  data.credential = newValue;
                  data.inputs[FLOWISE_CREDENTIAL_ID] = newValue; // in case data.credential is not updated
                }}
              />
            )}
            {inputParam.type === "tabs" && (
              <>
                <Tabs
                  value={getTabValue(inputParam)}
                  onChange={(event, val) => {
                    setTabValue(val);
                    data.inputs[`${inputParam.tabIdentifier}_${data.id}`] =
                      inputParam.tabs[val].name;
                  }}
                  aria-label="tabs"
                  variant="fullWidth"
                  defaultValue={getTabValue(inputParam)}
                >
                  <TabsList>
                    {inputParam.tabs.map((inputChildParam, index) => (
                      <Tab key={index}>{inputChildParam.label}</Tab>
                    ))}
                  </TabsList>
                </Tabs>
                {inputParam.tabs
                  .filter((inputParam) => inputParam.display !== false)
                  .map((inputChildParam, index) => (
                    <TabPanel key={index} value={getTabValue(inputParam)} index={index}>
                      <NodeInputHandler
                        disabled={inputChildParam.disabled}
                        inputParam={inputChildParam}
                        data={data}
                        isAdditionalParams
                        disablePadding
                      />
                    </TabPanel>
                  ))}
              </>
            )}
            {inputParam.type === "file" && (
              <File
                disabled={disabled}
                fileType={inputParam.fileType || "*"}
                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                value={
                  data.inputs[inputParam.name] ?? inputParam.default ?? "Choose a file to upload"
                }
              />
            )}
            {inputParam.type === "boolean" && (
              <SwitchInput
                disabled={disabled}
                onChange={(newValue) => handleDataChange({ inputParam, newValue })}
                value={data.inputs[inputParam.name] ?? inputParam.default ?? false}
              />
            )}
            {inputParam.type === "datagrid" && (
              <DataGrid
                disabled={disabled}
                columns={getDataGridColDef(inputParam.datagrid, inputParam)}
                hideFooter
                rows={data.inputs[inputParam.name] ?? JSON.stringify(inputParam.default) ?? []}
                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
              />
            )}
            {inputParam.type === "code" && (
              <>
                <div
                  style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}
                >
                  {inputParam.codeExample && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        data.inputs[inputParam.name] = inputParam.codeExample;
                        setReloadTimestamp(Date.now().toString());
                      }}
                    >
                      See Example
                    </Button>
                  )}
                </div>
                <div
                  key={`${reloadTimestamp}_${data.id}}`}
                  style={{
                    marginTop: "10px",
                    border: "1px solid",
                    borderColor: theme.palette.grey[900] + 25,
                    borderRadius: "6px",
                    height: inputParam.rows ? "100px" : "200px",
                  }}
                >
                  <CodeEditor
                    disabled={disabled}
                    value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                    height={inputParam.rows ? "100px" : "200px"}
                    theme={theme.palette.mode === "dark" ? "dark" : "light"}
                    lang={"js"}
                    placeholder={inputParam.placeholder}
                    onValueChange={(code) => (data.inputs[inputParam.name] = code)}
                    basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                  />
                </div>
              </>
            )}

            {inputParam.name === "webhookURL" && (
              <TextField
                fullWidth
                size="small"
                disabled
                value={webhookUrl}
                sx={{ mt: 1 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: chatflowId ? (
                    <InputAdornment position="end">
                      <Tooltip title="Copy URL">
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(webhookUrlBase).then(
                              () =>
                                enqueueSnackbar({
                                  message: "URL copied!",
                                  options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: "success",
                                  },
                                }),
                              () =>
                                enqueueSnackbar({
                                  message: "Failed to copy URL.",
                                  options: {
                                    key: new Date().getTime() + Math.random(),
                                    variant: "error",
                                  },
                                })
                            );
                          }}
                        >
                          {/* Match the Start node's accent green (#7EE787) so the copy
                                                        action reads as a "primary" action on this node. */}
                          <IconCopy size={16} color="#7EE787" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : undefined,
                }}
              />
            )}

            {inputParam.name === "webhookSecret" && (
              <Box sx={{ mt: 1 }}>
                {!canvasChatflow?.webhookSecretConfigured && !webhookSecretPlaintext ? (
                  // Not configured
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Alert
                      severity="warning"
                      variant="outlined"
                      sx={{
                        py: 0.5,
                        color: theme.palette.mode === "dark"
                          ? "rgba(255, 215, 130, 0.95)"
                          : "warning.dark",
                        borderColor: theme.palette.mode === "dark"
                          ? "rgba(255, 167, 38, 0.5)"
                          : "warning.light",
                        backgroundColor: theme.palette.mode === "dark"
                          ? "rgba(255, 167, 38, 0.08)"
                          : "rgba(255, 244, 229, 0.6)",
                        "& .MuiAlert-icon": {
                          color: theme.palette.mode === "dark"
                            ? "rgba(255, 167, 38, 0.95)"
                            : "warning.main",
                        },
                      }}
                    >
                      Generate a secret below — without one, every incoming webhook request will be
                      rejected.
                    </Alert>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "text.secondary", flexGrow: 1 }}>
                        No secret configured
                      </Typography>
                      {chatflowId && (
                        <Button size="small" variant="outlined" onClick={handleSetWebhookSecret}>
                          Generate Secret
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : (
                  // Configured — show masked or plaintext field with actions
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    disabled
                    value={webhookSecretPlaintext ?? "••••••••••••••••••••••••"}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end" sx={{ gap: 0.5 }}>
                          {webhookSecretPlaintext && (
                            <Tooltip title="Copy secret">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(webhookSecretPlaintext).then(
                                    () =>
                                      enqueueSnackbar({
                                        message: "Secret copied!",
                                        options: {
                                          key: new Date().getTime() + Math.random(),
                                          variant: "success",
                                        },
                                      }),
                                    () =>
                                      enqueueSnackbar({
                                        message: "Failed to copy secret.",
                                        options: {
                                          key: new Date().getTime() + Math.random(),
                                          variant: "error",
                                        },
                                      })
                                  );
                                }}
                              >
                                <IconCopy size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Regenerate secret">
                            <IconButton size="small" onClick={handleSetWebhookSecret}>
                              <IconRefresh size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove secret">
                            <IconButton size="small" onClick={handleClearWebhookSecret}>
                              <IconX size={16} />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Box>
            )}

            {inputParam.name !== "webhookURL" &&
              inputParam.name !== "webhookSecret" &&
              (inputParam.type === "string" ||
                inputParam.type === "password" ||
                inputParam.type === "number") &&
              (inputParam?.acceptVariable &&
              (window.location.href.includes("agentcanvas") ||
                window.location.href.includes("v2/marketplace")) ? (
                <RichInput
                  key={data.inputs[inputParam.name]}
                  placeholder={inputParam.placeholder}
                  disabled={disabled}
                  inputParam={inputParam}
                  onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                  value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                  nodes={reactFlowInstance ? reactFlowInstance.getNodes() : []}
                  edges={reactFlowInstance ? reactFlowInstance.getEdges() : []}
                  nodeId={data.id}
                />
              ) : (
                <Input
                  key={data.inputs[inputParam.name]}
                  placeholder={inputParam.placeholder}
                  disabled={disabled}
                  inputParam={inputParam}
                  onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                  value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                  nodes={[]}
                  edges={[]}
                  nodeId={data.id}
                />
              ))}
            {inputParam.type === "json" && (
              <>
                {!inputParam?.acceptVariable && (
                  <JsonEditorInput
                    disabled={disabled}
                    onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                    value={
                      data.inputs[inputParam.name] ||
                      inputParam.default ||
                      getJSONValue(data.inputs["workerPrompt"]) ||
                      ""
                    }
                    isSequentialAgent={data.category === "Sequential Agents"}
                    isDarkMode={theme.palette.mode === "dark"}
                  />
                )}
                {inputParam?.acceptVariable && (
                  <>
                    <Button
                      sx={{
                        borderRadius: 25,
                        width: "100%",
                        mb: 0,
                        mt: 2,
                      }}
                      variant="outlined"
                      disabled={disabled}
                      onClick={() =>
                        onEditJSONClicked(data.inputs[inputParam.name] ?? "", inputParam)
                      }
                    >
                      {inputParam.label}
                    </Button>
                    <FormatPromptValuesDialog
                      show={showFormatPromptValuesDialog}
                      dialogProps={formatPromptValuesDialogProps}
                      onCancel={() => setShowFormatPromptValuesDialog(false)}
                      onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                    />
                  </>
                )}
              </>
            )}
            {inputParam.type === "options" && (
              <div key={`${data.id}_${JSON.stringify(data.inputs[inputParam.name])}`}>
                <Dropdown
                  disabled={disabled}
                  name={inputParam.name}
                  options={getDropdownOptions(inputParam)}
                  freeSolo={inputParam.freeSolo}
                  onSelect={(newValue) => handleDataChange({ inputParam, newValue })}
                  value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
                />
              </div>
            )}
            {inputParam.type === "multiOptions" && (
              <div key={`${data.id}_${JSON.stringify(data.inputs[inputParam.name])}`}>
                <MultiDropdown
                  disabled={disabled}
                  name={inputParam.name}
                  options={getDropdownOptions(inputParam)}
                  onSelect={(newValue) => handleDataChange({ inputParam, newValue })}
                  value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
                />
              </div>
            )}
            {(inputParam.type === "asyncOptions" || inputParam.type === "asyncMultiOptions") && (
              <>
                {data.inputParams.length === 1 && <div style={{ marginTop: 10 }} />}
                <div
                  key={`${reloadTimestamp}_${data.id}_${JSON.stringify(
                    data.inputs[inputParam.name]
                  )}`}
                  style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                >
                  <AsyncDropdown
                    disabled={disabled}
                    name={inputParam.name}
                    nodeData={data}
                    value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
                    freeSolo={inputParam.freeSolo}
                    multiple={inputParam.type === "asyncMultiOptions"}
                    isCreateNewOption={EDITABLE_OPTIONS.includes(inputParam.name)}
                    onSelect={(newValue) => {
                      if (inputParam.loadConfig) setReloadTimestamp(Date.now().toString());
                      handleDataChange({ inputParam, newValue });
                    }}
                    onCreateNew={() => addAsyncOption(inputParam.name)}
                  />
                  {EDITABLE_OPTIONS.includes(inputParam.name) && data.inputs[inputParam.name] && (
                    <IconButton
                      title="Edit"
                      color="primary"
                      size="small"
                      onClick={() => editAsyncOption(inputParam.name, data.inputs[inputParam.name])}
                    >
                      <IconEdit />
                    </IconButton>
                  )}
                  {inputParam.refresh && (
                    <IconButton
                      title="Refresh"
                      color="primary"
                      size="small"
                      onClick={() => setReloadTimestamp(Date.now().toString())}
                    >
                      <IconRefresh />
                    </IconButton>
                  )}
                </div>
              </>
            )}
            {inputParam.type === "timePicker" && (
              <TimePicker
                disabled={disabled}
                value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                placeholder={inputParam.placeholder}
                onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              />
            )}
            {inputParam.type === "weekDaysPicker" && (
              <WeekDaysPicker
                disabled={disabled}
                value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                options={inputParam.options}
                onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              />
            )}
            {inputParam.type === "monthDaysPicker" && (
              <MonthDaysPicker
                disabled={disabled}
                value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              />
            )}
            {inputParam.type === "datePicker" && (
              <DatePicker
                disabled={disabled}
                value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                placeholder={inputParam.placeholder}
                onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              />
            )}
            {inputParam.type === "array" && (
              <ArrayRenderer inputParam={inputParam} data={data} disabled={disabled} />
            )}
            {/* CUSTOM INPUT LOGIC */}
            {inputParam.type.includes("conditionFunction") && (
              <Button
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
                sx={{ borderRadius: "12px", width: "100%", mt: 1 }}
                variant="outlined"
                onClick={() => onConditionDialogClicked(inputParam)}
              >
                {inputParam.label}
              </Button>
            )}
            {(data.name === "cheerioWebScraper" ||
              data.name === "puppeteerWebScraper" ||
              data.name === "playwrightWebScraper") &&
              inputParam.name === "url" && (
                <>
                  <Button
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                    disabled={disabled}
                    sx={{ borderRadius: "12px", width: "100%", mt: 1 }}
                    variant="outlined"
                    onClick={() =>
                      onManageLinksDialogClicked(
                        data.inputs[inputParam.name] ?? inputParam.default ?? "",
                        data.inputs.selectedLinks,
                        data.inputs["relativeLinksMethod"] ?? "webCrawl",
                        parseInt(data.inputs["limit"]) ?? 0
                      )
                    }
                  >
                    Manage Links
                  </Button>
                  <ManageScrapedLinksDialog
                    show={showManageScrapedLinksDialog}
                    dialogProps={manageScrapedLinksDialogProps}
                    onCancel={() => setShowManageScrapedLinksDialog(false)}
                    onSave={onManageLinksDialogSave}
                  />
                </>
              )}
            {inputParam.loadConfig && data?.inputs?.[inputParam.name] && (
              <ConfigInput
                key={`${data.id}_${JSON.stringify(data.inputs[inputParam.name])}_${arrayIndex}_${
                  parentParamForArray?.name
                }`}
                data={data}
                inputParam={inputParam}
                disabled={disabled}
                arrayIndex={arrayIndex}
                parentParamForArray={parentParamForArray}
              />
            )}
          </Box>
        </>
      )}
      <ToolDialog
        show={showAsyncOptionDialog === "selectedTool"}
        dialogProps={asyncOptionEditDialogProps}
        onCancel={() => setAsyncOptionEditDialog("")}
        onConfirm={onConfirmAsyncOption}
      />
      <AssistantDialog
        show={showAsyncOptionDialog === "selectedAssistant"}
        dialogProps={asyncOptionEditDialogProps}
        onCancel={() => setAsyncOptionEditDialog("")}
        onConfirm={onConfirmAsyncOption}
      />
      <ExpandTextDialog
        show={showExpandDialog}
        dialogProps={expandDialogProps}
        onCancel={() => setShowExpandDialog(false)}
        onConfirm={(newValue, inputParamName) => onExpandDialogSave(newValue, inputParamName)}
        onInputHintDialogClicked={onInputHintDialogClicked}
      />
      <ExpandRichInputDialog
        show={showExpandRichDialog}
        dialogProps={expandRichDialogProps}
        onCancel={() => setShowExpandRichDialog(false)}
        onConfirm={(newValue, inputParamName) => onExpandRichDialogSave(newValue, inputParamName)}
        onInputHintDialogClicked={onInputHintDialogClicked}
      />
      <ConditionDialog
        show={showConditionDialog}
        dialogProps={conditionDialogProps}
        onCancel={() => {
          setShowConditionDialog(false);
          onHideNodeInfoDialog(false);
        }}
        onConfirm={(newData, inputParam, tabValue) =>
          onConditionDialogSave(newData, inputParam, tabValue)
        }
      />
      <InputHintDialog
        show={showInputHintDialog}
        dialogProps={inputHintDialogProps}
        onCancel={() => setShowInputHintDialog(false)}
      />
      <NvidiaNIMDialog
        open={isNvidiaNIMDialogOpen}
        onClose={() => setIsNvidiaNIMDialogOpen(false)}
        onComplete={handleNvidiaNIMDialogComplete}
      />
      <Dialog
        open={modelSelectionDialogOpen}
        onClose={() => {
          setModelSelectionDialogOpen(false);
          setSelectedTempChatModel({});
        }}
        aria-labelledby="model-selection-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="model-selection-dialog-title">Select Model</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ px: 2 }}>
              <Dropdown
                name={"chatModel"}
                options={availableChatModelsOptions ?? []}
                onSelect={(newValue) => {
                  if (!newValue) {
                    setSelectedTempChatModel({});
                  } else {
                    const foundChatComponent = availableChatModels.find(
                      (chatModel) => chatModel.name === newValue
                    );
                    if (foundChatComponent) {
                      const chatModelId = `${foundChatComponent.name}_0`;
                      const clonedComponent = cloneDeep(foundChatComponent);
                      const initChatModelData = initNode(clonedComponent, chatModelId);
                      setSelectedTempChatModel(initChatModelData);
                    }
                  }
                }}
                value={selectedTempChatModel?.name ?? "choose an option"}
              />
            </Box>
            {selectedTempChatModel && Object.keys(selectedTempChatModel).length > 0 && (
              <Box sx={{ mt: 2 }}>
                {(selectedTempChatModel.inputParams ?? [])
                  .filter((inputParam) => !inputParam.hidden)
                  .map((inputParam, index) => (
                    <DocStoreInputHandler
                      key={index}
                      inputParam={inputParam}
                      data={selectedTempChatModel}
                    />
                  ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModelSelectionDialogOpen(false);
              setSelectedTempChatModel({});
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedTempChatModel || Object.keys(selectedTempChatModel).length === 0}
            onClick={async () => {
              setModelSelectionDialogOpen(false);
              if (modelSelectionCallback) {
                await modelSelectionCallback(selectedTempChatModel);
              }
              setSelectedTempChatModel({});
            }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <PromptGeneratorDialog
        show={promptGeneratorDialogOpen}
        dialogProps={promptGeneratorDialogProps}
        onCancel={() => setPromptGeneratorDialogOpen(false)}
        onConfirm={(generatedInstruction) => {
          try {
            if (inputParam?.acceptVariable && window.location.href.includes("agentcanvas")) {
              const htmlContent = markdownConverter.makeHtml(generatedInstruction);
              data.inputs[inputParam.name] = htmlContent;
            } else {
              data.inputs[inputParam.name] = generatedInstruction;
            }
            setPromptGeneratorDialogOpen(false);
          } catch (_error) {
            enqueueSnackbar({
              message: "Error setting generated instruction",
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
        }}
      />
      {loading && <BackdropLoader open={loading} />}
    </div>
  );
};

NodeInputHandler.propTypes = {
  inputAnchor: PropTypes.object,
  inputParam: PropTypes.object,
  data: PropTypes.object,
  disabled: PropTypes.bool,
  isAdditionalParams: PropTypes.bool,
  disablePadding: PropTypes.bool,
  parentParamForArray: PropTypes.object,
  arrayIndex: PropTypes.number,
  onCustomDataChange: PropTypes.func,
  onHideNodeInfoDialog: PropTypes.func,
};

export default NodeInputHandler;
