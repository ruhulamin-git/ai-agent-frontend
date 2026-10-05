import Embeddings from "@mui/icons-material/DynamicFeed";
import DynamicFeed from "@mui/icons-material/Filter1";
import Storage from "@mui/icons-material/Storage";
// material-ui
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
// icons
import {
  IconClock,
  IconDeviceFloppy,
  IconEditCircle,
  IconRefresh,
  IconRowInsertTop,
  IconX,
} from "@tabler/icons-react";
import { cloneDeep } from "lodash";
import moment from "moment/moment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// API
import documentsApi from "@/modules/ai-builder/api/documentstore";
import nodesApi from "@/modules/ai-builder/api/nodes";
import ErrorBoundary from "@/modules/ai-builder/ErrorBoundary";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
import { useAuth } from "@/modules/ai-builder/hooks/useAuth";
import ViewHeader from "@/modules/ai-builder/layout/MainLayout/ViewHeader";
// Store
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
} from "@/modules/ai-builder/store/actions";
import { baseURL } from "@/modules/ai-builder/store/constant";
import { useError } from "@/modules/ai-builder/store/context/ErrorContext";
// project imports
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
import { BackdropLoader } from "@/modules/ai-builder/ui-component/loading/BackdropLoader";
// utils
import {
  getFileName,
  initNode,
  showHideInputParams,
} from "@/modules/ai-builder/utils/genericHelper";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";
import ComponentsListDialog from "@/modules/ai-builder/views/docstore/ComponentsListDialog";
import DocStoreInputHandler from "@/modules/ai-builder/views/docstore/DocStoreInputHandler";
import UpsertResultDialog from "@/modules/ai-builder/views/vectorstore/UpsertResultDialog";

import UpsertHistoryDetailsDialog from "./UpsertHistoryDetailsDialog";
import UpsertHistorySideDrawer from "./UpsertHistorySideDrawer";

// const
const steps = ["Embeddings", "Vector Store", "Record Manager"];

const VectorStoreConfigure = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hasAssignedWorkspace } = useAuth();
  useNotifier();
  const { error, setError } = useError();
  const customization = useSelector((state) => state.customization);

  const { storeId, docId } = useParams();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const getSpecificDocumentStoreApi = useApi(documentsApi.getSpecificDocumentStore);
  const insertIntoVectorStoreApi = useApi(documentsApi.insertIntoVectorStore);
  const saveVectorStoreConfigApi = useApi(documentsApi.saveVectorStoreConfig);
  const getEmbeddingNodeDetailsApi = useApi(nodesApi.getSpecificNode);
  const getVectorStoreNodeDetailsApi = useApi(nodesApi.getSpecificNode);
  const getRecordManagerNodeDetailsApi = useApi(nodesApi.getSpecificNode);

  const [loading, setLoading] = useState(true);
  const [documentStore, setDocumentStore] = useState({});
  const [dialogProps, setDialogProps] = useState({});
  const [currentLoader, setCurrentLoader] = useState(null);

  const [showEmbeddingsListDialog, setShowEmbeddingsListDialog] = useState(false);
  const [selectedEmbeddingsProvider, setSelectedEmbeddingsProvider] = useState({});

  const [showVectorStoreListDialog, setShowVectorStoreListDialog] = useState(false);
  const [selectedVectorStoreProvider, setSelectedVectorStoreProvider] = useState({});

  const [showRecordManagerListDialog, setShowRecordManagerListDialog] = useState(false);
  const [selectedRecordManagerProvider, setSelectedRecordManagerProvider] = useState({});
  const [isRecordManagerUnavailable, setRecordManagerUnavailable] = useState(false);

  const [showUpsertHistoryDialog, setShowUpsertHistoryDialog] = useState(false);
  const [upsertResultDialogProps, setUpsertResultDialogProps] = useState({});

  const [showUpsertHistorySideDrawer, setShowUpsertHistorySideDrawer] = useState(false);
  const [upsertHistoryDrawerDialogProps, setUpsertHistoryDrawerDialogProps] = useState({});

  const [showUpsertHistoryDetailsDialog, setShowUpsertHistoryDetailsDialog] = useState(false);
  const [upsertDetailsDialogProps, setUpsertDetailsDialogProps] = useState({});

  const handleEmbeddingsProviderDataChange = ({ inputParam, newValue }) => {
    setSelectedEmbeddingsProvider((prevData) => {
      const updatedData = { ...prevData };
      updatedData.inputs[inputParam.name] = newValue;
      updatedData.inputParams = showHideInputParams(updatedData);
      return updatedData;
    });
  };

  const handleVectorStoreProviderDataChange = ({ inputParam, newValue }) => {
    setSelectedVectorStoreProvider((prevData) => {
      const updatedData = { ...prevData };
      updatedData.inputs[inputParam.name] = newValue;
      updatedData.inputParams = showHideInputParams(updatedData);
      return updatedData;
    });
  };

  const handleRecordManagerProviderDataChange = ({ inputParam, newValue }) => {
    setSelectedRecordManagerProvider((prevData) => {
      const updatedData = { ...prevData };
      updatedData.inputs[inputParam.name] = newValue;
      updatedData.inputParams = showHideInputParams(updatedData);
      return updatedData;
    });
  };

  const onEmbeddingsSelected = (component) => {
    const nodeData = cloneDeep(initNode(component, uuidv4()));
    if (!showEmbeddingsListDialog && documentStore.embeddingConfig) {
      nodeData.inputs = documentStore.embeddingConfig.config;
      nodeData.credential = documentStore.embeddingConfig.config.credential;
    }
    setSelectedEmbeddingsProvider(nodeData);
    setShowEmbeddingsListDialog(false);
  };

  const showEmbeddingsList = () => {
    const dialogProp = {
      title: "Select Embeddings Provider",
    };
    setDialogProps(dialogProp);
    setShowEmbeddingsListDialog(true);
  };

  const onVectorStoreSelected = (component) => {
    const nodeData = cloneDeep(initNode(component, uuidv4()));
    if (!nodeData.inputAnchors.find((anchor) => anchor.name === "recordManager")) {
      setRecordManagerUnavailable(true);
      setSelectedRecordManagerProvider({});
    } else {
      setRecordManagerUnavailable(false);
    }
    if (!showVectorStoreListDialog && documentStore.vectorStoreConfig) {
      nodeData.inputs = documentStore.vectorStoreConfig.config;
      nodeData.credential = documentStore.vectorStoreConfig.config.credential;
    }
    setSelectedVectorStoreProvider(nodeData);
    setShowVectorStoreListDialog(false);
  };

  const showVectorStoreList = () => {
    const dialogProp = {
      title: "Select a Vector Store Provider",
    };
    setDialogProps(dialogProp);
    setShowVectorStoreListDialog(true);
  };

  const onRecordManagerSelected = (component) => {
    const nodeData = cloneDeep(initNode(component, uuidv4()));
    if (!showRecordManagerListDialog && documentStore.recordManagerConfig) {
      nodeData.inputs = documentStore.recordManagerConfig.config;
      nodeData.credential = documentStore.recordManagerConfig.config.credential;
    }
    setSelectedRecordManagerProvider(nodeData);
    setShowRecordManagerListDialog(false);
  };

  const showRecordManagerList = () => {
    const dialogProp = {
      title: "Select a Record Manager",
    };
    setDialogProps(dialogProp);
    setShowRecordManagerListDialog(true);
  };

  const showUpsertHistoryDrawer = () => {
    const dialogProp = {
      id: storeId,
    };
    setUpsertHistoryDrawerDialogProps(dialogProp);
    setShowUpsertHistorySideDrawer(true);
  };

  const onSelectHistoryDetails = (history) => {
    const props = {
      title: moment(history.date).format("DD-MMM-YYYY, hh:mm:ss A"),
      numAdded: history.result.numAdded,
      numUpdated: history.result.numUpdated,
      numSkipped: history.result.numSkipped,
      numDeleted: history.result.numDeleted,
      flowData: history.flowData,
    };
    setUpsertDetailsDialogProps(props);
    setShowUpsertHistoryDetailsDialog(true);
  };

  const checkMandatoryFields = () => {
    let canSubmit = true;
    const inputParams = (selectedVectorStoreProvider?.inputParams ?? []).filter(
      (inputParam) => !inputParam.hidden
    );
    for (const inputParam of inputParams) {
      if (
        !inputParam.optional &&
        (!selectedVectorStoreProvider.inputs[inputParam.name] ||
          !selectedVectorStoreProvider.credential)
      ) {
        if (inputParam.type === "credential" && !selectedVectorStoreProvider.credential) {
          canSubmit = false;
          break;
        } else if (
          inputParam.type !== "credential" &&
          !selectedVectorStoreProvider.inputs[inputParam.name]
        ) {
          canSubmit = false;
          break;
        }
      }
    }

    const inputParams2 = (selectedEmbeddingsProvider?.inputParams ?? []).filter(
      (inputParam) => !inputParam.hidden
    );
    for (const inputParam of inputParams2) {
      if (
        !inputParam.optional &&
        (!selectedEmbeddingsProvider.inputs[inputParam.name] ||
          !selectedEmbeddingsProvider.credential)
      ) {
        if (inputParam.type === "credential" && !selectedEmbeddingsProvider.credential) {
          canSubmit = false;
          break;
        } else if (
          inputParam.type !== "credential" &&
          !selectedEmbeddingsProvider.inputs[inputParam.name]
        ) {
          canSubmit = false;
          break;
        }
      }
    }

    if (!canSubmit) {
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
    }
    return canSubmit;
  };

  const prepareConfigData = () => {
    const data = {
      storeId: storeId,
      docId: docId,
      isStrictSave: true,
    };
    // Set embedding config
    if (selectedEmbeddingsProvider.inputs) {
      data.embeddingConfig = {};
      data.embeddingName = selectedEmbeddingsProvider.name;
      Object.keys(selectedEmbeddingsProvider.inputs).map((key) => {
        if (key === "FLOWISE_CREDENTIAL_ID") {
          data.embeddingConfig["credential"] = selectedEmbeddingsProvider.inputs[key];
        } else {
          data.embeddingConfig[key] = selectedEmbeddingsProvider.inputs[key];
        }
      });
    } else {
      data.embeddingConfig = null;
      data.embeddingName = "";
    }

    // Set vector store config
    if (selectedVectorStoreProvider.inputs) {
      data.vectorStoreConfig = {};
      data.vectorStoreName = selectedVectorStoreProvider.name;
      Object.keys(selectedVectorStoreProvider.inputs).map((key) => {
        if (key === "FLOWISE_CREDENTIAL_ID") {
          data.vectorStoreConfig["credential"] = selectedVectorStoreProvider.inputs[key];
        } else {
          data.vectorStoreConfig[key] = selectedVectorStoreProvider.inputs[key];
        }
      });
    } else {
      data.vectorStoreConfig = null;
      data.vectorStoreName = "";
    }

    // Set record manager config
    if (selectedRecordManagerProvider.inputs) {
      data.recordManagerConfig = {};
      data.recordManagerName = selectedRecordManagerProvider.name;
      Object.keys(selectedRecordManagerProvider.inputs).map((key) => {
        if (key === "FLOWISE_CREDENTIAL_ID") {
          data.recordManagerConfig["credential"] = selectedRecordManagerProvider.inputs[key];
        } else {
          data.recordManagerConfig[key] = selectedRecordManagerProvider.inputs[key];
        }
      });
    } else {
      data.recordManagerConfig = null;
      data.recordManagerName = "";
    }

    return data;
  };

  const tryAndInsertIntoStore = () => {
    if (checkMandatoryFields()) {
      setLoading(true);
      const data = prepareConfigData();
      insertIntoVectorStoreApi.request(data);
    }
  };

  const saveVectorStoreConfig = () => {
    setLoading(true);
    const data = prepareConfigData();
    saveVectorStoreConfigApi.request(data);
  };

  const resetVectorStoreConfig = () => {
    setSelectedEmbeddingsProvider({});
    setSelectedVectorStoreProvider({});
    setSelectedRecordManagerProvider({});
  };

  const getActiveStep = () => {
    if (selectedRecordManagerProvider && Object.keys(selectedRecordManagerProvider).length > 0) {
      return 3;
    }
    if (selectedVectorStoreProvider && Object.keys(selectedVectorStoreProvider).length > 0) {
      return 2;
    }
    if (selectedEmbeddingsProvider && Object.keys(selectedEmbeddingsProvider).length > 0) {
      return 1;
    }
    return 0;
  };

  const Steps = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={getActiveStep()} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  const isRecordManagerDisabled = () => {
    return Object.keys(selectedVectorStoreProvider).length === 0 || isRecordManagerUnavailable;
  };

  const isVectorStoreDisabled = () => {
    return Object.keys(selectedEmbeddingsProvider).length === 0;
  };

  const getLoaderDisplayName = (loader) => {
    if (!loader) return "";

    const loaderName = loader.loaderName || "Unknown";
    let sourceName = "";

    // Prefer files.name when files array exists and has items
    if (loader.files && Array.isArray(loader.files) && loader.files.length > 0) {
      sourceName = loader.files.map((file) => file.name).join(", ");
    } else if (loader.source) {
      // Fallback to source logic
      if (typeof loader.source === "string" && loader.source.includes("base64")) {
        sourceName = getFileName(loader.source);
      } else if (
        typeof loader.source === "string" &&
        loader.source.startsWith("[") &&
        loader.source.endsWith("]")
      ) {
        sourceName = JSON.parse(loader.source).join(", ");
      } else if (typeof loader.source === "string") {
        sourceName = loader.source;
      }
    }

    // Return format: "LoaderName (sourceName)" or just "LoaderName" if no source
    return sourceName ? `${loaderName} (${sourceName})` : loaderName;
  };

  const getViewHeaderTitle = () => {
    const storeName = getSpecificDocumentStoreApi.data?.name || "";
    if (docId && currentLoader) {
      const loaderName = getLoaderDisplayName(currentLoader);
      return `${storeName} / ${loaderName}`;
    }
    return storeName;
  };

  useEffect(() => {
    if (saveVectorStoreConfigApi.data) {
      setLoading(false);
      enqueueSnackbar({
        message: "Configuration saved successfully",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveVectorStoreConfigApi.data]);

  useEffect(() => {
    if (insertIntoVectorStoreApi.data) {
      setLoading(false);
      setShowUpsertHistoryDialog(true);
      setUpsertResultDialogProps({ ...insertIntoVectorStoreApi.data, goToRetrievalQuery: true });
    }
  }, [insertIntoVectorStoreApi.data]);

  useEffect(() => {
    if (insertIntoVectorStoreApi.error) {
      setLoading(false);
      setError(insertIntoVectorStoreApi.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertIntoVectorStoreApi.error]);

  useEffect(() => {
    if (saveVectorStoreConfigApi.error) {
      setLoading(false);
      setError(saveVectorStoreConfigApi.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveVectorStoreConfigApi.error]);

  useEffect(() => {
    getSpecificDocumentStoreApi.request(storeId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getSpecificDocumentStoreApi.data) {
      const docStore = getSpecificDocumentStoreApi.data;
      if (!hasAssignedWorkspace(docStore.workspaceId)) {
        router.push("/unauthorized");
        return;
      }
      setDocumentStore(docStore);

      // Find the current loader if docId is provided
      if (docId && docStore.loaders) {
        const loader = docStore.loaders.find((l) => l.id === docId);
        if (loader) {
          setCurrentLoader(loader);
        }
      }

      if (docStore.embeddingConfig) {
        getEmbeddingNodeDetailsApi.request(docStore.embeddingConfig.name);
      }
      if (docStore.vectorStoreConfig) {
        getVectorStoreNodeDetailsApi.request(docStore.vectorStoreConfig.name);
      }
      if (docStore.recordManagerConfig) {
        getRecordManagerNodeDetailsApi.request(docStore.recordManagerConfig.name);
      }
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSpecificDocumentStoreApi.data]);

  useEffect(() => {
    if (getEmbeddingNodeDetailsApi.data) {
      const node = getEmbeddingNodeDetailsApi.data;
      onEmbeddingsSelected(node);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEmbeddingNodeDetailsApi.data]);

  useEffect(() => {
    if (getVectorStoreNodeDetailsApi.data) {
      const node = getVectorStoreNodeDetailsApi.data;
      onVectorStoreSelected(node);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVectorStoreNodeDetailsApi.data]);

  useEffect(() => {
    if (getRecordManagerNodeDetailsApi.data) {
      const node = getRecordManagerNodeDetailsApi.data;
      onRecordManagerSelected(node);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordManagerNodeDetailsApi.data]);

  useEffect(() => {
    if (getSpecificDocumentStoreApi.error) {
      setError(getSpecificDocumentStoreApi.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSpecificDocumentStoreApi.error]);

  return (
    <>
      <MainCard>
        {error ? (
          <ErrorBoundary error={error} />
        ) : (
          <>
            {!storeId && <div />}
            {storeId && (
              <Stack flexDirection="column" sx={{ gap: 3 }}>
                <ViewHeader
                  isBackButton
                  search={false}
                  title={getViewHeaderTitle()}
                  description="Configure Embeddings, Vector Store and Record Manager"
                  onBack={() => router.back()}
                >
                  {(Object.keys(selectedEmbeddingsProvider).length > 0 ||
                    Object.keys(selectedVectorStoreProvider).length > 0) && (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        borderRadius: 2,
                        height: "100%",
                      }}
                      startIcon={<IconRefresh />}
                      onClick={() => resetVectorStoreConfig()}
                    >
                      Reset
                    </Button>
                  )}
                  {(Object.keys(selectedEmbeddingsProvider).length > 0 ||
                    Object.keys(selectedVectorStoreProvider).length > 0) && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        borderRadius: 2,
                        height: "100%",
                      }}
                      startIcon={<IconDeviceFloppy />}
                      onClick={() => saveVectorStoreConfig()}
                    >
                      Save Config
                    </Button>
                  )}
                  {Object.keys(selectedEmbeddingsProvider).length > 0 &&
                    Object.keys(selectedVectorStoreProvider).length > 0 && (
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          height: "100%",
                          backgroundImage: `linear-gradient(to right, #13547a, #2f9e91)`,
                          "&:hover": {
                            backgroundImage: `linear-gradient(to right, #0b3d5b, #1a8377)`,
                          },
                        }}
                        startIcon={<IconRowInsertTop />}
                        onClick={() => tryAndInsertIntoStore()}
                      >
                        Upsert
                      </Button>
                    )}
                  <IconButton
                    onClick={showUpsertHistoryDrawer}
                    size="small"
                    color="inherit"
                    title="Upsert History"
                  >
                    <IconClock />
                  </IconButton>
                </ViewHeader>
                <Steps />
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4} md={4}>
                    {Object.keys(selectedEmbeddingsProvider).length === 0 ? (
                      <Button
                        onClick={showEmbeddingsList}
                        fullWidth
                        startIcon={
                          <Embeddings
                            style={{ background: "transparent", height: 32, width: 32 }}
                          />
                        }
                        sx={{
                          color: customization?.isDarkMode ? "white" : "inherit",
                          borderRadius: "10px",
                          minHeight: "200px",
                          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 20%)",
                          backgroundImage: customization?.isDarkMode
                            ? `linear-gradient(to right, #e654bc, #4b86e7)`
                            : `linear-gradient(to right, #fadef2, #cfdcf1)`,
                          "&:hover": {
                            backgroundImage: customization?.isDarkMode
                              ? `linear-gradient(to right, #de32ac, #2d73e7)`
                              : `linear-gradient(to right, #f6c2e7, #b4cbf1)`,
                          },
                        }}
                      >
                        Select Embeddings
                      </Button>
                    ) : (
                      <Box>
                        <Grid container spacing="2">
                          <Grid item xs={12} md={12} lg={12} sm={12}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingRight: 15,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  p: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    display: "flex",
                                    boxShadow: "0 2px 14px 0 rgb(32 40 45 / 25%)",
                                  }}
                                >
                                  {selectedEmbeddingsProvider.label ? (
                                    <img
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        padding: 7,
                                        borderRadius: "50%",
                                        objectFit: "contain",
                                      }}
                                      alt={selectedEmbeddingsProvider.label ?? "embeddings"}
                                      src={`${baseURL}/api/v1/node-icon/${selectedEmbeddingsProvider?.name}`}
                                    />
                                  ) : (
                                    <Embeddings color="black" />
                                  )}
                                </div>
                                <Typography sx={{ ml: 2 }} variant="h3">
                                  {selectedEmbeddingsProvider.label}
                                </Typography>
                                <div style={{ flex: 1 }} />
                                <div
                                  style={{
                                    display: "flex",
                                    alignContent: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  {Object.keys(selectedEmbeddingsProvider).length > 0 && (
                                    <IconButton
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                      color="secondary"
                                      onClick={showEmbeddingsList}
                                    >
                                      <IconEditCircle />
                                    </IconButton>
                                  )}
                                </div>
                              </Box>
                              {selectedEmbeddingsProvider &&
                                Object.keys(selectedEmbeddingsProvider).length > 0 &&
                                showHideInputParams(selectedEmbeddingsProvider)
                                  .filter(
                                    (inputParam) =>
                                      !inputParam.hidden && inputParam.display !== false
                                  )
                                  .map((inputParam, index) => (
                                    <DocStoreInputHandler
                                      key={index}
                                      data={selectedEmbeddingsProvider}
                                      inputParam={inputParam}
                                      isAdditionalParams={inputParam.additionalParams}
                                      onNodeDataChange={handleEmbeddingsProviderDataChange}
                                    />
                                  ))}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    {Object.keys(selectedVectorStoreProvider).length === 0 ? (
                      <Button
                        onClick={showVectorStoreList}
                        fullWidth
                        startIcon={
                          <Storage style={{ background: "transparent", height: 32, width: 32 }} />
                        }
                        sx={{
                          color: customization?.isDarkMode ? "white" : "inherit",
                          borderRadius: "10px",
                          minHeight: "200px",
                          opacity: isVectorStoreDisabled() ? 0.7 : 1,
                          boxShadow: isVectorStoreDisabled()
                            ? "none"
                            : "0 2px 14px 0 rgb(32 40 45 / 20%)",
                          backgroundImage: customization?.isDarkMode
                            ? `linear-gradient(to right, #4d8ef1, #f1de5c)`
                            : `linear-gradient(to right, #b9d0f4, #fef9d7)`,
                          "&:hover": {
                            backgroundImage: customization?.isDarkMode
                              ? `linear-gradient(to right, #2576f2, #f0d72e)`
                              : `linear-gradient(to right, #9cbdf2, #fcf3b6)`,
                          },
                        }}
                        disabled={isVectorStoreDisabled()}
                      >
                        Select Vector Store
                      </Button>
                    ) : (
                      <Box>
                        <Grid container spacing="2">
                          <Grid item xs={12} md={12} lg={12} sm={12}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingRight: 15,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  p: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 14px 0 rgb(32 40 45 / 25%)",
                                  }}
                                >
                                  {selectedVectorStoreProvider.label ? (
                                    <img
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        padding: 7,
                                        borderRadius: "50%",
                                        objectFit: "contain",
                                      }}
                                      alt={selectedVectorStoreProvider.label ?? "embeddings"}
                                      src={`${baseURL}/api/v1/node-icon/${selectedVectorStoreProvider?.name}`}
                                    />
                                  ) : (
                                    <Embeddings color="black" />
                                  )}
                                </div>
                                <Typography sx={{ ml: 2 }} variant="h3">
                                  {selectedVectorStoreProvider.label}
                                </Typography>
                                <div style={{ flex: 1 }} />
                                <div
                                  style={{
                                    display: "flex",
                                    alignContent: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  {Object.keys(selectedVectorStoreProvider).length > 0 && (
                                    <IconButton
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                      color="secondary"
                                      onClick={showVectorStoreList}
                                    >
                                      <IconEditCircle />
                                    </IconButton>
                                  )}
                                </div>
                              </Box>
                              {selectedVectorStoreProvider &&
                                Object.keys(selectedVectorStoreProvider).length > 0 &&
                                showHideInputParams(selectedVectorStoreProvider)
                                  .filter(
                                    (inputParam) =>
                                      !inputParam.hidden && inputParam.display !== false
                                  )
                                  .map((inputParam, index) => (
                                    <DocStoreInputHandler
                                      key={index}
                                      data={selectedVectorStoreProvider}
                                      inputParam={inputParam}
                                      isAdditionalParams={inputParam.additionalParams}
                                      onNodeDataChange={handleVectorStoreProviderDataChange}
                                    />
                                  ))}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    {Object.keys(selectedRecordManagerProvider).length === 0 ? (
                      <Button
                        onClick={showRecordManagerList}
                        fullWidth
                        startIcon={
                          isRecordManagerUnavailable ? null : (
                            <DynamicFeed
                              style={{ background: "transparent", height: 32, width: 32 }}
                            />
                          )
                        }
                        sx={{
                          color: customization?.isDarkMode ? "white" : "inherit",
                          borderRadius: "10px",
                          minHeight: "200px",
                          opacity: isRecordManagerDisabled() ? 0.7 : 1,
                          boxShadow: isRecordManagerDisabled()
                            ? "none"
                            : "0 2px 14px 0 rgb(32 40 45 / 20%)",
                          backgroundImage: customization?.isDarkMode
                            ? `linear-gradient(to right, #f5db3f, #42daa7)`
                            : `linear-gradient(to right, #f9f1c0, #c7f1e3)`,
                          "&:hover": {
                            backgroundImage: customization?.isDarkMode
                              ? `linear-gradient(to right, #d9c238, #3dc295)`
                              : `linear-gradient(to right, #f6e99b, #a0f2d7)`,
                          },
                        }}
                        disabled={isRecordManagerDisabled()}
                      >
                        {isRecordManagerUnavailable
                          ? "Record Manager is not applicable for selected Vector Store"
                          : "Select Record Manager"}
                      </Button>
                    ) : (
                      <Box>
                        <Grid container spacing="2">
                          <Grid item xs={12} md={12} lg={12} sm={12}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingRight: 15,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  p: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 14px 0 rgb(32 40 45 / 25%)",
                                  }}
                                >
                                  {selectedRecordManagerProvider.label ? (
                                    <img
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        padding: 7,
                                        borderRadius: "50%",
                                        objectFit: "contain",
                                      }}
                                      alt={selectedRecordManagerProvider.label ?? "embeddings"}
                                      src={`${baseURL}/api/v1/node-icon/${selectedRecordManagerProvider?.name}`}
                                    />
                                  ) : (
                                    <Embeddings color="black" />
                                  )}
                                </div>
                                <Typography sx={{ ml: 2 }} variant="h3">
                                  {selectedRecordManagerProvider.label}
                                </Typography>
                                <div style={{ flex: 1 }} />
                                <div
                                  style={{
                                    display: "flex",
                                    alignContent: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  {Object.keys(selectedRecordManagerProvider).length > 0 && (
                                    <IconButton
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                      color="secondary"
                                      onClick={showRecordManagerList}
                                    >
                                      <IconEditCircle />
                                    </IconButton>
                                  )}
                                </div>
                              </Box>
                              {selectedRecordManagerProvider &&
                                Object.keys(selectedRecordManagerProvider).length > 0 &&
                                showHideInputParams(selectedRecordManagerProvider)
                                  .filter(
                                    (inputParam) =>
                                      !inputParam.hidden && inputParam.display !== false
                                  )
                                  .map((inputParam, index) => (
                                    <DocStoreInputHandler
                                      key={index}
                                      data={selectedRecordManagerProvider}
                                      inputParam={inputParam}
                                      isAdditionalParams={inputParam.additionalParams}
                                      onNodeDataChange={handleRecordManagerProviderDataChange}
                                    />
                                  ))}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Stack>
            )}
          </>
        )}
      </MainCard>

      {showEmbeddingsListDialog && (
        <ComponentsListDialog
          show={showEmbeddingsListDialog}
          dialogProps={dialogProps}
          onCancel={() => setShowEmbeddingsListDialog(false)}
          apiCall={documentsApi.getEmbeddingProviders}
          onSelected={onEmbeddingsSelected}
        />
      )}
      {showVectorStoreListDialog && (
        <ComponentsListDialog
          show={showVectorStoreListDialog}
          dialogProps={dialogProps}
          onCancel={() => setShowVectorStoreListDialog(false)}
          apiCall={documentsApi.getVectorStoreProviders}
          onSelected={onVectorStoreSelected}
        />
      )}
      {showRecordManagerListDialog && (
        <ComponentsListDialog
          show={showRecordManagerListDialog}
          dialogProps={dialogProps}
          onCancel={() => setShowRecordManagerListDialog(false)}
          apiCall={documentsApi.getRecordManagerProviders}
          onSelected={onRecordManagerSelected}
        />
      )}
      {showUpsertHistoryDialog && (
        <UpsertResultDialog
          show={showUpsertHistoryDialog}
          dialogProps={upsertResultDialogProps}
          onCancel={() => {
            setShowUpsertHistoryDialog(false);
          }}
          onGoToRetrievalQuery={() => router.push("/ai-builder/document-stores/query/" + storeId)}
        />
      )}
      {showUpsertHistorySideDrawer && (
        <UpsertHistorySideDrawer
          show={showUpsertHistorySideDrawer}
          dialogProps={upsertHistoryDrawerDialogProps}
          onClickFunction={() => setShowUpsertHistorySideDrawer(false)}
          onSelectHistoryDetails={onSelectHistoryDetails}
        />
      )}
      {showUpsertHistoryDetailsDialog && (
        <UpsertHistoryDetailsDialog
          show={showUpsertHistoryDetailsDialog}
          dialogProps={upsertDetailsDialogProps}
          onCancel={() => setShowUpsertHistoryDetailsDialog(false)}
        />
      )}
      <ConfirmDialog />
      {loading && <BackdropLoader open={loading} />}
    </>
  );
};

export default VectorStoreConfigure;
