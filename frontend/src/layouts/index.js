import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import BachiSwapFooter from "../components/Footer";
import { useLocation } from "react-router-dom";
const AppLayout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box>{children}</Box>
      <BachiSwapFooter />
    </Box>
  );
};

const LandingPageLayout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box>{children}</Box>
      <BachiSwapFooter />
    </Box>
  );
};

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  if (["/node"].includes(location.pathname))
    return <LandingPageLayout>{children}</LandingPageLayout>;
  return <AppLayout>{children}</AppLayout>;
};

export default DefaultLayout;
