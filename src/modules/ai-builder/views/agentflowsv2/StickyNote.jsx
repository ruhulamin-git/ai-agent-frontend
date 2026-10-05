// project imports
import { Box, ButtonGroup, IconButton } from "@mui/material";
// material-ui
import { alpha, darken, lighten, styled, useTheme } from "@mui/material/styles";
import { IconCopy, IconTrash } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NodeToolbar } from "reactflow";

// const
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";
import { Input } from "@/modules/ai-builder/ui-component/input/Input";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  background: theme.palette.card.main,
  color: theme.darkTextPrimary,
  border: "solid 1px",
  width: "max-content",
  height: "auto",
  padding: "10px",
  boxShadow: "none",
}));

const StyledNodeToolbar = styled(NodeToolbar)(({ theme }) => ({
  backgroundColor: theme.palette.card.main,
  color: theme.darkTextPrimary,
  padding: "5px",
  borderRadius: "10px",
  boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
}));

const StickyNote = ({ data }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const ref = useRef(null);

  const { reactFlowInstance, deleteNode, duplicateNode } = useContext(flowContext);
  const [inputParam] = data.inputParams;
  const [isHovered, setIsHovered] = useState(false);

  const defaultColor = "#666666"; // fallback color if data.color is not present
  const nodeColor = data.color || defaultColor;

  // Get different shades of the color based on state
  const getStateColor = () => {
    if (data.selected) return nodeColor;
    if (isHovered) return alpha(nodeColor, 0.8);
    return alpha(nodeColor, 0.5);
  };

  const getBackgroundColor = () => {
    if (customization.isDarkMode) {
      return isHovered ? darken(nodeColor, 0.7) : darken(nodeColor, 0.8);
    }
    return isHovered ? lighten(nodeColor, 0.8) : lighten(nodeColor, 0.9);
  };

  return (
    <div ref={ref} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <StyledNodeToolbar>
        <ButtonGroup sx={{ gap: 1 }} variant="outlined" aria-label="Basic button group">
          <IconButton
            size={"small"}
            title="Duplicate"
            onClick={() => {
              duplicateNode(data.id);
            }}
            sx={{
              color: customization.isDarkMode ? "white" : "inherit",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            <IconCopy size={20} />
          </IconButton>
          <IconButton
            size={"small"}
            title="Delete"
            onClick={() => {
              deleteNode(data.id);
            }}
            sx={{
              color: customization.isDarkMode ? "white" : "inherit",
              "&:hover": {
                color: theme.palette.error.main,
              },
            }}
          >
            <IconTrash size={20} />
          </IconButton>
        </ButtonGroup>
      </StyledNodeToolbar>
      <CardWrapper
        content={false}
        sx={{
          borderColor: getStateColor(),
          borderWidth: "1px",
          boxShadow: data.selected ? `0 0 0 1px ${getStateColor()} !important` : "none",
          minHeight: 60,
          height: "auto",
          backgroundColor: getBackgroundColor(),
          display: "flex",
          alignItems: "center",
          "&:hover": {
            boxShadow: data.selected ? `0 0 0 1px ${getStateColor()} !important` : "none",
          },
        }}
        border={false}
      >
        <Box>
          <Input
            key={data.id}
            placeholder={inputParam.placeholder}
            inputParam={inputParam}
            onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
            value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
            nodes={reactFlowInstance ? reactFlowInstance.getNodes() : []}
            edges={reactFlowInstance ? reactFlowInstance.getEdges() : []}
            nodeId={data.id}
          />
        </Box>
      </CardWrapper>
    </div>
  );
};

StickyNote.propTypes = {
  data: PropTypes.object,
};

export default StickyNote;
