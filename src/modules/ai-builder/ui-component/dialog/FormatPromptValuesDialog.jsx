import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";

import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";
import { JsonEditorInput } from "@/modules/ai-builder/ui-component/json/JsonEditor";

const FormatPromptValuesDialog = ({ show, dialogProps, onChange, onCancel }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();

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
        {dialogProps.inputParam.label ?? "Format Prompt Values"}
      </DialogTitle>
      <DialogContent>
        <PerfectScrollbar
          style={{
            height: "100%",
            maxHeight: "calc(100vh - 220px)",
            overflowX: "hidden",
          }}
        >
          <JsonEditorInput
            onChange={(newValue) => onChange(newValue)}
            value={dialogProps.value}
            isDarkMode={customization.isDarkMode}
            inputParam={dialogProps.inputParam}
            nodes={dialogProps.nodes}
            edges={dialogProps.edges}
            nodeId={dialogProps.nodeId}
            isSequentialAgent={dialogProps.data.category === "Sequential Agents"}
          />
        </PerfectScrollbar>
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

FormatPromptValuesDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FormatPromptValuesDialog;
