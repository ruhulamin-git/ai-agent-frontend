import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// material-ui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconArrowsMaximize, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
// store
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import ExpandTextDialog from "@/modules/ai-builder/ui-component/dialog/ExpandTextDialog";
import { CodeEditor } from "@/modules/ai-builder/ui-component/editor/CodeEditor";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const sampleFunction = `// Access chat history as a string
const chatHistory = JSON.stringify($flow.chatHistory, null, 2); 

// Return a modified response
return $flow.rawOutput + " This is a post processed response!";`;

const PostProcessing = ({ dialogProps }) => {
  const dispatch = useDispatch();

  useNotifier();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [postProcessingEnabled, setPostProcessingEnabled] = useState(false);
  const [postProcessingFunction, setPostProcessingFunction] = useState("");
  const [chatbotConfig, setChatbotConfig] = useState({});
  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});

  const handleChange = (value) => {
    setPostProcessingEnabled(value);
  };

  const onExpandDialogClicked = (value) => {
    const dialogProps = {
      value,
      inputParam: {
        label: "Post Processing Function",
        name: "postProcessingFunction",
        type: "code",
        placeholder: sampleFunction,
        hideCodeExecute: true,
      },
      languageType: "js",
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setExpandDialogProps(dialogProps);
    setShowExpandDialog(true);
  };

  const onSave = async () => {
    try {
      const value = {
        postProcessing: {
          enabled: postProcessingEnabled,
          customFunction: JSON.stringify(postProcessingFunction),
        },
      };
      chatbotConfig.postProcessing = value.postProcessing;
      const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
        chatbotConfig: JSON.stringify(chatbotConfig),
      });
      if (saveResp.data) {
        enqueueSnackbar({
          message: "Post Processing Settings Saved",
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
        dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data });
      }
    } catch (error) {
      enqueueSnackbar({
        message: `Failed to save Post Processing Settings: ${
          typeof error.response.data === "object"
            ? error.response.data.message
            : error.response.data
        }`,
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
  };

  useEffect(() => {
    if (dialogProps.chatflow?.chatbotConfig) {
      const chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig);
      setChatbotConfig(chatbotConfig || {});
      if (chatbotConfig.postProcessing) {
        setPostProcessingEnabled(chatbotConfig.postProcessing.enabled);
        if (chatbotConfig.postProcessing.customFunction) {
          setPostProcessingFunction(JSON.parse(chatbotConfig.postProcessing.customFunction));
        }
      }
    }

    return () => {};
  }, [dialogProps]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <SwitchInput
          label="Enable Post Processing"
          onChange={handleChange}
          value={postProcessingEnabled}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Typography>JS Function</Typography>
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            onClick={() => {
              setPostProcessingFunction(sampleFunction);
            }}
          >
            See Example
          </Button>
          <div style={{ flex: 1 }} />
          <IconButton
            size="small"
            sx={{
              height: 25,
              width: 25,
            }}
            title="Expand"
            color="primary"
            onClick={() => onExpandDialogClicked(postProcessingFunction)}
          >
            <IconArrowsMaximize />
          </IconButton>
        </Box>

        <div
          style={{
            marginTop: "10px",
            border: "1px solid",
            borderColor: customization.isDarkMode
              ? "rgba(255,255,255,0.12)"
              : theme.palette.grey["300"],
            borderRadius: "6px",
            height: "200px",
            width: "100%",
          }}
        >
          <CodeEditor
            value={postProcessingFunction}
            height="200px"
            theme={customization.isDarkMode ? "dark" : "light"}
            lang={"js"}
            placeholder={sampleFunction}
            onValueChange={(code) => setPostProcessingFunction(code)}
            basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
          />
        </div>
      </Box>
      <Card
        elevation={0}
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: customization.isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
          mt: 2,
          mb: 2,
        }}
      >
        <Accordion
          disableGutters
          sx={{
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Available Variables
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ boxShadow: "none", bgcolor: "transparent" }}
            >
              <Table size="small" aria-label="available variables table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "30%",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        py: 1.5,
                        borderColor: customization.isDarkMode
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.08)",
                      }}
                    >
                      Variable
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "15%",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        py: 1.5,
                        borderColor: customization.isDarkMode
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.08)",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "55%",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        py: 1.5,
                        borderColor: customization.isDarkMode
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.08)",
                      }}
                    >
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    "& td": {
                      fontSize: "0.8rem",
                      py: 1.5,
                      borderColor: customization.isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.06)",
                    },
                    "& tr:last-child td": { border: 0 },
                  }}
                >
                  <TableRow>
                    <TableCell>
                      <code>$flow.rawOutput</code>
                    </TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>The raw output response from the flow</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.input</code>
                    </TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>The user input message</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.chatHistory</code>
                    </TableCell>
                    <TableCell>array</TableCell>
                    <TableCell>Array of previous messages in the conversation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.chatflowId</code>
                    </TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>Unique identifier for the chatflow</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.sessionId</code>
                    </TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>Current session identifier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.chatId</code>
                    </TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>Current chat identifier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.sourceDocuments</code>
                    </TableCell>
                    <TableCell>array</TableCell>
                    <TableCell>Source documents used in retrieval (if applicable)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.usedTools</code>
                    </TableCell>
                    <TableCell>array</TableCell>
                    <TableCell>List of tools used during execution</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.artifacts</code>
                    </TableCell>
                    <TableCell>array</TableCell>
                    <TableCell>List of artifacts generated during execution</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <code>$flow.fileAnnotations</code>
                    </TableCell>
                    <TableCell>array</TableCell>
                    <TableCell>File annotations associated with the response</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
        <StyledButton
          variant="contained"
          disabled={!postProcessingFunction || postProcessingFunction?.trim().length === 0}
          onClick={onSave}
          sx={{ minWidth: 100 }}
        >
          Save
        </StyledButton>
      </Box>
      <ExpandTextDialog
        show={showExpandDialog}
        dialogProps={expandDialogProps}
        onCancel={() => setShowExpandDialog(false)}
        onConfirm={(newValue) => {
          setPostProcessingFunction(newValue);
          setShowExpandDialog(false);
        }}
      />
    </>
  );
};

PostProcessing.propTypes = {
  dialogProps: PropTypes.object,
};

export default PostProcessing;
