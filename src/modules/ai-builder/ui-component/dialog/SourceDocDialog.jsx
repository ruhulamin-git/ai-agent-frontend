import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

const ReactJson = dynamic(() => import("flowise-react-json-view"), { ssr: false });

const SourceDocDialog = ({ show, dialogProps, onCancel }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);
  const customization = useSelector((state) => state.customization);

  const [data, setData] = useState({});

  useEffect(() => {
    if (dialogProps.data) setData(dialogProps.data);

    return () => {
      setData({});
    };
  }, [dialogProps]);

  const component = show ? (
    <Dialog
      onClose={onCancel}
      open={show}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ fontSize: "1rem" }} id="alert-dialog-title">
        {dialogProps.title ?? "Source Documents"}
      </DialogTitle>
      <DialogContent>
        {data.error && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: "error.light",
              color: "error.dark",
              overflowX: "auto",
              wordBreak: "break-word",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Error:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {data.error}
            </Typography>
          </Box>
        )}
        <ReactJson
          theme={customization.isDarkMode ? "ocean" : "rjv-default"}
          style={{ padding: 10, borderRadius: 10 }}
          src={data}
          name={null}
          quotesOnKeys={false}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

SourceDocDialog.propTypes = {
  show: PropTypes.bool,
  dialogProps: PropTypes.object,
  onCancel: PropTypes.func,
};

export default SourceDocDialog;
