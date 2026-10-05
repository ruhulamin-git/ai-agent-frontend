// material-ui
import { ButtonBase } from "@mui/material";
import Link from "next/link";

// project imports
import config from "@/modules/ai-builder/config";
import { AgentKitLogo } from "@/shared/ui/agentkit-logo";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <ButtonBase disableRipple component={Link} href={config.defaultPath}>
   <AgentKitLogo size="md" />
  </ButtonBase>
);

export default LogoSection;
