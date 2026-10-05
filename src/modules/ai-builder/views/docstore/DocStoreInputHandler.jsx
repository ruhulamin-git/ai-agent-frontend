// material-ui
import { Box, Button, IconButton, Typography } from "@mui/material";
import { IconAlertTriangle, IconArrowsMaximize, IconRefresh } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";

// const
import { FLOWISE_CREDENTIAL_ID } from "@/modules/ai-builder/store/constant";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import { ArrayRenderer } from "@/modules/ai-builder/ui-component/array/ArrayRenderer";
import ExpandTextDialog from "@/modules/ai-builder/ui-component/dialog/ExpandTextDialog";
import ManageScrapedLinksDialog from "@/modules/ai-builder/ui-component/dialog/ManageScrapedLinksDialog";
import { AsyncDropdown } from "@/modules/ai-builder/ui-component/dropdown/AsyncDropdown";
// project import
import { Dropdown } from "@/modules/ai-builder/ui-component/dropdown/Dropdown";
import { MultiDropdown } from "@/modules/ai-builder/ui-component/dropdown/MultiDropdown";
import { CodeEditor } from "@/modules/ai-builder/ui-component/editor/CodeEditor";
import { File } from "@/modules/ai-builder/ui-component/file/File";
import { DataGrid } from "@/modules/ai-builder/ui-component/grid/DataGrid";
import { Input } from "@/modules/ai-builder/ui-component/input/Input";
import { JsonEditorInput } from "@/modules/ai-builder/ui-component/json/JsonEditor";
import { SwitchInput } from "@/modules/ai-builder/ui-component/switch/Switch";
import { TooltipWithParser } from "@/modules/ai-builder/ui-component/tooltip/TooltipWithParser";
import CredentialInputHandler from "@/modules/ai-builder/views/canvas/CredentialInputHandler";

// ===========================|| DocStoreInputHandler ||=========================== //

const DocStoreInputHandler = ({ inputParam, data, disabled = false, onNodeDataChange }) => {
  const customization = useSelector((state) => state.customization);
  const flowContextValue = useContext(flowContext);
  const nodeDataChangeHandler = onNodeDataChange || flowContextValue?.onNodeDataChange;

  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});
  const [showManageScrapedLinksDialog, setShowManageScrapedLinksDialog] = useState(false);
  const [manageScrapedLinksDialogProps, setManageScrapedLinksDialogProps] = useState({});
  const [reloadTimestamp, setReloadTimestamp] = useState(Date.now().toString());

  const handleDataChange = ({ inputParam, newValue }) => {
    data.inputs[inputParam.name] = newValue;
    if (nodeDataChangeHandler) {
      nodeDataChangeHandler({ nodeId: data.id, inputParam, newValue });
    }
  };

  const onExpandDialogClicked = (value, inputParam) => {
    const dialogProps = {
      value,
      inputParam,
      disabled,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setExpandDialogProps(dialogProps);
    setShowExpandDialog(true);
  };

  const onManageLinksDialogClicked = (url, selectedLinks, relativeLinksMethod, limit) => {
    const dialogProps = {
      url,
      relativeLinksMethod,
      limit,
      selectedLinks,
      confirmButtonName: "Save",
      cancelButtonName: "Cancel",
    };
    setManageScrapedLinksDialogProps(dialogProps);
    setShowManageScrapedLinksDialog(true);
  };

  const onManageLinksDialogSave = (url, links) => {
    setShowManageScrapedLinksDialog(false);
    data.inputs.url = url;
    data.inputs.selectedLinks = links;
  };

  const onExpandDialogSave = (newValue, inputParamName) => {
    setShowExpandDialog(false);
    data.inputs[inputParamName] = newValue;
  };

  const getCredential = () => {
    const credential = data.inputs.credential || data.inputs[FLOWISE_CREDENTIAL_ID];
    if (credential) {
      return { credential };
    }
    return {};
  };

  return (
    <div>
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
            {((inputParam.type === "string" && inputParam.rows) || inputParam.type === "code") && (
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
                    data.inputs[inputParam.name] ?? inputParam.default ?? "",
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
                alignItems: "center",
                borderRadius: 10,
                background: "rgb(254,252,191)",
                padding: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <IconAlertTriangle size={30} color="orange" />
              <span style={{ color: "rgb(116,66,16)", marginLeft: 10 }}>{inputParam.warning}</span>
            </div>
          )}
          {inputParam.type === "credential" && (
            <CredentialInputHandler
              key={JSON.stringify(inputParam)}
              disabled={disabled}
              data={getCredential()}
              inputParam={inputParam}
              onSelect={(newValue) => {
                data.credential = newValue;
                data.inputs[FLOWISE_CREDENTIAL_ID] = newValue; // in case data.credential is not updated
                if (nodeDataChangeHandler) {
                  nodeDataChangeHandler({ nodeId: data.id, inputParam, newValue });
                }
              }}
            />
          )}

          {inputParam.type === "file" && (
            <File
              disabled={disabled}
              fileType={inputParam.fileType || "*"}
              onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              value={
                data.inputs[inputParam.name] ?? inputParam.default ?? "Choose a file to upload"
              }
            />
          )}
          {inputParam.type === "boolean" && (
            <SwitchInput
              disabled={disabled}
              onChange={(newValue) => handleDataChange({ inputParam, newValue })}
              value={data.inputs[inputParam.name] ?? inputParam.default ?? false}
            />
          )}
          {inputParam.type === "datagrid" && (
            <DataGrid
              disabled={disabled}
              columns={inputParam.datagrid}
              hideFooter
              rows={data.inputs[inputParam.name] ?? JSON.stringify(inputParam.default) ?? []}
              onChange={(newValue) => handleDataChange({ inputParam, newValue })}
            />
          )}
          {inputParam.type === "code" && (
            <>
              <div style={{ height: "5px" }} />
              <div style={{ height: inputParam.rows ? "100px" : "200px" }}>
                <CodeEditor
                  disabled={disabled}
                  value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
                  height={inputParam.rows ? "100px" : "200px"}
                  theme={customization.isDarkMode ? "dark" : "light"}
                  lang={"js"}
                  placeholder={inputParam.placeholder}
                  onValueChange={(code) => (data.inputs[inputParam.name] = code)}
                  basicSetup={{ highlightActiveLine: false, highlightActiveLineGutter: false }}
                />
              </div>
            </>
          )}
          {(inputParam.type === "string" ||
            inputParam.type === "password" ||
            inputParam.type === "number") && (
            <Input
              key={data.inputs[inputParam.name]}
              disabled={disabled}
              inputParam={inputParam}
              onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
              onBlur={(newValue) => handleDataChange({ inputParam, newValue })}
              value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
              nodeId={data.id}
            />
          )}
          {inputParam.type === "json" && (
            <JsonEditorInput
              disabled={disabled}
              onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
              value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
              isDarkMode={customization.isDarkMode}
            />
          )}
          {inputParam.type === "options" && (
            <Dropdown
              key={JSON.stringify(inputParam)}
              disabled={disabled}
              name={inputParam.name}
              options={inputParam.options}
              onSelect={(newValue) => handleDataChange({ inputParam, newValue })}
              value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
            />
          )}
          {inputParam.type === "multiOptions" && (
            <MultiDropdown
              key={JSON.stringify(inputParam)}
              disabled={disabled}
              name={inputParam.name}
              options={inputParam.options}
              onSelect={(newValue) => handleDataChange({ inputParam, newValue })}
              value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
            />
          )}
          {(inputParam.type === "asyncOptions" || inputParam.type === "asyncMultiOptions") && (
            <>
              {data.inputParams?.length === 1 && <div style={{ marginTop: 10 }} />}
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div key={reloadTimestamp} style={{ flex: 1 }}>
                  <AsyncDropdown
                    key={JSON.stringify(inputParam)}
                    disabled={disabled}
                    name={inputParam.name}
                    nodeData={data}
                    freeSolo={inputParam.freeSolo}
                    multiple={inputParam.type === "asyncMultiOptions"}
                    value={data.inputs[inputParam.name] ?? inputParam.default ?? "choose an option"}
                    onSelect={(newValue) => handleDataChange({ inputParam, newValue })}
                    onCreateNew={() => addAsyncOption(inputParam.name)}
                    fullWidth
                  />
                </div>
                {inputParam.refresh && (
                  <IconButton
                    title="Refresh"
                    color="primary"
                    size="small"
                    onClick={() => setReloadTimestamp(Date.now().toString())}
                  >
                    <IconRefresh />
                  </IconButton>
                )}
              </div>
            </>
          )}
          {inputParam.type === "array" && (
            <ArrayRenderer inputParam={inputParam} data={data} disabled={disabled} isDocStore />
          )}
          {(data.name === "cheerioWebScraper" ||
            data.name === "puppeteerWebScraper" ||
            data.name === "playwrightWebScraper") &&
            inputParam.name === "url" && (
              <>
                <Button
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                  disabled={disabled}
                  sx={{ borderRadius: "12px", width: "100%", mt: 1 }}
                  variant="outlined"
                  onClick={() =>
                    onManageLinksDialogClicked(
                      data.inputs[inputParam.name] ?? inputParam.default ?? "",
                      data.inputs.selectedLinks,
                      data.inputs["relativeLinksMethod"] ?? "webCrawl",
                      parseInt(data.inputs["limit"]) ?? 0
                    )
                  }
                >
                  Manage Links
                </Button>
                <ManageScrapedLinksDialog
                  show={showManageScrapedLinksDialog}
                  dialogProps={manageScrapedLinksDialogProps}
                  onCancel={() => setShowManageScrapedLinksDialog(false)}
                  onSave={onManageLinksDialogSave}
                />
              </>
            )}
        </Box>
      )}
      <ExpandTextDialog
        show={showExpandDialog}
        dialogProps={expandDialogProps}
        onCancel={() => setShowExpandDialog(false)}
        onConfirm={(newValue, inputParamName) => onExpandDialogSave(newValue, inputParamName)}
      />
    </div>
  );
};

DocStoreInputHandler.propTypes = {
  inputParam: PropTypes.object,
  data: PropTypes.object,
  disabled: PropTypes.bool,
  onNodeDataChange: PropTypes.func,
};

export default DocStoreInputHandler;
