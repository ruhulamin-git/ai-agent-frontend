import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";

import PortalWrapper from "./PortalWrapper";

const SaveChatflowDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
  const [chatflowName, setChatflowName] = useState("");
  const [isReadyToSave, setIsReadyToSave] = useState(false);

  useEffect(() => {
    if (chatflowName) setIsReadyToSave(true);
    else setIsReadyToSave(false);
  }, [chatflowName]);

  return (
    <PortalWrapper show={show}>
      <Dialog
        open={show}
        fullWidth
        maxWidth="xs"
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableRestoreFocus // needed due to StrictMode
      >
        <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
          {dialogProps.title}
        </DialogTitle>
        <DialogContent>
          <OutlinedInput
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            sx={{ mt: 1 }}
            id="chatflow-name"
            type="text"
            fullWidth
            placeholder="My New Chatflow"
            value={chatflowName}
            onChange={(e) => setChatflowName(e.target.value)}
            onKeyDown={(e) => {
              if (isReadyToSave && e.key === "Enter") onConfirm(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
          <StyledButton
            disabled={!isReadyToSave}
            variant="contained"
            onClick={() => onConfirm(chatflowName)}
          >
            {dialogProps.confirmButtonName}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </PortalWrapper>
  );
};

SaveChatflowDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default SaveChatflowDialog;
