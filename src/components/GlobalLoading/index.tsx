import { Box, LinearProgress } from "@mui/material";

function GlobalLoading() {
  return (
    <Box position={"sticky"} zIndex={9999} top={0}>
      <LinearProgress />
    </Box>
  );
}

export default GlobalLoading;
