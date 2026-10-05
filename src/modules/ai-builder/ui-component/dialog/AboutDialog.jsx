import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { baseURL } from "@/modules/ai-builder/store/constant";

const AboutDialog = ({ show, onCancel }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);

  const [data, setData] = useState({});

  useEffect(() => {
    if (show) {
      const latestReleaseReq = axios.get(
        "https://api.github.com/repos/FlowiseAI/Flowise/releases/latest"
      );
      const currentVersionReq = axios.get(`${baseURL}/api/v1/version`, {
        withCredentials: true,
        headers: { "Content-type": "application/json", "x-request-from": "internal" },
      });

      Promise.all([latestReleaseReq, currentVersionReq])
        .then(([latestReleaseData, currentVersionData]) => {
          const finalData = {
            ...latestReleaseData.data,
            currentVersion: currentVersionData.data.version,
          };
          setData(finalData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [show]);

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
        Flowise Version
      </DialogTitle>
      <DialogContent>
        {data && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Current Version</TableCell>
                  <TableCell>Latest Version</TableCell>
                  <TableCell>Published At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {data.currentVersion}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <a target="_blank" rel="noreferrer" href={data.html_url}>
                      {data.name}
                    </a>
                  </TableCell>
                  <TableCell>{moment(data.published_at).fromNow()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  ) : null;

  return portalElement ? createPortal(component, portalElement) : component;
};

AboutDialog.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default AboutDialog;
