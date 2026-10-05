import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

import unauthorizedSVG from "@/modules/ai-builder/assets/images/unauthorized.svg";
import { StyledButton } from "@/modules/ai-builder/ui-component/button/StyledButton";
import MainCard from "@/modules/ai-builder/ui-component/cards/MainCard";

// ==============================|| UnauthorizedPage ||============================== //

const UnauthorizedPage = () => {
  return (
    <MainCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 210px)",
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
          flexDirection="column"
        >
          <Box sx={{ p: 2, height: "auto" }}>
            <img
              style={{ objectFit: "cover", height: "20vh", width: "auto" }}
              src={unauthorizedSVG?.src || unauthorizedSVG}
              alt="unauthorizedSVG"
            />
          </Box>
          <Typography sx={{ mb: 2 }} variant="h4" component="div" fontWeight="bold">
            403 Forbidden
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            You do not have permission to access this page.
          </Typography>
          <Link href="/">
            <StyledButton sx={{ px: 2, py: 1 }}>Back to Home</StyledButton>
          </Link>
        </Stack>
      </Box>
    </MainCard>
  );
};

export default UnauthorizedPage;
