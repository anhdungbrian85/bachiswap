import React from "react";
import { Button } from "@chakra-ui/react";

const CloseButton = ({ children, onClick, ...props }) => {
  return (
    <Button
      {...props}
      padding={"0px"}
      bg="pink.500"
      color="white"
      fontSize={{ base: "24px", md: "40px" }}
      fontWeight="400"
      position="relative"
      borderRadius="0px"
      w={{ base: "40px", md: "60px" }}
      h={{ base: "40px", md: "60px" }}
      _hover={{ bg: "var(--color-main)" }}
      sx={{
        clipPath:
          "polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "16px",
          height: "16px",
          clipPath: "polygon(0 100%, 100% 0, 0 0)",
        },
        "::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "16px",
          height: "16px",
          clipPath: "polygon(100% 100%, 100% 0, 0 100%)", // Điều chỉnh clip-path cho góc dưới
        },
        "@media (max-width: 768px)": {
          clipPath:
            "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
          "::before": {
            width: "10px",
            height: "10px",
            backgroundColor: "pink.500",
          },
          "::after": {
            width: "10px",
            height: "10px",
            backgroundColor: "pink.500",
          },
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CloseButton;
