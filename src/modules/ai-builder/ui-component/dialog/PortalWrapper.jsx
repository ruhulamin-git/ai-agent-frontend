import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PortalWrapper = ({ children, show = true }) => {
  const [portalElement, setPortalElement] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const element = document.getElementById("portal") || document.body;
      setPortalElement(element);
    }
  }, []);

  // Don't render anything until mounted and portal element is available
  if (!mounted || !portalElement || !show) {
    return null;
  }

  return createPortal(children, portalElement);
};

PortalWrapper.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
};

export default PortalWrapper;
