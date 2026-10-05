// material-ui
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";

// store
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";
// Project imports
import AllowedDomains from "@/modules/ai-builder/ui-component/extended/AllowedDomains";
import useNotifier from "@/modules/ai-builder/utils/useNotifier";

const AllowedDomainsDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);
  const dispatch = useDispatch();

  useNotifier();

  useEffect(() => {
    if (show) dispatch({ type: SHOW_CANVAS_DIALOG });
    else dispatch({ type: HIDE_CANVAS_DIALOG });
    return () => dispatch({ type: HIDE_CANVAS_DIALOG });
  }, [show, dispatch]);

  const component = show ? (
    <Dialog
      onClose={onCancel}
      open={show}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
        {dialogProps.title || "Allowed Domains"}
      </DialogTitle>
      <DialogContent>
        <AllowedDomains dialogProps={dialogProps} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

AllowedDomainsDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AllowedDomainsDialog;
