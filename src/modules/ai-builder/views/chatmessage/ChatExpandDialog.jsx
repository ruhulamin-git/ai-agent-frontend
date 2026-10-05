import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconEraser } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";

import ChatMessage from "./ChatMessage";

const ChatExpandDialog = ({
  show,
  dialogProps,
  isAgentCanvas,
  onClear,
  onCancel,
  previews,
  setPreviews,
}) => {
  const [portalElement, setPortalElement] = useState(null);
  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);

  const component = show ? (
    <Dialog
      open={show}
      fullWidth
      maxWidth="md"
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ overflow: "visible" }}
    >
      <DialogTitle sx={{ fontSize: "1rem", p: 1.5 }} id="alert-dialog-title">
        <div style={{ display: "flex", flexDirection: "row" }}>
          {dialogProps.title}
          <div style={{ flex: 1 }} />
          {customization.isDarkMode && (
            <StyledButton
              variant="outlined"
              color="error"
              title="Clear Conversation"
              onClick={onClear}
              startIcon={<IconEraser />}
            >
              Clear Chat
            </StyledButton>
          )}
          {!customization.isDarkMode && (
            <Button
              variant="outlined"
              color="error"
              title="Clear Conversation"
              onClick={onClear}
              startIcon={<IconEraser />}
            >
              Clear Chat
            </Button>
          )}
        </div>
      </DialogTitle>
      <DialogContent
        className="cloud-dialog-wrapper"
        sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", p: 0 }}
      >
        <ChatMessage
          isDialog
          open={dialogProps.open}
          isAgentCanvas={isAgentCanvas}
          chatflowid={dialogProps.chatflowid}
          previews={previews}
          setPreviews={setPreviews}
        />
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

ChatExpandDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  isAgentCanvas: PropTypes.bool,
  onClear: PropTypes.func,
  onCancel: PropTypes.func,
  previews: PropTypes.array,
  setPreviews: PropTypes.func,
};

export default ChatExpandDialog;
