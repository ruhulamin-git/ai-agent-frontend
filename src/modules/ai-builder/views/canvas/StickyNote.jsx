import { Box, IconButton } from "@mui/material";
// material-ui
import { darken, lighten, useTheme } from "@mui/material/styles";
import { IconCopy, IconTrash } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { memo, useContext, useState } from "react";
import { useSelector } from "react-redux";

// const
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";
// project imports
import NodeCardWrapper from "@/modules/ai-builder/ui-component/cards/NodeCardWrapper";
import { Input } from "@/modules/ai-builder/ui-component/input/Input";
import NodeTooltip from "@/modules/ai-builder/ui-component/tooltip/NodeTooltip";

const StickyNote = ({ data }) => {
  const theme = useTheme();
  const canvas = useSelector((state) => state.canvas);
  const isDark = theme.palette.mode === "dark";
  const { deleteNode, duplicateNode } = useContext(flowContext);
  const [inputParam] = data.inputParams;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const defaultColor = "#FFE770"; // fallback color if data.color is not present
  const nodeColor = data.color || defaultColor;

  const getBorderColor = () => {
    if (data.selected) return theme.palette.primary.main;
    else if (isDark) return theme.palette.grey[700];
    else return theme.palette.grey[900] + 50;
  };

  const getBackgroundColor = () => {
    if (isDark) {
      return data.selected ? darken(nodeColor, 0.7) : darken(nodeColor, 0.8);
    } else {
      return data.selected ? lighten(nodeColor, 0.1) : lighten(nodeColor, 0.2);
    }
  };

  return (
    <NodeCardWrapper
      content={false}
      sx={{
        padding: 0,
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      }}
      border={false}
    >
      <NodeTooltip
        open={!canvas.canvasDialogShow && open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableFocusListener
        title={
          <div
            style={{
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <IconButton
              title="Duplicate"
              onClick={() => {
                duplicateNode(data.id);
              }}
              sx={{
                height: "35px",
                width: "35px",
                color: isDark ? "white" : "inherit",
                "&:hover": { color: theme?.palette.primary.main },
              }}
            >
              <IconCopy />
            </IconButton>
            <IconButton
              title="Delete"
              onClick={() => {
                deleteNode(data.id);
              }}
              sx={{
                height: "35px",
                width: "35px",
                color: isDark ? "white" : "inherit",
                "&:hover": { color: theme?.palette.error.main },
              }}
            >
              <IconTrash />
            </IconButton>
          </div>
        }
        placement="right-start"
      >
        <Box>
          <Input
            key={data.id}
            inputParam={inputParam}
            onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
            value={data.inputs[inputParam.name] ?? inputParam.default ?? ""}
            nodes={
              inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getNodes() : []
            }
            edges={
              inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getEdges() : []
            }
            nodeId={data.id}
          />
        </Box>
      </NodeTooltip>
    </NodeCardWrapper>
  );
};

StickyNote.propTypes = {
  data: PropTypes.object,
};

export default memo(StickyNote);
