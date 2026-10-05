"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const DEFAULT_CUSTOM_STYLE = {};

/**
 * Replacement for react-code-blocks `CopyBlock` — that package forwards `copied` onto a native
 * `button`, which triggers React's non-boolean attribute warning. Supports the props we use in ai-builder.
 */
export const SafeCopyBlock = ({
  text = "",
  language = "javascript",
  showLineNumbers = false,
  wrapLines = false,
  customStyle = DEFAULT_CUSTOM_STYLE,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text ?? "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  }, [text]);

  const lang = typeof language === "string" ? language.toLowerCase() : "javascript";

  return (
    <Box sx={{ position: "relative", borderRadius: 1, overflow: "auto", "& pre": { margin: 0 } }}>
      <Tooltip title={copied ? "Copied" : "Copy"}>
        <IconButton
          type="button"
          aria-label="Copy code"
          onClick={handleCopy}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: "rgba(40, 44, 52, 0.92)",
            color: "#abb2bf",
            "&:hover": { bgcolor: "rgba(40, 44, 52, 1)" },
          }}
        >
          {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        wrapLongLines={Boolean(wrapLines)}
        customStyle={{
          borderRadius: 4,
          padding: "1rem",
          paddingTop: "2.5rem",
          ...customStyle,
        }}
      >
        {text ?? ""}
      </SyntaxHighlighter>
    </Box>
  );
};

SafeCopyBlock.propTypes = {
  text: PropTypes.string,
  language: PropTypes.string,
  showLineNumbers: PropTypes.bool,
  wrapLines: PropTypes.bool,
  customStyle: PropTypes.object,
};
