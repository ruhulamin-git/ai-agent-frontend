import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PortalDialog = ({ children, show }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal") || document.body);
    }
  }, []);

  if (!show) return null;

  return portalElement ? createPortal(children, portalElement) : children;
};

PortalDialog.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
};

export default PortalDialog;
