// material-ui
import { Box, IconButton, Typography } from "@mui/material";
import { IconAlertTriangle, IconArrowsMaximize } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

// project import
import { Dropdown } from "@/modules/ai-builder/ui-component/dropdown/Dropdown";
import { Input } from "@/modules/ai-builder/ui-component/input/Input";
import { SensitiveInput } from "@/modules/ai-builder/ui-component/input/SensitiveInput";
import { JsonEditorInput } from "@/modules/ai-builder/ui-component/json/JsonEditor";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import { TooltipWithParser } from "@/modules/ai-builder/ui-component/tooltip/TooltipWithParser";

// ===========================|| NodeInputHandler ||=========================== //

const CredentialInputHandler = ({ inputParam, data, disabled = false, onReveal }) => {
  const customization = useSelector((state) => state.customization);
  const ref = useRef(null);

  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});

  const onExpandDialogClicked = (value, inputParam) => {
    const dialogProp = {
      value,
      inputParam,
      disabled,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setExpandDialogProps(dialogProp);
    setShowExpandDialog(true);
  };

  const onExpandDialogSave = (newValue, inputParamName) => {
    setShowExpandDialog(false);
    data[inputParamName] = newValue;
  };

  return (
    <div ref={ref}>
      {inputParam && (
        <Box sx={{ p: 2 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography>
              {inputParam.label}
              {!inputParam.optional && <span style={{ color: "red" }}>&nbsp;*</span>}
              {inputParam.description && (
                <TooltipWithParser style={{ marginLeft: 10 }} title={inputParam.description} />
              )}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            {inputParam.type === "string" && inputParam.rows && (
              <IconButton
                size="small"
                sx={{
                  height: 25,
                  width: 25,
                }}
                title="Expand"
                color="primary"
                onClick={() =>
                  onExpandDialogClicked(
                    data[inputParam.name] ?? inputParam.default ?? "",
                    inputParam
                  )
                }
              >
                <IconArrowsMaximize />
              </IconButton>
            )}
          </div>
          {inputParam.warning && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                borderRadius: 10,
                background: "rgb(254,252,191)",
                padding: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <IconAlertTriangle size={36} color="orange" />
              <span style={{ color: "rgb(116,66,16)", marginLeft: 10 }}>{inputParam.warning}</span>
            </div>
          )}

          {inputParam.type === "boolean" && (
            <SwitchInput
              disabled={disabled}
              onChange={(newValue) => (data[inputParam.name] = newValue)}
              value={data[inputParam.name] ?? inputParam.default ?? false}
            />
          )}
          {(inputParam.type === "url" || inputParam.type === "password") && (
            <SensitiveInput
              key={inputParam.name}
              inputParam={inputParam}
              value={data[inputParam.name] ?? inputParam.default ?? ""}
              onChange={(newValue) => (data[inputParam.name] = newValue)}
              disabled={disabled}
              onReveal={onReveal ? () => onReveal(inputParam.name) : undefined}
            />
          )}
          {(inputParam.type === "string" || inputParam.type === "number") && (
            <Input
              key={data[inputParam.name]}
              disabled={disabled}
              inputParam={inputParam}
              onChange={(newValue) => (data[inputParam.name] = newValue)}
              value={data[inputParam.name] ?? inputParam.default ?? ""}
              showDialog={showExpandDialog}
              dialogProps={expandDialogProps}
              onDialogCancel={() => setShowExpandDialog(false)}
              onDialogConfirm={(newValue, inputParamName) =>
                onExpandDialogSave(newValue, inputParamName)
              }
            />
          )}
          {inputParam.type === "json" && (
            <JsonEditorInput
              disabled={disabled}
              onChange={(newValue) => (data[inputParam.name] = newValue)}
              value={data[inputParam.name] ?? inputParam.default ?? ""}
              isDarkMode={customization.isDarkMode}
            />
          )}
          {inputParam.type === "options" && (
            <Dropdown
              disabled={disabled}
              name={inputParam.name}
              options={inputParam.options}
              onSelect={(newValue) => (data[inputParam.name] = newValue)}
              value={data[inputParam.name] ?? inputParam.default ?? "choose an option"}
            />
          )}
        </Box>
      )}
    </div>
  );
};

CredentialInputHandler.propTypes = {
  inputAnchor: PropTypes.object,
  inputParam: PropTypes.object,
  data: PropTypes.object,
  disabled: PropTypes.bool,
  onReveal: PropTypes.func,
};

export default CredentialInputHandler;
