// material-ui
import { Box, Skeleton, Stack } from "@mui/material";
// icons
import { IconFileUpload, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// API
import assistantsApi from "@/modules/ai-builder/api/assistants";
import AssistantEmptySVG from "@/modules/ai-builder/assets/images/assistant_empty.svg";
import ErrorBoundary from "@/modules/ai-builder/ErrorBoundary";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
import ViewHeader from "@/modules/ai-builder/layout/MainLayout/ViewHeader";
import { gridSpacing } from "@/modules/ai-builder/store/constant";
import {
  PermissionButton,
  StyledPermissionButton,
} from "@/modules/ai-builder/ui-component/button/RBACButtons";
import ItemCard from "@/modules/ai-builder/ui-component/cards/ItemCard";
// project imports
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";

import AssistantDialog from "./AssistantDialog";
import LoadAssistantDialog from "./LoadAssistantDialog";

// ==============================|| OpenAIAssistantLayout ||============================== //

const OpenAIAssistantLayout = () => {
  const router = useRouter();

  const getAllAssistantsApi = useApi(assistantsApi.getAllAssistants);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [loadDialogProps, setLoadDialogProps] = useState({});

  const loadExisting = () => {
    const dialogProp = {
      title: "Load Existing Assistant",
    };
    setLoadDialogProps(dialogProp);
    setShowLoadDialog(true);
  };

  const [search, setSearch] = useState("");
  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const onAssistantSelected = (selectedOpenAIAssistantId, credential) => {
    setShowLoadDialog(false);
    addNew(selectedOpenAIAssistantId, credential);
  };

  const addNew = (selectedOpenAIAssistantId, credential) => {
    const dialogProp = {
      title: "Add New Assistant",
      type: "ADD",
      cancelButtonName: "Cancel",
      confirmButtonName: "Add",
      selectedOpenAIAssistantId,
      credential,
    };
    setDialogProps(dialogProp);
    setShowDialog(true);
  };

  const edit = (selectedAssistant) => {
    const dialogProp = {
      title: "Edit Assistant",
      type: "EDIT",
      cancelButtonName: "Cancel",
      confirmButtonName: "Save",
      data: selectedAssistant,
    };
    setDialogProps(dialogProp);
    setShowDialog(true);
  };

  const onConfirm = () => {
    setShowDialog(false);
    getAllAssistantsApi.request("OPENAI");
  };

  function filterAssistants(data) {
    const parsedData = JSON.parse(data.details);
    return parsedData?.name && parsedData.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  useEffect(() => {
    getAllAssistantsApi.request("OPENAI");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(getAllAssistantsApi.loading);
  }, [getAllAssistantsApi.loading]);

  useEffect(() => {
    if (getAllAssistantsApi.error) {
      setError(getAllAssistantsApi.error);
    }
  }, [getAllAssistantsApi.error]);

  return (
    <>
      <MainCard>
        {error ? (
          <ErrorBoundary error={error} />
        ) : (
          <Stack flexDirection="column" sx={{ gap: 3 }}>
            <ViewHeader
              isBackButton
              onSearchChange={onSearchChange}
              search
              searchPlaceholder="Search Assistants"
              title="OpenAI Assistant"
              description="Create assistants using OpenAI Assistant API"
              onBack={() => router.push(-1)}
            >
              <PermissionButton
                permissionId={"assistants:create"}
                variant="outlined"
                onClick={loadExisting}
                startIcon={<IconFileUpload />}
                sx={{ borderRadius: 2, height: 40 }}
              >
                Load
              </PermissionButton>
              <StyledPermissionButton
                permissionId={"assistants:create"}
                variant="contained"
                sx={{ borderRadius: 2, height: 40 }}
                onClick={addNew}
                startIcon={<IconPlus />}
              >
                Add
              </StyledPermissionButton>
            </ViewHeader>
            {isLoading ? (
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                <Skeleton variant="rounded" height={160} />
                <Skeleton variant="rounded" height={160} />
                <Skeleton variant="rounded" height={160} />
              </Box>
            ) : (
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                {getAllAssistantsApi.data?.filter(filterAssistants).map((data, index) => (
                  <ItemCard
                    data={{
                      name: JSON.parse(data.details)?.name,
                      description: JSON.parse(data.details)?.instructions,
                      iconSrc: data.iconSrc,
                    }}
                    key={index}
                    onClick={() => edit(data)}
                  />
                ))}
              </Box>
            )}
            {!isLoading && (!getAllAssistantsApi.data || getAllAssistantsApi.data.length === 0) && (
              <Stack sx={{ alignItems: "center", justifyContent: "center" }} flexDirection="column">
                <Box sx={{ p: 2, height: "auto" }}>
                  <img
                    style={{ objectFit: "cover", height: "20vh", width: "auto" }}
                    src={AssistantEmptySVG?.src || AssistantEmptySVG}
                    alt="AssistantEmptySVG"
                  />
                </Box>
                <div>No OpenAI Assistants Added Yet</div>
              </Stack>
            )}
          </Stack>
        )}
      </MainCard>
      <LoadAssistantDialog
        show={showLoadDialog}
        dialogProps={loadDialogProps}
        onCancel={() => setShowLoadDialog(false)}
        onAssistantSelected={onAssistantSelected}
        setError={setError}
      />
      <AssistantDialog
        show={showDialog}
        dialogProps={dialogProps}
        onCancel={() => setShowDialog(false)}
        onConfirm={onConfirm}
        setError={setError}
      />
    </>
  );
};

export default OpenAIAssistantLayout;
