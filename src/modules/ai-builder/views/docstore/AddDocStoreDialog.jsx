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

// API
import documentStoreApi from "@/modules/ai-builder/api/documentstore";
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

const AddDocStoreDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
  const portalElement = typeof document !== "undefined" ? (document.getElementById("portal") || document.body) : null;

  const dispatch = useDispatch();

  // ==============================|| Snackbar ||============================== //

  useNotifier();

  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const [documentStoreName, setDocumentStoreName] = useState("");
  const [documentStoreDesc, setDocumentStoreDesc] = useState("");
  const [dialogType, setDialogType] = useState("ADD");
  const [docStoreId, setDocumentStoreId] = useState();

  useEffect(() => {
    setDialogType(dialogProps.type);
    if (dialogProps.type === "EDIT" && dialogProps.data) {
      setDocumentStoreName(dialogProps.data.name);
      setDocumentStoreDesc(dialogProps.data.description);
      setDocumentStoreId(dialogProps.data.id);
    } else if (dialogProps.type === "ADD") {
      setDocumentStoreName("");
      setDocumentStoreDesc("");
    }

    return () => {
      setDocumentStoreName("");
      setDocumentStoreDesc("");
    };
  }, [dialogProps]);

  useEffect(() => {
    if (show) dispatch({ type: SHOW_CANVAS_DIALOG });
    else dispatch({ type: HIDE_CANVAS_DIALOG });
    return () => dispatch({ type: HIDE_CANVAS_DIALOG });
  }, [show, dispatch]);

  const createDocumentStore = async () => {
    try {
      const obj = {
        name: documentStoreName,
        description: documentStoreDesc,
      };
      const createResp = await documentStoreApi.createDocumentStore(obj);
      if (createResp.data) {
        enqueueSnackbar({
          message: "New Document Store created.",
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
        onConfirm(createResp.data.id, {
          ...(createResp.data || {}),
          name: documentStoreName,
          description: documentStoreDesc,
        });
      }
    } catch (error) {
      enqueueSnackbar({
        message: `Failed to add new Document Store: ${
          typeof error.response?.data === "object"
            ? error.response.data.message
            : (error.response?.data || error.message)
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

  const updateDocumentStore = async () => {
    try {
      const saveObj = {
        name: documentStoreName,
        description: documentStoreDesc,
      };

      const saveResp = await documentStoreApi.updateDocumentStore(docStoreId, saveObj);
      if (saveResp.data) {
        enqueueSnackbar({
          message: "Document Store Updated!",
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
        onConfirm(saveResp.data.id, {
          ...(saveResp.data || {}),
          name: documentStoreName,
          description: documentStoreDesc,
        });
      }
    } catch (error) {
      enqueueSnackbar({
        message: `Failed to update Document Store: ${
          typeof error.response?.data === "object"
            ? error.response.data.message
            : (error.response?.data || error.message)
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
            key="documentStoreName"
            onChange={(e) => setDocumentStoreName(e.target.value)}
            value={documentStoreName ?? ""}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography>Description</Typography>

            <div style={{ flexGrow: 1 }} />
          </div>
          <OutlinedInput
            size="small"
            multiline
            rows={7}
            sx={{ mt: 1 }}
            type="string"
            fullWidth
            key="documentStoreDesc"
            onChange={(e) => setDocumentStoreDesc(e.target.value)}
            value={documentStoreDesc ?? ""}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <StyledButton
          disabled={!documentStoreName}
          variant="contained"
          onClick={() => (dialogType === "ADD" ? createDocumentStore() : updateDocumentStore())}
        >
          {dialogProps.confirmButtonName}
        </StyledButton>
      </DialogActions>
      <ConfirmDialog />
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : null;
};

AddDocStoreDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AddDocStoreDialog;
