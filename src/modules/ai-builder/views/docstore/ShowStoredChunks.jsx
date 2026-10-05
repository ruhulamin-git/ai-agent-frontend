import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReactJson = dynamic(() => import("flowise-react-json-view"), { ssr: false });

// material-ui
import { Box, Button, Card, Grid, IconButton, Stack, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import { IconChevronLeft, IconChevronRight, IconLanguage, IconX } from "@tabler/icons-react";

// API
import documentsApi from "@/modules/ai-builder/api/documentstore";
import chunks_emptySVG from "@/modules/ai-builder/assets/images/chunks_empty.svg";
import ErrorBoundary from "@/modules/ai-builder/ErrorBoundary";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
import { useAuth } from "@/modules/ai-builder/hooks/useAuth";
import useConfirm from "@/modules/ai-builder/hooks/useConfirm";
import ViewHeader from "@/modules/ai-builder/layout/MainLayout/ViewHeader";
// store
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
} from "@/modules/ai-builder/store/actions";
import { useError } from "@/modules/ai-builder/store/context/ErrorContext";
// project imports
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
import { BackdropLoader } from "@/modules/ai-builder/ui-component/loading/BackdropLoader";
import { getFileName } from "@/modules/ai-builder/utils/genericHelper";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

import ExpandedChunkDialog from "./ExpandedChunkDialog";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  background: theme.palette.card.main,
  color: theme.darkTextPrimary,
  overflow: "auto",
  position: "relative",
  boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
  cursor: "pointer",
  "&:hover": {
    background: theme.palette.card.hover,
    boxShadow: "0 2px 14px 0 rgb(32 40 45 / 20%)",
  },
  maxHeight: "250px",
  minHeight: "250px",
  maxWidth: "100%",
  overflowWrap: "break-word",
  whiteSpace: "pre-line",
  padding: 1,
}));

const ShowStoredChunks = () => {
  const customization = useSelector((state) => state.customization);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { confirm } = useConfirm();
  const { error } = useError();
  const { hasAssignedWorkspace } = useAuth();

  useNotifier();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const getChunksApi = useApi(documentsApi.getFileChunks);

  const { storeId, fileId } = useParams();

  const [documentChunks, setDocumentChunks] = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [loading, setLoading] = useState(false);
  const [showExpandedChunkDialog, setShowExpandedChunkDialog] = useState(false);
  const [expandedChunkDialogProps, setExpandedChunkDialogProps] = useState({});
  const [fileNames, setFileNames] = useState([]);
  const [loaderDisplayName, setLoaderDisplayName] = useState("");

  const chunkSelected = (chunkId) => {
    const selectedChunk = documentChunks.find((chunk) => chunk.id === chunkId);
    const selectedChunkNumber = documentChunks.findIndex((chunk) => chunk.id === chunkId) + start;
    const dialogProps = {
      data: {
        selectedChunk,
        selectedChunkNumber,
      },
    };
    setExpandedChunkDialogProps(dialogProps);
    setShowExpandedChunkDialog(true);
  };

  const onChunkEdit = async (newPageContent, newMetadata, chunk) => {
    setLoading(true);
    setShowExpandedChunkDialog(false);
    try {
      const editResp = await documentsApi.editChunkFromStore(
        chunk.storeId,
        chunk.docId,
        chunk.id,
        { pageContent: newPageContent, metadata: newMetadata },
        true
      );
      if (editResp.data) {
        enqueueSnackbar({
          message: "Document chunk successfully edited!",
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
        getChunksApi.request(storeId, fileId, currentPage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar({
        message: `Failed to edit chunk: ${
          typeof error.response?.data === "object"
            ? error.response.data.message
            : (error.response?.data || error.message)
        }`,
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
    }
  };

  const onDeleteChunk = async (chunk) => {
    const confirmPayload = {
      title: `Delete`,
      description: `Delete chunk ${chunk.id} ? This action cannot be undone.`,
      confirmButtonName: "Delete",
      cancelButtonName: "Cancel",
    };
    const isConfirmed = await confirm(confirmPayload);

    if (isConfirmed) {
      setLoading(true);
      setShowExpandedChunkDialog(false);
      try {
        const delResp = await documentsApi.deleteChunkFromStore(
          chunk.storeId,
          chunk.docId,
          chunk.id
        );
        if (delResp.data) {
          enqueueSnackbar({
            message: "Document chunk successfully deleted!",
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
          getChunksApi.request(storeId, fileId, currentPage);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        enqueueSnackbar({
          message: `Failed to delete chunk: ${
            typeof error.response?.data === "object"
              ? error.response.data.message
              : (error.response?.data || error.message)
          }`,
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
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getChunksApi.request(storeId, fileId, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePage = (newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
    getChunksApi.request(storeId, fileId, newPage);
  };

  useEffect(() => {
    if (getChunksApi.data) {
      const data = getChunksApi.data;
      const workspaceId = data.workspaceId;
      if (!hasAssignedWorkspace(workspaceId)) {
        router.push("/unauthorized");
        return;
      }
      setTotalChunks(data.count);
      setDocumentChunks(data.chunks);
      setLoading(false);
      setCurrentPage(data.currentPage);
      setStart(data.currentPage * 50 - 49);
      setEnd(data.currentPage * 50 > data.count ? data.count : data.currentPage * 50);

      // Build the loader display name in format "LoaderName (sourceName)"
      const loaderName = data.file?.loaderName || data.storeName || "";
      let sourceName = "";

      if (data.file?.files && data.file.files.length > 0) {
        const fileNames = [];
        for (const attachedFile of data.file.files) {
          fileNames.push(attachedFile.name);
        }
        setFileNames(fileNames);
        sourceName = fileNames.join(", ");
      } else if (data.file?.source) {
        const source = data.file.source;
        if (typeof source === "string" && source.includes("base64")) {
          sourceName = getFileName(source);
        } else if (typeof source === "string" && source.startsWith("[") && source.endsWith("]")) {
          sourceName = JSON.parse(source).join(", ");
        } else if (typeof source === "string") {
          sourceName = source;
        }
      }

      // Set display name in format "LoaderName (sourceName)" or just "LoaderName"
      const displayName = sourceName ? `${loaderName} (${sourceName})` : loaderName;
      setLoaderDisplayName(displayName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getChunksApi.data]);

  return (
    <>
      <MainCard style={{ position: "relative" }}>
        {error ? (
          <ErrorBoundary error={error} />
        ) : (
          <Stack flexDirection="column" sx={{ gap: 1 }}>
            <ViewHeader
              isBackButton
              search={false}
              title={loaderDisplayName}
              description={getChunksApi.data?.file?.splitterName || getChunksApi.data?.description}
              onBack={() => router.back()}
            />
            <div style={{ width: "100%" }}>
              {fileNames.length > 0 && (
                <Grid sx={{ mt: 1 }} container>
                  {fileNames.map((fileName, index) => (
                    <div
                      key={index}
                      style={{
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        fontSize: "0.9rem",
                        width: "max-content",
                        borderRadius: "25px",
                        boxShadow: customization.isDarkMode
                          ? "0 2px 14px 0 rgb(255 255 255 / 20%)"
                          : "0 2px 14px 0 rgb(32 40 45 / 20%)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: "10px",
                      }}
                    >
                      {fileName}
                    </div>
                  ))}
                </Grid>
              )}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  overflow: "hidden",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    marginRight: 20,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => changePage(currentPage - 1)}
                    style={{ marginRight: 10 }}
                    variant="outlined"
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft
                      color={
                        customization.isDarkMode
                          ? currentPage === 1
                            ? "#616161"
                            : "white"
                          : currentPage === 1
                          ? "#e0e0e0"
                          : "black"
                      }
                    />
                  </IconButton>
                  Showing {Math.min(start, totalChunks)}-{end} of {totalChunks} chunks
                  <IconButton
                    size="small"
                    onClick={() => changePage(currentPage + 1)}
                    style={{ marginLeft: 10 }}
                    variant="outlined"
                    disabled={end >= totalChunks}
                  >
                    <IconChevronRight
                      color={
                        customization.isDarkMode
                          ? end >= totalChunks
                            ? "#616161"
                            : "white"
                          : end >= totalChunks
                          ? "#e0e0e0"
                          : "black"
                      }
                    />
                  </IconButton>
                </div>
                <div
                  style={{
                    marginRight: 20,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IconLanguage style={{ marginRight: 10 }} size={20} />
                  {getChunksApi.data?.characters?.toLocaleString()} characters
                </div>
              </div>
            </div>
            <div>
              <Grid container spacing={2}>
                {!documentChunks.length && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ mt: 5, p: 2, height: "auto" }}>
                      <img
                        style={{ objectFit: "cover", height: "16vh", width: "auto" }}
                        src={chunks_emptySVG?.src || chunks_emptySVG}
                        alt="chunks_emptySVG"
                      />
                    </Box>
                    <div>No Chunks</div>
                  </div>
                )}
                {documentChunks.length > 0 &&
                  documentChunks.map((row, index) => (
                    <Grid item lg={4} md={4} sm={6} xs={6} key={index}>
                      <CardWrapper
                        content={false}
                        onClick={() => chunkSelected(row.id)}
                        sx={{
                          border: 1,
                          borderColor: theme.palette.grey[900] + 25,
                          borderRadius: 2,
                        }}
                      >
                        <Card>
                          <CardContent sx={{ p: 2 }}>
                            <Typography sx={{ wordWrap: "break-word", mb: 1 }} variant="h5">
                              {`#${row.chunkNo}. Characters: ${row.pageContent.length}`}
                            </Typography>
                            <Typography sx={{ wordWrap: "break-word" }} variant="body2">
                              {row.pageContent}
                            </Typography>
                            <ReactJson
                              theme={customization.isDarkMode ? "ocean" : "rjv-default"}
                              style={{ paddingTop: 10 }}
                              src={row.metadata ? JSON.parse(row.metadata) : {}}
                              name={null}
                              quotesOnKeys={false}
                              enableClipboard={false}
                              displayDataTypes={false}
                              collapsed={1}
                            />
                          </CardContent>
                        </Card>
                      </CardWrapper>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </Stack>
        )}
      </MainCard>
      <ConfirmDialog />
      <ExpandedChunkDialog
        show={showExpandedChunkDialog}
        dialogProps={expandedChunkDialogProps}
        onCancel={() => setShowExpandedChunkDialog(false)}
        onChunkEdit={(newPageContent, newMetadata, selectedChunk) =>
          onChunkEdit(newPageContent, newMetadata, selectedChunk)
        }
        onDeleteChunk={(selectedChunk) => onDeleteChunk(selectedChunk)}
      />
      {loading && <BackdropLoader open={loading} />}
    </>
  );
};

export default ShowStoredChunks;
