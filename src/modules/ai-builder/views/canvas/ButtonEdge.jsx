import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import { useDispatch } from "react-redux";
import { EdgeText, getBezierPath } from "reactflow";

import { useTheme } from "@mui/material/styles";
import { SET_DIRTY } from "@/modules/ai-builder/store/actions";
import { flowContext } from "@/modules/ai-builder/store/context/ReactFlowContext";

import "./index.css";

const foreignObjectSize = 40;

const defaultStyle = {};

const ButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = defaultStyle,
  data,
  markerEnd,
}) => {
  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteEdge } = useContext(flowContext);

  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    deleteEdge(id);
    dispatch({ type: SET_DIRTY });
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <EdgeText
          x={sourceX + 10}
          y={sourceY + 10}
          label={data.label}
          labelStyle={{ fill: isDark ? "#e0e0e0" : "black" }}
          labelBgStyle={{ fill: "transparent" }}
          labelBgPadding={[2, 4]}
          labelBgBorderRadius={2}
        />
      )}
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
            <IconX stroke={2} size="12" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

ButtonEdge.propTypes = {
  id: PropTypes.string,
  sourceX: PropTypes.number,
  sourceY: PropTypes.number,
  targetX: PropTypes.number,
  targetY: PropTypes.number,
  sourcePosition: PropTypes.any,
  targetPosition: PropTypes.any,
  style: PropTypes.object,
  data: PropTypes.object,
  markerEnd: PropTypes.any,
};

export default memo(ButtonEdge);
