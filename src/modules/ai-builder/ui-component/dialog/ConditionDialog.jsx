// MUI
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";

// Store
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from "@/modules/ai-builder/store/actions";
// Project Import
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import { Tab } from "@/modules/ai-builder/ui-component/tabs/Tab";
import { TabPanel } from "@/modules/ai-builder/ui-component/tabs/TabPanel";
import { TabsList } from "@/modules/ai-builder/ui-component/tabs/TabsList";
import NodeInputHandler from "@/modules/ai-builder/views/canvas/NodeInputHandler";

const ConditionDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);

  const dispatch = useDispatch();

  const [inputParam, setInputParam] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    if (dialogProps.inputParam) {
      setInputParam(dialogProps.inputParam);
    }

    if (dialogProps.data) setData(dialogProps.data);

    return () => {
      setInputParam(null);
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
      open={show}
      fullWidth
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <>
          {inputParam?.type.includes("conditionFunction") && (
            <>
              <TabsList
                value={tabValue}
                onChange={(event, val) => setTabValue(val)}
                aria-label="tabs"
                variant="fullWidth"
              >
                {inputParam.tabs.map((inputChildParam, index) => (
                  <Tab key={index} value={index}>
                    {inputChildParam.label}
                  </Tab>
                ))}
              </TabsList>
              {inputParam.tabs
                .filter((inputParam) => inputParam.display !== false)
                .map((inputChildParam, index) => (
                  <TabPanel key={index} value={tabValue} index={index}>
                    <NodeInputHandler
                      disabled={inputChildParam.disabled}
                      inputParam={inputChildParam}
                      data={data}
                      isAdditionalParams
                      disablePadding
                    />
                  </TabPanel>
                ))}
            </>
          )}
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
        <StyledButton
          disabled={dialogProps.disabled}
          variant="contained"
          onClick={() => onConfirm(data, inputParam, tabValue)}
        >
          {dialogProps.confirmButtonName}
        </StyledButton>
      </DialogActions>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

ConditionDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ConditionDialog;
