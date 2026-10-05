import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconCopy } from "@tabler/icons-react";
import PropTypes from "prop-types";

const ErrorBoundary = ({ error }) => {
  const theme = useTheme();

  const copyToClipboard = () => {
    const errorMessage = `Status: ${error?.response?.status ?? "Unknown"}\n${error?.response?.data?.message ?? error?.message ?? "Unknown error"}`;
    navigator.clipboard.writeText(errorMessage);
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.grey[900] + 25,
        borderRadius: 2,
        padding: "20px",
        maxWidth: "1280px",
      }}
    >
      <Stack flexDirection="column" sx={{ alignItems: "center", gap: 3 }}>
        <Stack flexDirection="column" sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h2">Oh snap!</Typography>
          <Typography variant="h3">The following error occurred when loading this page.</Typography>
        </Stack>
        <Card variant="outlined">
          <Box sx={{ position: "relative", px: 2, py: 3 }}>
            <IconButton
              onClick={copyToClipboard}
              size="small"
              sx={{ position: "absolute", top: 1, right: 1, color: theme.palette.grey[900] + 25 }}
            >
              <IconCopy />
            </IconButton>
            <pre
              style={{
                margin: 0,
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                textAlign: "center",
              }}
            >
              <code>{`Status: ${error?.response?.status ?? "Unknown"}`}</code>
              <br />
              <code>{error?.response?.data?.message ?? error?.message ?? "An unexpected error occurred"}</code>
            </pre>
          </Box>
        </Card>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.1rem", textAlign: "center", lineHeight: "1.5" }}
        >
          Please retry after some time. If the issue persists, reach out to us on our Discord
          server.
          <br />
          Alternatively, you can raise an issue on Github.
        </Typography>
      </Stack>
    </Box>
  );
};

ErrorBoundary.propTypes = {
  error: PropTypes.object,
};

export default ErrorBoundary;
