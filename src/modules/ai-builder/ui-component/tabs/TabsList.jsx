import { Tabs } from "@mui/material";
import { styled } from "@mui/system";

import { blue } from "./tabColors";

export const TabsList = styled(Tabs)(({ theme, ...props }) => ({
  minWidth: 400,
  backgroundColor: props.sx?.backgroundColor || blue[500],
  borderRadius: "20px",
  marginTop: "16px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "space-between",
  boxShadow:
    theme?.palette?.mode === "dark"
      ? "0px 4px 6px rgba(0,0,0, 0.4)"
      : "0px 4px 6px rgba(0,0,0, 0.2)",
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));
