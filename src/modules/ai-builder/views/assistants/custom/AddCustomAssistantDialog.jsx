// Material
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  Typography,
} from "@mui/material";
// Icons
import { IconFiles, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// API
import assistantsApi from "@/modules/ai-builder/api/assistants";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  HIDE_CANVAS_DIALOG,
  SHOW_CANVAS_DIALOG,
} from "@/modules/ai-builder/store/actions";
// Project imports
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
// utils
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const AddCustomAssistantDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
  const portalElement = document.getElementById("portal");

  const dispatch = useDispatch();

  // ==============================|| Snackbar ||============================== //

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [customAssistantName, setCustomAssistantName] = useState("");

  useEffect(() => {
    if (show) dispatch({ type: SHOW_CANVAS_DIALOG });
    else dispatch({ type: HIDE_CANVAS_DIALOG });
    return () => dispatch({ type: HIDE_CANVAS_DIALOG });
  }, [show, dispatch]);

  const createCustomAssistant = async () => {
    try {
      const obj = {
        details: JSON.stringify({
          name: customAssistantName,
        }),
        credential: uuidv4(),
        type: "CUSTOM",
      };
      const createResp = await assistantsApi.createNewAssistant(obj);
      if (createResp.data) {
        enqueueSnackbar({
          message: "New Custom Assistant created.",
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
        onConfirm(createResp.data.id);
      }
    } catch (err) {
      enqueueSnackbar({
        message: `Failed to add new Custom Assistant: ${
          typeof err.response.data === "object" ? err.response.data.message : err.response.data
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
      onCancel();
    }
  };

  const component = show ? (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={show}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle style={{ fontSize: "1rem" }} id="alert-dialog-title">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <IconFiles style={{ marginRight: "10px" }} />
          {dialogProps.title}
        </div>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography>
              Name<span style={{ color: "red" }}>&nbsp;*</span>
            </Typography>

            <div style={{ flexGrow: 1 }} />
          </div>
          <OutlinedInput
            size="small"
            sx={{ mt: 1 }}
            type="string"
            fullWidth
            key="customAssistantName"
            onChange={(e) => setCustomAssistantName(e.target.value)}
            value={customAssistantName ?? ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <StyledButton
          disabled={!customAssistantName}
          variant="contained"
          onClick={() => createCustomAssistant()}
        >
          {dialogProps.confirmButtonName}
        </StyledButton>
      </DialogActions>
      <ConfirmDialog />
    </Dialog>
  ) : null;

  return createPortal(component, portalElement);
};

AddCustomAssistantDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AddCustomAssistantDialog;
