"use client";
// material-ui
import { Box, Skeleton, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// icons
import { IconLayoutGrid, IconList, IconPlus } from "@tabler/icons-react";
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
import { baseURL, gridSpacing } from "@/modules/ai-builder/store/constant";
import { useError } from "@/modules/ai-builder/store/context/ErrorContext";
import { StyledPermissionButton } from "@/modules/ai-builder/ui-component/button/RBACButtons";
import ItemCard from "@/modules/ai-builder/ui-component/cards/ItemCard";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import ConfirmDialog from "@/modules/ai-builder/ui-component/dialog/ConfirmDialog";
import TablePagination, {
  DEFAULT_ITEMS_PER_PAGE,
} from "@/modules/ai-builder/ui-component/pagination/TablePagination";
import { FlowListTable } from "@/modules/ai-builder/ui-component/table/FlowListTable";

// ==============================|| CHATFLOWS ||============================== //

const Chatflows = () => {
  const router = useRouter();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const isDark = theme.palette.mode === "dark";

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState({});
  const [search, setSearch] = useState("");
  const { error, setError } = useError();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflowsDjango);
  const [view, setView] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("chatFlowDisplayStyle") || "card" : "card"
  );

  /* Table Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(() =>
    typeof window !== "undefined"
      ? Number(localStorage.getItem("chatFlowPageSize") || DEFAULT_ITEMS_PER_PAGE)
      : DEFAULT_ITEMS_PER_PAGE
  );
  const [total, setTotal] = useState(0);

  const onChange = (page, pageLimit) => {
    setCurrentPage(page);
    setPageLimit(pageLimit);
    localStorage.setItem("chatFlowPageSize", pageLimit);
    applyFilters(page, pageLimit);
  };

  const applyFilters = (page, limit) => {
    getAllChatflowsApi.request();
  };

  const handleChange = (event, nextView) => {
    if (nextView === null) return;
    localStorage.setItem("chatFlowDisplayStyle", nextView);
    setView(nextView);
  };

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  function filterFlows(data) {
    return (
      data?.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
      data?.id.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const addNew = () => {
    router.push("/ai-builder/canvas");
  };

  const goToCanvas = (selectedChatflow) => {
    router.push(`/ai-builder/canvas/${selectedChatflow.id}`);
  };

  useEffect(() => {
    applyFilters(currentPage, pageLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(getAllChatflowsApi.loading);
  }, [getAllChatflowsApi.loading]);

  useEffect(() => {
    if (getAllChatflowsApi.data) {
      try {
        const chatflows = getAllChatflowsApi.data?.data;
        const total = getAllChatflowsApi.data?.total;
        setTotal(total);
        const images = {};
        for (let i = 0; i < chatflows.length; i += 1) {
          const flowDataStr = chatflows[i].flowData;
          const flowData = JSON.parse(flowDataStr);
          const nodes = flowData.nodes || [];
          images[chatflows[i].id] = [];
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].data.name === "stickyNote" || nodes[j].data.name === "stickyNoteAgentflow")
              continue;
            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`;
            if (!images[chatflows[i].id].some((img) => img.imageSrc === imageSrc)) {
              images[chatflows[i].id].push({
                imageSrc,
                label: nodes[j].data.label,
              });
            }
          }
        }
        setImages(images);
      } catch (e) {
        console.error(e);
      }
    }
  }, [getAllChatflowsApi.data]);

  return !mounted ? (
    // Render minimal placeholder during SSR to prevent hydration mismatch
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ height: '40px', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ height: 160, backgroundColor: '#f5f5f5', borderRadius: 8 }} />
          <div style={{ height: 160, backgroundColor: '#f5f5f5', borderRadius: 8 }} />
          <div style={{ height: 160, backgroundColor: '#f5f5f5', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  ) : (
    <MainCard>
      {error ? (
        <ErrorBoundary error={error} />
      ) : (
        <Stack flexDirection="column" sx={{ gap: 3 }}>
          <ViewHeader
            onSearchChange={onSearchChange}
            search
            searchPlaceholder="Search Name or Category"
            title="Chatflows"
            description="Build single-agent systems, chatbots and simple LLM flows"
          >
            {mounted ? (
              <ToggleButtonGroup
                sx={{ borderRadius: 2, maxHeight: 40 }}
                value={view}
                color="primary"
                disabled={total === 0}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton
                  sx={{
                    borderColor: isDark
                      ? "rgb(55 65 81)"
                      : "rgb(209 213 219)",
                    borderRadius: 2,
                    color: isDark ? "#e0e0e0" : "rgb(17 24 39)",
                    "&.Mui-selected": {
                      color: isDark ? "#ffffff" : "rgb(17 24 39)",
                      backgroundColor: isDark
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
                    borderColor: isDark
                      ? "rgb(55 65 81)"
                      : "rgb(209 213 219)",
                    borderRadius: 2,
                    color: isDark ? "#e0e0e0" : "rgb(17 24 39)",
                    "&.Mui-selected": {
                      color: isDark ? "#ffffff" : "rgb(17 24 39)",
                      backgroundColor: isDark
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
            ) : null}
            <StyledPermissionButton
              permissionId={"chatflows:create"}
              variant="contained"
              onClick={addNew}
              startIcon={<IconPlus />}
              sx={{ borderRadius: 2, height: 40 }}
            >
              Add New
            </StyledPermissionButton>
          </ViewHeader>

          {isLoading && (
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="rounded" height={160} />
            </Box>
          )}
          {!isLoading && total > 0 && (
            <>
              {!view || view === "card" ? (
                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                  {getAllChatflowsApi.data?.data?.filter(filterFlows).map((data, index) => (
                    <ItemCard
                      key={index}
                      onClick={() => goToCanvas(data)}
                      data={data}
                      images={images[data.id]}
                    />
                  ))}
                </Box>
              ) : (
                <FlowListTable
                  data={getAllChatflowsApi.data?.data}
                  images={images}
                  isLoading={isLoading}
                  filterFunction={filterFlows}
                  updateFlowsApi={getAllChatflowsApi}
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
          {!isLoading &&
            (!getAllChatflowsApi.data?.data || getAllChatflowsApi.data?.data.length === 0) && (
              <Stack sx={{ alignItems: "center", justifyContent: "center" }} flexDirection="column">
                <div>No Chatflows Yet</div>
              </Stack>
            )}
        </Stack>
      )}
      <ConfirmDialog />
    </MainCard>
  );
};

export default Chatflows;
