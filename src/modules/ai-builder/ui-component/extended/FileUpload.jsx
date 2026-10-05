import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// material-ui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { IconBulb, IconX } from "@tabler/icons-react";
import parser from "html-react-parser";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/modules/ai-builder/store/actions";
// Project import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
// store
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const message = `The full contents of uploaded files will be converted to text and sent to the Agent.
<br />
Refer <a href='https://docs.flowiseai.com/using-flowise/uploads#files' target='_blank' style='color: #2196f3'>docs</a> for more details.`;

const availableFileTypes = [
  { name: "CSS", ext: "text/css", extension: ".css" },
  { name: "CSV", ext: "text/csv", extension: ".csv" },
  { name: "HTML", ext: "text/html", extension: ".html" },
  { name: "JSON", ext: "application/json", extension: ".json" },
  { name: "Markdown", ext: "text/markdown", extension: ".md" },
  { name: "YAML", ext: "application/x-yaml", extension: ".yaml" },
  { name: "PDF", ext: "application/pdf", extension: ".pdf" },
  { name: "SQL", ext: "application/sql", extension: ".sql" },
  { name: "Text File", ext: "text/plain", extension: ".txt" },
  { name: "XML", ext: "application/xml", extension: ".xml" },
  { name: "DOC", ext: "application/msword", extension: ".doc" },
  {
    name: "DOCX",
    ext: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: ".docx",
  },
  {
    name: "XLSX",
    ext: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: ".xlsx",
  },
  {
    name: "PPTX",
    ext: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    extension: ".pptx",
  },
];

const FileUpload = ({ dialogProps }) => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [fullFileUpload, setFullFileUpload] = useState(false);
  const [allowedFileTypes, setAllowedFileTypes] = useState([]);
  const [chatbotConfig, setChatbotConfig] = useState({});
  const [pdfUsage, setPdfUsage] = useState("perPage");
  const handleChange = (value) => {
    setFullFileUpload(value);
  };

  const handleAllowedFileTypesChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setAllowedFileTypes((prev) => [...prev, value]);
    } else {
      setAllowedFileTypes((prev) => prev.filter((item) => item !== value));
    }
  };

  const handlePdfUsageChange = (event) => {
    setPdfUsage(event.target.value);
  };

  const onSave = async () => {
    try {
      const value = {
        status: fullFileUpload,
        allowedUploadFileTypes: allowedFileTypes.join(","),
        pdfFile: {
          usage: pdfUsage,
        },
      };
      chatbotConfig.fullFileUpload = value;

      const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
        chatbotConfig: JSON.stringify(chatbotConfig),
      });
      if (saveResp.data) {
        enqueueSnackbar({
          message: "File Upload Configuration Saved",
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
        message: `Failed to save File Upload Configuration: ${
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
    /* backward compatibility - by default, allow all */
    const allowedFileTypes = availableFileTypes.map((fileType) => fileType.ext);
    setAllowedFileTypes(allowedFileTypes);
    if (dialogProps.chatflow) {
      if (dialogProps.chatflow.chatbotConfig) {
        try {
          const chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig);
          setChatbotConfig(chatbotConfig || {});
          if (chatbotConfig.fullFileUpload) {
            setFullFileUpload(chatbotConfig.fullFileUpload.status);
          }
          if (chatbotConfig.fullFileUpload?.allowedUploadFileTypes) {
            const allowedFileTypes = chatbotConfig.fullFileUpload.allowedUploadFileTypes.split(",");
            setAllowedFileTypes(allowedFileTypes);
          }
          if (chatbotConfig.fullFileUpload?.pdfFile?.usage) {
            setPdfUsage(chatbotConfig.fullFileUpload.pdfFile.usage);
          }
        } catch (_e) {
          setChatbotConfig({});
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
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "start",
          gap: 3,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            borderRadius: "8px",
            bgcolor: "rgba(34, 197, 94, 0.08)",
            border: "1px solid",
            borderColor: "rgba(34, 197, 94, 0.2)",
            width: "100%",
            px: 1.75,
            py: 1.25,
          }}
        >
          <IconBulb size={20} color="#16a34a" style={{ flexShrink: 0 }} />
          <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem", lineHeight: 1.5 }}>
            {parser(message)}
          </Typography>
        </Box>
        <SwitchInput
          label="Enable Full File Upload"
          onChange={handleChange}
          value={fullFileUpload}
        />
      </Box>

      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
        Allow Uploads of Type
      </Typography>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 15,
          padding: 10,
          width: "100%",
          marginBottom: "10px",
        }}
      >
        {availableFileTypes.map((fileType) => (
          <div
            key={fileType.ext}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <input
              type="checkbox"
              id={fileType.ext}
              name={fileType.ext}
              checked={allowedFileTypes.indexOf(fileType.ext) !== -1}
              value={fileType.ext}
              disabled={!fullFileUpload}
              onChange={handleAllowedFileTypesChange}
            />
            <label htmlFor={fileType.ext} style={{ marginLeft: 10, fontSize: "0.8125rem" }}>
              {fileType.name} ({fileType.extension})
            </label>
          </div>
        ))}
      </div>

      {fullFileUpload && (
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: "8px !important",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: customization.isDarkMode ? "rgba(255,255,255,0.02)" : "grey.50",
            "&:before": { display: "none" },
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
            sx={{ minHeight: 40, px: 2, "& .MuiAccordionSummary-content": { my: 0.75 } }}
          >
            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, color: "text.secondary" }}>
              Advanced Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ px: 2, pt: 0, pb: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* PDF Processing */}
            {allowedFileTypes.includes("application/pdf") && (
              <Box>
                <Typography
                  sx={{ fontSize: "0.8125rem", fontWeight: 500, color: "text.primary", mb: 0.75 }}
                >
                  PDF Processing
                </Typography>
                <FormControl disabled={!fullFileUpload}>
                  <RadioGroup name="pdf-usage" value={pdfUsage} onChange={handlePdfUsageChange}>
                    <FormControlLabel
                      value="perPage"
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: "0.8125rem" }}>
                          One document per page
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="perFile"
                      control={<Radio size="small" />}
                      label={
                        <Typography sx={{ fontSize: "0.8125rem" }}>
                          One document per file
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 2 }}>
        <StyledButton variant="contained" onClick={onSave} sx={{ minWidth: 100 }}>
          Save
        </StyledButton>
      </Box>
    </>
  );
};

FileUpload.propTypes = {
  dialogProps: PropTypes.object,
};

export default FileUpload;
