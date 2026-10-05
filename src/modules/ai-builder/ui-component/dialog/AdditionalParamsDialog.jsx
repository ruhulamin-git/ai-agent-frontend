import { Dialog, DialogContent } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";

import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";
import NodeInputHandler from "@/modules/ai-builder/views/canvas/NodeInputHandler";

const AdditionalParamsDialog = ({ show, dialogProps, onCancel }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);
  const dispatch = useDispatch();

  const [inputParams, setInputParams] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    if (dialogProps.inputParams) setInputParams(dialogProps.inputParams);
    if (dialogProps.data) setData(dialogProps.data);

    return () => {
      setInputParams([]);
      setData({});
    };
  }, [dialogProps]);

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
      <DialogContent>
        <PerfectScrollbar
          style={{
            height: "100%",
            maxHeight: "calc(100vh - 220px)",
            overflowX: "hidden",
          }}
        >
          {inputParams
            .filter((inputParam) => inputParam.display !== false)
            .map((inputParam, index) => (
              <NodeInputHandler
                disabled={dialogProps.disabled}
                key={index}
                inputParam={inputParam}
                data={data}
                isAdditionalParams
              />
            ))}
        </PerfectScrollbar>
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

AdditionalParamsDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
};

export default AdditionalParamsDialog;
