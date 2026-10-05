// material-ui
import { IconButton } from "@mui/material";
import { IconEdit } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

// API
import credentialsApi from "@/modules/ai-builder/api/credentials";
import { useAuth } from "@/modules/ai-builder/hooks/useAuth";
import { FLOWISE_CREDENTIAL_ID } from "@/modules/ai-builder/store/constant";
// project import
import { AsyncDropdown } from "@/modules/ai-builder/ui-component/dropdown/AsyncDropdown";
import AddEditCredentialDialog from "@/modules/ai-builder/views/credentials/AddEditCredentialDialog";
import CredentialListDialog from "@/modules/ai-builder/views/credentials/CredentialListDialog";

// ===========================|| CredentialInputHandler ||=========================== //

const CredentialInputHandler = ({ inputParam, data, onSelect, disabled = false }) => {
  const ref = useRef(null);
  const [credentialId, setCredentialId] = useState(
    data?.credential || data?.inputs?.[FLOWISE_CREDENTIAL_ID] || ""
  );
  const [showCredentialListDialog, setShowCredentialListDialog] = useState(false);
  const [credentialListDialogProps, setCredentialListDialogProps] = useState({});
  const [showSpecificCredentialDialog, setShowSpecificCredentialDialog] = useState(false);
  const [specificCredentialDialogProps, setSpecificCredentialDialogProps] = useState({});
  const [reloadTimestamp, setReloadTimestamp] = useState(Date.now().toString());
  const { hasPermission } = useAuth();

  const editCredential = (credentialId) => {
    const dialogProp = {
      type: "EDIT",
      cancelButtonName: "Cancel",
      confirmButtonName: "Save",
      credentialId,
    };
    setSpecificCredentialDialogProps(dialogProp);
    setShowSpecificCredentialDialog(true);
  };

  const addAsyncOption = async () => {
    try {
      let names = "";
      if (inputParam.credentialNames.length > 1) {
        names = inputParam.credentialNames.join("&");
      } else {
        names = inputParam.credentialNames[0];
      }
      const componentCredentialsResp = await credentialsApi.getSpecificComponentCredential(names);
      if (componentCredentialsResp.data) {
        if (Array.isArray(componentCredentialsResp.data)) {
          const dialogProp = {
            title: "Add New Credential",
            componentsCredentials: componentCredentialsResp.data,
          };
          setCredentialListDialogProps(dialogProp);
          setShowCredentialListDialog(true);
        } else {
          const dialogProp = {
            type: "ADD",
            cancelButtonName: "Cancel",
            confirmButtonName: "Add",
            credentialComponent: componentCredentialsResp.data,
          };
          setSpecificCredentialDialogProps(dialogProp);
          setShowSpecificCredentialDialog(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onConfirmAsyncOption = (selectedCredentialId = "") => {
    setCredentialId(selectedCredentialId);
    setReloadTimestamp(Date.now().toString());
    setSpecificCredentialDialogProps({});
    setShowSpecificCredentialDialog(false);
    onSelect(selectedCredentialId);
  };

  const onCredentialSelected = (credentialComponent) => {
    setShowCredentialListDialog(false);
    const dialogProp = {
      type: "ADD",
      cancelButtonName: "Cancel",
      confirmButtonName: "Add",
      credentialComponent,
    };
    setSpecificCredentialDialogProps(dialogProp);
    setShowSpecificCredentialDialog(true);
  };

  useEffect(() => {
    setCredentialId(data?.credential || data?.inputs?.[FLOWISE_CREDENTIAL_ID] || "");
  }, [data]);

  return (
    <div ref={ref}>
      {inputParam && (
        <>
          {inputParam.type === "credential" && (
            <div key={reloadTimestamp} style={{ display: "flex", flexDirection: "row" }}>
              <AsyncDropdown
                disabled={disabled}
                name={inputParam.name}
                nodeData={data}
                value={credentialId ?? "choose an option"}
                isCreateNewOption={hasPermission("credentials:create")}
                credentialNames={inputParam.credentialNames}
                onSelect={(newValue) => {
                  setCredentialId(newValue);
                  onSelect(newValue);
                }}
                onCreateNew={() => addAsyncOption(inputParam.name)}
              />
              {credentialId && hasPermission("credentials:update") && (
                <IconButton
                  title="Edit"
                  color="primary"
                  size="small"
                  onClick={() => editCredential(credentialId)}
                >
                  <IconEdit />
                </IconButton>
              )}
            </div>
          )}
        </>
      )}
      {showSpecificCredentialDialog && (
        <AddEditCredentialDialog
          show={showSpecificCredentialDialog}
          dialogProps={specificCredentialDialogProps}
          onCancel={() => setShowSpecificCredentialDialog(false)}
          onConfirm={onConfirmAsyncOption}
        />
      )}
      {showCredentialListDialog && (
        <CredentialListDialog
          show={showCredentialListDialog}
          dialogProps={credentialListDialogProps}
          onCancel={() => setShowCredentialListDialog(false)}
          onCredentialSelected={onCredentialSelected}
        />
      )}
    </div>
  );
};

CredentialInputHandler.propTypes = {
  inputParam: PropTypes.object,
  data: PropTypes.object,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CredentialInputHandler;
