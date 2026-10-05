import { Divider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import AllowedDomains from "@/modules/ai-builder/ui-component/extended/AllowedDomains";
// Project import
import RateLimit from "@/modules/ai-builder/ui-component/extended/RateLimit";

import OverrideConfig from "./OverrideConfig";

const Security = ({ dialogProps }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="column"
      divider={<Divider sx={{ my: 0.5, borderColor: theme.palette.grey[900] + 25 }} />}
      spacing={4}
    >
      <RateLimit dialogProps={dialogProps} />
      <AllowedDomains dialogProps={dialogProps} />
      <OverrideConfig dialogProps={dialogProps} />
    </Stack>
  );
};

Security.propTypes = {
  dialogProps: PropTypes.object,
};

export default Security;
