// material-ui
import { Box, Skeleton, Stack } from "@mui/material";
// icons
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// API
import assistantsApi from "@/modules/ai-builder/api/assistants";
import AssistantEmptySVG from "@/modules/ai-builder/assets/images/assistant_empty.svg";
import ErrorBoundary from "@/modules/ai-builder/ErrorBoundary";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
// project imports
import ViewHeader from "@/modules/ai-builder/layout/MainLayout/ViewHeader";
import { baseURL, gridSpacing } from "@/modules/ai-builder/store/constant";
import { StyledPermissionButton } from "@/modules/ai-builder/ui-component/button/RBACButtons";
import ItemCard from "@/modules/ai-builder/ui-component/cards/ItemCard";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";

import AddCustomAssistantDialog from "./AddCustomAssistantDialog";

// ==============================|| CustomAssistantLayout ||============================== //

const CustomAssistantLayout = () => {
  const router = useRouter();

  const getAllAssistantsApi = useApi(assistantsApi.getAllAssistants);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const [search, setSearch] = useState("");
  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const addNew = () => {
    const dialogProp = {
      title: "Add New Custom Assistant",
      type: "ADD",
      cancelButtonName: "Cancel",
      confirmButtonName: "Add",
    };
    setDialogProps(dialogProp);
    setShowDialog(true);
  };

  const onConfirm = (assistantId) => {
    setShowDialog(false);
    router.push(`/assistants/custom/${assistantId}`);
  };

  function filterAssistants(data) {
    const parsedData = JSON.parse(data.details);
    return parsedData?.name && parsedData.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  const getImages = (details) => {
    const images = [];
    if (details?.chatModel?.name) {
      images.push({
        imageSrc: `${baseURL}/api/v1/node-icon/${details.chatModel.name}`,
      });
    }
    return images;
  };

  useEffect(() => {
    getAllAssistantsApi.request("CUSTOM");

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
              title="Custom Assistant"
              description="Create custom assistants with your choice of LLMs"
              onBack={() => router.push(-1)}
            >
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
                      description: JSON.parse(data.details)?.instruction,
                    }}
                    images={getImages(JSON.parse(data.details))}
                    key={index}
                    onClick={() => router.push("/assistants/custom/" + data.id)}
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
                <div>No Custom Assistants Added Yet</div>
              </Stack>
            )}
          </Stack>
        )}
      </MainCard>
      <AddCustomAssistantDialog
        show={showDialog}
        dialogProps={dialogProps}
        onCancel={() => setShowDialog(false)}
        onConfirm={onConfirm}
        setError={setError}
      />
    </>
  );
};

export default CustomAssistantLayout;
