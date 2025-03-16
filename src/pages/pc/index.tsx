import Footer from "@/components/Shared/Footer";
import HeaderLanding from "@/components/Shared/HeaderLanding";
import { Box } from "@mui/material";
import ContentPCLandingTemplate from "./Content";

function PCLandingTemplate() {
  return (
    <Box bgcolor={"#e0e8ef"}>
      <HeaderLanding />
      <ContentPCLandingTemplate />
      <Footer />
    </Box>
  );
}

export default PCLandingTemplate;
