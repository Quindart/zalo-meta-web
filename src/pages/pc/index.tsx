import Footer from "@/components/Shared/Footer";
import HeaderLanding from "@/components/Shared/HeaderLanding";
import { Box } from "@mui/material";
import ContentPCLandingTemplate from "./Content";
import { blue, blueGrey, grey, indigo } from "@mui/material/colors";

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
