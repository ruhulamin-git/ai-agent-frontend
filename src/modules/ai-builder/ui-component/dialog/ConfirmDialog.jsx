"use client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import useConfirm from "@/modules/ai-builder/hooks/useConfirm";
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";

const ConfirmDialog = () => {
  const { onConfirm, onCancel, confirmState } = useConfirm();
  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Try to find the portal div, fallback to document.body
    const el = document.getElementById("portal") || document.body;
    setPortalElement(el);
  }, []);

  const component = confirmState.show ? (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={confirmState.show}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
        {confirmState.title}
      </DialogTitle>
      <DialogContent>
        <span>{confirmState.description}</span>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{confirmState.cancelButtonName}</Button>
        <StyledButton variant="contained" onClick={onConfirm}>
          {confirmState.confirmButtonName}
        </StyledButton>
      </DialogActions>
    </Dialog>
  ) : null;

  if (!mounted || !portalElement) return null;

  return createPortal(component, portalElement);
};

export default ConfirmDialog;
