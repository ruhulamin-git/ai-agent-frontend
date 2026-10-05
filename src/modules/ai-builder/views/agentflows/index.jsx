"use client";
// material-ui
import { Box, Chip, IconButton, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// icons
import { IconAlertTriangle, IconLayoutGrid, IconList, IconPlus, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// API
import chatflowsApi from "@/modules/ai-builder/api/chatflows";
// project imports
import ErrorBoundary from "@/modules/ai-builder/ErrorBoundary";
// Hooks
import useApi from "@/modules/ai-builder/hooks/useApi";
import ViewHeader from "@/modules/ai-builder/layout/MainLayout/ViewHeader";
// const
import { AGENTFLOW_ICONS, baseURL, gridSpacing } from "@/modules/ai-builder/store/constant";
import { useError } from "@/modules/ai-builder/store/context/ErrorContext";
import { StyledPermissionButton } from "@/modules/ai-builder/ui-component/button/RBACButtons";
import ItemCard from "@/modules/ai-builder/ui-component/cards/ItemCard";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
import TablePagination, {
  DEFAULT_ITEMS_PER_PAGE,
} from "@/modules/ai-builder/ui-component/pagination/TablePagination";
import { FlowListTable } from "@/modules/ai-builder/ui-component/table/FlowListTable";

// ==============================|| AGENTS ||============================== //

const Agentflows = () => {
  const router = useRouter();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState({});
  const [icons, setIcons] = useState({});
  const [scheduleStatuses, setScheduleStatuses] = useState({});
  const [search, setSearch] = useState("");
  const { error, setError } = useError();

  const getAllAgentflowsApi = useApi(chatflowsApi.getAllAgentflowsDjango);
  const [view, setView] = useState("card");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [total, setTotal] = useState(0);

  // Hydrate state from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const savedView = localStorage.getItem("agentFlowDisplayStyle");
    const savedPageSize = localStorage.getItem("agentFlowPageSize");

    if (savedView) setView(savedView);
    if (savedPageSize) setPageLimit(Number(savedPageSize));
  }, []);

  const onChange = (page, pageLimit) => {
    setCurrentPage(page);
    setPageLimit(pageLimit);
    localStorage.setItem("agentFlowPageSize", pageLimit);
    refresh();
  };

  const refresh = () => {
    getAllAgentflowsApi.request();
  };

  const handleChange = (event, nextView) => {
    if (nextView === null) return;
    localStorage.setItem("agentFlowDisplayStyle", nextView);
    setView(nextView);
  };

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  function filterFlows(data) {
    return (
      data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
      data.id.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const addNew = () => {
    router.push("/ai-builder/agentcanvas");
  };

  const goToCanvas = (selectedAgentflow) => {
    router.push(`/ai-builder/agentcanvas/${selectedAgentflow.id}`);
  };

  useEffect(() => {
    refresh();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getAllAgentflowsApi.error) {
      setError(getAllAgentflowsApi.error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllAgentflowsApi.error]);

  useEffect(() => {
    setIsLoading(getAllAgentflowsApi.loading);
  }, [getAllAgentflowsApi.loading]);

  useEffect(() => {
    if (getAllAgentflowsApi.data) {
      try {
        const agentflows = getAllAgentflowsApi.data?.data;
        setTotal(getAllAgentflowsApi.data?.total);
        const images = {};
        const icons = {};
        const scheduleConfiguredIds = [];
        for (let i = 0; i < agentflows.length; i += 1) {
          const flowDataStr = agentflows[i].flowData;
          const flowData = JSON.parse(flowDataStr);
          const nodes = flowData.nodes || [];
          images[agentflows[i].id] = [];
          icons[agentflows[i].id] = [];
          let isScheduleFlow = false;
          for (let j = 0; j < nodes.length; j += 1) {
            const node = nodes[j];
            if (
              node.data?.name === "startAgentflow" &&
              node.data?.inputs?.startInputType === "scheduleInput"
            ) {
              isScheduleFlow = true;
            }
            if (node.data.name === "stickyNote" || node.data.name === "stickyNoteAgentflow")
              continue;
            const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === node.data.name);
            if (foundIcon) {
              icons[agentflows[i].id].push(foundIcon);
            } else {
              const imageSrc = `${baseURL}/api/v1/node-icon/${node.data.name}`;
              if (!images[agentflows[i].id].some((img) => img.imageSrc === imageSrc)) {
                images[agentflows[i].id].push({
                  imageSrc,
                  label: node.data.label,
                });
              }
            }
          }
          if (isScheduleFlow) scheduleConfiguredIds.push(agentflows[i].id);
        }
        setImages(images);
        setIcons(icons);

        const initialStatuses = {};
        scheduleConfiguredIds.forEach((id) => {
          initialStatuses[id] = { isScheduled: true, enabled: false, loading: true };
        });
        setScheduleStatuses(initialStatuses);

        if (scheduleConfiguredIds.length > 0) {
          Promise.all(
            scheduleConfiguredIds.map((id) =>
              chatflowsApi
                .getScheduleStatus(id)
                .then((res) => ({ id, data: res.data }))
                .catch(() => ({ id, error: true }))
            )
          ).then((results) => {
            setScheduleStatuses((prev) => {
              const next = { ...prev };
              results.forEach(({ id, data }) => {
                if (next[id]) {
                  next[id] = {
                    ...next[id],
                    enabled: data?.enabled === true,
                    nextRunAt: data?.record?.nextRunAt || null,
                    cronExpression: data?.record?.cronExpression || null,
                    loading: false,
                  };
                }
              });
              return next;
            });
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [getAllAgentflowsApi.data]);

  return (
    <MainCard>
      {error ? (
        <ErrorBoundary error={error} />
      ) : (
        <Stack flexDirection="column" sx={{ gap: 3 }}>
          <ViewHeader
            onSearchChange={onSearchChange}
            search
            searchPlaceholder="Search Name or Category"
            title="Agentflows"
            description="Multi-agent systems, workflow orchestration"
          >

            <ToggleButtonGroup
              sx={{ borderRadius: 2, maxHeight: 40 }}
              value={view}
              disabled={total === 0}
              color="primary"
              exclusive
              onChange={handleChange}
            >
              <ToggleButton
                sx={{
                  borderColor: customization.isDarkMode ? "rgb(55 65 81)" : "rgb(209 213 219)",
                  borderRadius: 2,
                  color: customization.isDarkMode ? "#e0e0e0" : "rgb(17 24 39)",
                  "&.Mui-selected": {
                    color: customization.isDarkMode ? "#ffffff" : "rgb(17 24 39)",
                    backgroundColor: customization.isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.08)",
                  },
                }}
                variant="contained"
                value="card"
                title="Card View"
              >
                <IconLayoutGrid />
              </ToggleButton>
              <ToggleButton
                sx={{
                  borderColor: customization.isDarkMode ? "rgb(55 65 81)" : "rgb(209 213 219)",
                  borderRadius: 2,
                  color: customization.isDarkMode ? "#e0e0e0" : "rgb(17 24 39)",
                  "&.Mui-selected": {
                    color: customization.isDarkMode ? "#ffffff" : "rgb(17 24 39)",
                    backgroundColor: customization.isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.08)",
                  },
                }}
                variant="contained"
                value="list"
                title="List View"
              >
                <IconList />
              </ToggleButton>
            </ToggleButtonGroup>
            <StyledPermissionButton
              permissionId={"agentflows:create"}
              variant="contained"
              onClick={addNew}
              startIcon={<IconPlus />}
              sx={{ borderRadius: 2, height: 40 }}
            >
              Add New
            </StyledPermissionButton>
          </ViewHeader>


          {!isLoading && total > 0 && (
            <>
              {!view || view === "card" ? (
                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                  {getAllAgentflowsApi.data?.data.filter(filterFlows).map((data, index) => (
                    <ItemCard
                      key={index}
                      onClick={() => goToCanvas(data)}
                      data={data}
                      images={images[data.id]}
                      icons={icons[data.id]}
                      scheduleStatus={scheduleStatuses[data.id]}
                    />
                  ))}
                </Box>
              ) : (
                <FlowListTable
                  isAgentCanvas
                  isAgentflowV2={true}
                  hideActions={true}
                  data={getAllAgentflowsApi.data?.data}
                  images={images}
                  icons={icons}
                  scheduleStatuses={scheduleStatuses}
                  isLoading={isLoading}
                  filterFunction={filterFlows}
                  updateFlowsApi={getAllAgentflowsApi}
                  setError={setError}
                  currentPage={currentPage}
                  pageLimit={pageLimit}
                />
              )}
              {/* Pagination and Page Size Controls */}
              <TablePagination
                currentPage={currentPage}
                limit={pageLimit}
                total={total}
                onChange={onChange}
              />
            </>
          )}

          {!isLoading && total === 0 && (
            <Stack sx={{ alignItems: "center", justifyContent: "center" }} flexDirection="column">
              <div>No Agents Yet</div>
            </Stack>
          )}
        </Stack>
      )}
      <ConfirmDialog />
    </MainCard>
  );
};

export default Agentflows;
