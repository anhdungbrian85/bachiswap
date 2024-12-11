import { Box } from "@chakra-ui/react";
import React from "react";

const SectionContainer = (props, padding) => {
  return (
    <Box
      // paddingLeft={{ base: "24px", md: "52px" }}
      // paddingRight={{ base: "26px", md: "37px" }}
      padding={padding}
      {...props}
    />
  );
};

export default SectionContainer;
