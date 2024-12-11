import { Box } from "@chakra-ui/react";
import React from "react";

export default function BachiBox({ children, ...props }) {
  return (
    <Box
      {...props}
      borderRadius="8px"
      border="1px solid var(--Primary-500)"
      backdropFilter="blur(10px)"
      bg="transparent"
      boxShadow="inset 0px 0px 15px 5px rgba(255, 0, 150, 0.4)"
    >
      {children}
    </Box>
  );
}
