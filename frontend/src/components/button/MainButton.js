import { Button } from "@chakra-ui/react";
import React from "react";

const MainButton = ({
  children,
  backgroundColor,
  width,
  height,
  border,
  onClick,
  borderRadius,
  padding,
  ...props
}) => {
  return (
    <Button
      {...props}
      borderRadius={borderRadius || "12px"}
      padding={padding || "16px 36px"}
      fontWeight={400}
      backgroundColor={backgroundColor}
      width={width}
      height={height}
      border={border}
      _hover={{ bg: "normal" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default MainButton;
