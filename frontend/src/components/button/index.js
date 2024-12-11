import React from "react";
import { Box, Button } from "@chakra-ui/react";

const CustomButton = ({ children, onClick, ...props }) => {
  return (
    <Button
      {...props}
      // bg="pink.500"
      color="white"
      fontWeight="400"
      fontSize={{ base: "16px", xl: "20px" }}
      // position="relative"
      borderRadius="3px"
      // height={"60px"}
      sx={{
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        "::before": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "#EB7FB3",
          clipPath: "polygon(0 100%, 100% 100%, 0 0)",
        },
        "::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "#EB7FB3",
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
        },
        "@media (max-width: 768px)": {
          clipPath:
            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          "::before": {
            width: "10px",
            height: "10px",
            backgroundColor: "#EB7FB3",
          },
          "::after": {
            width: "10px",
            height: "10px",
            backgroundColor: "#EB7FB3",
          },
        },
      }}
      minWidth={"max-content"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
