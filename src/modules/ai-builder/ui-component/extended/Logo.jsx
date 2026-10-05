import { useSelector } from "react-redux";

import logoDark from "@/modules/ai-builder/assets/images/flowise_dark.svg";
import logo from "@/modules/ai-builder/assets/images/flowise_white.svg";

// ==============================|| LOGO ||============================== //

const Logo = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <div
      style={{ alignItems: "center", display: "flex", flexDirection: "row", marginLeft: "10px" }}
    >
      <img
        style={{ objectFit: "contain", height: "auto", width: 150 }}
        src={customization.isDarkMode ? logoDark : logo}
        alt="Flowise"
      />
    </div>
  );
};

export default Logo;
