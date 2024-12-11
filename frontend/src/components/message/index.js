import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { IoCloseSharp } from "react-icons/io5";
import CloseButton from "../button/CloseButton";

const Message = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      border="1px solid #FCDDEC"
      minW={{ base: "90%", md: "600px" }}
      zIndex={"1000"}
      sx={{
        backdropFilter: "blur(10px) !important",
        clipPath:
          "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "#FCDDEC !important",
          clipPath: "polygon(0 100%, 100% 0, 0 0)",
        },
        "::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "#FCDDEC !important",
          clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
        },
      }}
    >
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        padding={"27px 27px 27px 27px"}
        backgroundColor="var(--color-background-popup)"
      >
        <Box width={"100%"} marginBottom={"31px"}>
          <Flex justifyContent={"flex-end"}>
            <CloseButton onClick={onClose}>
              <Text fontSize="30px" color={"#000"} fontWeight={500}>
                <IoCloseSharp />
              </Text>
            </CloseButton>
          </Flex>
        </Box>
        {children}
      </Flex>
    </Box>
  );
};

export default Message;
