// MUI
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconCode, IconPencil } from "@tabler/icons-react";
import { mergeAttributes } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
// TipTap
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";

// Project Import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import { suggestionOptions } from "@/modules/ai-builder/ui-component/input/suggestionOption";
import { CustomMention } from "@/modules/ai-builder/utils/customMention";
import { getAvailableNodesForVariable } from "@/modules/ai-builder/utils/genericHelper";
import {
  escapeXmlTags,
  isHtmlContent,
  unescapeXmlEntities,
  unescapeXmlTags,
} from "@/modules/ai-builder/utils/xmlTagUtils";

const lowlight = createLowlight(common);

// Store
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";

const StyledEditorContent = styled(EditorContent, {
  shouldForwardProp: (prop) => prop !== "isDarkMode" && prop !== "rows" && prop !== "disabled",
})(({ theme, rows, disabled, isDarkMode }) => ({
  "& .ProseMirror": {
    padding: "0px 14px",
    height: rows ? `${rows * 1.4375}rem` : "2.4rem",
    overflowY: rows ? "auto" : "hidden",
    overflowX: rows ? "auto" : "hidden",
    lineHeight: rows ? "1.4375em" : "0.875em",
    fontWeight: 500,
    color: theme.palette.grey[900],
    opacity: disabled ? 0.7 : 1,
    border: `1px solid ${theme.palette.grey[900] + 25}`,
    borderRadius: "10px",
    backgroundColor: theme.palette.textBackground.main,
    boxSizing: "border-box",
    whiteSpace: rows ? "pre-wrap" : "nowrap",
    "&:hover": {
      borderColor: disabled ? `${theme.palette.grey[900] + 25}` : theme.palette.text.primary,
      cursor: disabled ? "default" : "text",
    },
    "&:focus": {
      borderColor: disabled ? `${theme.palette.grey[900] + 25}` : theme.palette.primary.main,
      outline: "none",
    },
    // Placeholder for first paragraph when editor is empty
    "& p.is-editor-empty:first-of-type::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: theme.palette.text.primary,
      opacity: disabled ? 0.6 : 0.4,
      pointerEvents: "none",
      height: 0,
    },
    // Set CSS custom properties for theme-aware styling based on the screenshot
    "--code-bg": isDarkMode ? "#2d2d2d" : "#f5f5f5",
    "--code-color": isDarkMode ? "#d4d4d4" : "#333333",
    "--hljs-comment": isDarkMode ? "#6a9955" : "#6a9955",
    "--hljs-variable": isDarkMode ? "#9cdcfe" : "#d73a49", // Light blue for variables (var, i)
    "--hljs-number": isDarkMode ? "#b5cea8" : "#e36209", // Light green for numbers (1, 20, 15, etc.)
    "--hljs-string": isDarkMode ? "#ce9178" : "#22863a", // Orange/peach for strings ("FizzBuzz", "Fizz", "Buzz")
    "--hljs-title": isDarkMode ? "#dcdcaa" : "#6f42c1", // Yellow for function names (log)
    "--hljs-keyword": isDarkMode ? "#569cd6" : "#005cc5", // Blue for keywords (for, if, else)
    "--hljs-operator": isDarkMode ? "#d4d4d4" : "#333333", // White/gray for operators (=, %, ==, etc.)
    "--hljs-punctuation": isDarkMode ? "#d4d4d4" : "#333333", // White/gray for punctuation ({, }, ;, etc.)
  },
}));

// Styled textarea for raw mode
const StyledTextarea = styled("textarea")(({ theme, disabled }) => ({
  width: "100%",
  padding: "8px 14px",
  height: `${15 * 1.4375}rem`,
  overflowY: "auto",
  overflowX: "auto",
  lineHeight: "1.4375em",
  fontWeight: 500,
  fontFamily: "inherit",
  fontSize: "inherit",
  color: theme.palette.grey[900],
  opacity: disabled ? 0.7 : 1,
  border: `1px solid ${theme.palette.grey[900] + 25}`,
  borderRadius: "10px",
  backgroundColor: theme.palette.textBackground.main,
  boxSizing: "border-box",
  resize: "none",
  outline: "none",
  whiteSpace: "pre-wrap",
  "&:hover": {
    borderColor: disabled ? `${theme.palette.grey[900] + 25}` : theme.palette.text.primary,
    cursor: disabled ? "default" : "text",
  },
  "&:focus": {
    borderColor: disabled ? `${theme.palette.grey[900] + 25}` : theme.palette.primary.main,
  },
  "&::placeholder": {
    color: theme.palette.text.primary,
    opacity: disabled ? 0.6 : 0.4,
  },
}));

// define your extension array
const extensions = (
  availableNodesForVariable,
  availableState,
  acceptNodeOutputAsVariable,
  nodes,
  nodeData,
  isNodeInsideInteration
) => [
    StarterKit.configure({
      codeBlock: false,
    }),
    Markdown,
    CustomMention.configure({
      HTMLAttributes: {
        class: "variable",
      },
      renderHTML({ options, node }) {
        return [
          "span",
          mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
          `${options.suggestion.char} ${node.attrs.label ?? node.attrs.id} }}`,
        ];
      },
      suggestion: suggestionOptions(
        availableNodesForVariable,
        availableState,
        acceptNodeOutputAsVariable,
        nodes,
        nodeData,
        isNodeInsideInteration
      ),
      deleteTriggerWithBackspace: true,
    }),
    CodeBlockLowlight.configure({
      lowlight,
      enableTabIndentation: true,
      tabSize: 2,
    }),
  ];

const ExpandRichInputDialog = ({
  show,
  dialogProps,
  onCancel,
  onInputHintDialogClicked,
  onConfirm,
}) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);

  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const isDarkMode = customization.isDarkMode;

  const [viewMode, setViewMode] = useState("preview");
  const [inputValue, setInputValue] = useState("");
  const [inputParam, setInputParam] = useState(null);
  const [availableNodesForVariable, setAvailableNodesForVariable] = useState([]);
  const [availableState, setAvailableState] = useState([]);
  const [nodeData, setNodeData] = useState({});
  const [isNodeInsideInteration, setIsNodeInsideInteration] = useState(false);
  const isSwitchingRef = useRef(false);

  useEffect(() => {
    if (dialogProps.value) {
      setInputValue(dialogProps.value);
    }
    if (dialogProps.inputParam) {
      setInputParam(dialogProps.inputParam);
    }

    return () => {
      setInputValue("");
      setInputParam(null);
      setViewMode("preview");
    };
  }, [dialogProps]);

  useEffect(() => {
    if (show) dispatch({ type: SHOW_CANVAS_DIALOG });
    else dispatch({ type: HIDE_CANVAS_DIALOG });
    return () => dispatch({ type: HIDE_CANVAS_DIALOG });
  }, [show, dispatch]);

  useEffect(() => {
    if (
      !dialogProps.disabled &&
      dialogProps.nodes &&
      dialogProps.edges &&
      dialogProps.nodeId &&
      inputParam
    ) {
      const nodesForVariable = inputParam?.acceptVariable
        ? getAvailableNodesForVariable(
          dialogProps.nodes,
          dialogProps.edges,
          dialogProps.nodeId,
          inputParam.id
        )
        : [];
      setAvailableNodesForVariable(nodesForVariable);

      const startAgentflowNode = dialogProps.nodes.find(
        (node) => node.data.name === "startAgentflow"
      );
      const state = startAgentflowNode?.data?.inputs?.startState;
      setAvailableState(state);

      const agentflowNode = dialogProps.nodes.find((node) => node.data.id === dialogProps.nodeId);
      setNodeData(agentflowNode?.data);

      setIsNodeInsideInteration(
        dialogProps.nodes.find((node) => node.data.id === dialogProps.nodeId)?.extent === "parent"
      );
    }
  }, [dialogProps.disabled, inputParam, dialogProps.nodes, dialogProps.edges, dialogProps.nodeId]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        ...extensions(
          availableNodesForVariable,
          availableState,
          inputParam?.acceptNodeOutputAsVariable,
          dialogProps.nodes,
          nodeData,
          isNodeInsideInteration
        ),
        Placeholder.configure({ placeholder: inputParam?.placeholder }),
      ],
      content: "",
      onUpdate: ({ editor }) => {
        if (!isSwitchingRef.current) {
          try {
            setInputValue(unescapeXmlTags(editor.getMarkdown()));
          } catch {
            setInputValue(editor.getHTML());
          }
        }
      },
      editable: !dialogProps.disabled,
    },
    [availableNodesForVariable]
  );

  // Load content into the editor once it's ready
  useEffect(() => {
    if (editor && !editor.isDestroyed && inputValue) {
      isSwitchingRef.current = true;
      if (isHtmlContent(inputValue)) {
        editor.commands.setContent(inputValue);
        try {
          setInputValue(unescapeXmlTags(editor.getMarkdown()));
        } catch {
          // keep original value if conversion fails
        }
      } else {
        editor.commands.setContent(escapeXmlTags(inputValue), { contentType: "markdown" });
        editor.commands.setContent(unescapeXmlEntities(editor.getJSON()));
      }
      isSwitchingRef.current = false;
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the editor when dialog opens in preview mode
  useEffect(() => {
    if (show && editor && viewMode === "preview") {
      setTimeout(() => {
        if (!editor.isDestroyed) {
          editor.commands.focus();
        }
      }, 100);
    }
  }, [show, editor, viewMode]);

  const handleViewModeChange = useCallback(
    (event, newMode) => {
      if (!newMode || newMode === viewMode) return;

      if (newMode === "preview" && editor && !editor.isDestroyed) {
        isSwitchingRef.current = true;
        if (isHtmlContent(inputValue)) {
          editor.commands.setContent(inputValue, { contentType: "html" });
        } else {
          editor.commands.setContent(escapeXmlTags(inputValue), { contentType: "markdown" });
          editor.commands.setContent(unescapeXmlEntities(editor.getJSON()));
        }
        isSwitchingRef.current = false;
        setTimeout(() => {
          if (!editor.isDestroyed) {
            editor.commands.focus();
          }
        }, 50);
      } else if (newMode === "raw" && editor && !editor.isDestroyed) {
        try {
          setInputValue(unescapeXmlTags(editor.getMarkdown()));
        } catch {
          setInputValue(editor.getHTML());
        }
      }

      setViewMode(newMode);
    },
    [viewMode, editor, inputValue]
  );

  const component = show ? (
    <Dialog
      open={show}
      fullWidth
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {inputParam && (
            <div style={{ flex: 70, width: "100%" }}>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">{inputParam.label}</Typography>
                <div style={{ flex: 1 }} />
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    mr: inputParam.hint ? 1 : 0,
                    "& .MuiToggleButton-root": {
                      color: isDarkMode ? "rgba(255,255,255,0.5)" : undefined,
                      "&.Mui-selected": {
                        color: isDarkMode ? "#fff" : undefined,
                      },
                    },
                  }}
                >
                  <ToggleButton value="preview" sx={{ px: 1.5, py: 0.5, textTransform: "none" }}>
                    <IconPencil size={16} style={{ marginRight: 4 }} />
                    Edit
                  </ToggleButton>
                  <ToggleButton value="raw" sx={{ px: 1.5, py: 0.5, textTransform: "none" }}>
                    <IconCode size={16} style={{ marginRight: 4 }} />
                    Source
                  </ToggleButton>
                </ToggleButtonGroup>
                {inputParam.hint && (
                  <Button
                    sx={{ p: 0, px: 2 }}
                    color="secondary"
                    variant="text"
                    onClick={() => {
                      onInputHintDialogClicked(inputParam.hint);
                    }}
                  >
                    {inputParam.hint.label}
                  </Button>
                )}
              </div>
              <PerfectScrollbar
                style={{
                  borderRadius: "12px",
                  height: "100%",
                  maxHeight: "calc(100vh - 220px)",
                  overflowX: "hidden",
                }}
              >
                {viewMode === "raw" ? (
                  <Box sx={{ mt: 1 }}>
                    <StyledTextarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={inputParam?.placeholder}
                      disabled={dialogProps.disabled}
                    />
                  </Box>
                ) : (
                  <Box sx={{ mt: 1 }}>
                    <StyledEditorContent
                      editor={editor}
                      rows={15}
                      disabled={dialogProps.disabled}
                      isDarkMode={isDarkMode}
                    />
                  </Box>
                )}
              </PerfectScrollbar>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
        <StyledButton
          disabled={dialogProps.disabled}
          variant="contained"
          onClick={() => onConfirm(inputValue, inputParam.name)}
        >
          {dialogProps.confirmButtonName}
        </StyledButton>
      </DialogActions>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

ExpandRichInputDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onInputHintDialogClicked: PropTypes.func,
};

export default ExpandRichInputDialog;
