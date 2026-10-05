import { Tab as MuiTab } from "@mui/material";
import { styled } from "@mui/system";

import { blue } from "./tabColors";

export const Tab = styled(MuiTab)(({ ...props }) => ({
  fontFamily: "'IBM Plex Sans', sans-serif",
  color: "white",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
  backgroundColor: "transparent",
  width: "100%",
  lineHeight: 1.5,
  padding: "8px 12px",
  margin: "6px",
  border: "none",
  borderRadius: "25px",
  display: "flex",
  justifyContent: "center",
  textTransform: "none",
  minHeight: "unset",
  "&:hover": {
    backgroundColor: props.sx?.backgroundColor || blue[400],
  },
  "&:focus": {
    color: "#fff",
    outline: `3px solid ${props.sx?.backgroundColor || blue[200]}`,
  },
  "&.Mui-selected": {
    backgroundColor: "#fff",
    color: blue[600],
  },
  "&.Mui-disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));
