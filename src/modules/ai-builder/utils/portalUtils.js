import { useEffect, useState } from "react";

export const usePortalElement = () => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const element = document.getElementById("portal") || document.body;
      setPortalElement(element);
    }
  }, []);

  return portalElement;
};
