import React from "react";

import {
  Button,
  Flex,
  Img,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import MessageSuccess from "../../assets/icons/message-success.svg";
import MessageFailed from "../../assets/icons/message-failed.svg";

export default function Message({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW={"360px"}
        p={"64px"}
        borderRadius="16px"
        border="0.5px solid var(--green)"
        backdropFilter="blur(100%)"
        bg="var(--bg-green)"
        boxShadow="0px 0px 60px 0px rgba(102, 179, 102, 0.60)"
      >
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"52px"}
        >
          <Img src={MessageSuccess} />
          <Text
            fontSize={"24px"}
            fontWeight={600}
            lineHeight={"normal"}
            textAlign={"center"}
            color="var(--green)"
          >
            Payment success
          </Text>
        </Flex>
      </ModalContent>
      <ModalContent
        maxW={"360px"}
        p={"64px 40px 32px 40px"}
        borderRadius="16px"
        border="0.5px solid var(--Primary-500)"
        backdropFilter="blur(100%)"
        bg="var(--bg-pink)"
        boxShadow="0px 0px 60px 0px rgba(102, 179, 102, 0.60)"
      >
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"30px"}
        >
          <Img src={MessageFailed} />
          <Text
            fontSize={"24px"}
            fontWeight={600}
            lineHeight={"normal"}
            textAlign={"center"}
            color="var(--Primary-500)"
          >
            Your TON balance is getting smaller
          </Text>
          <Flex w={"100%"} alignItems={"center"} gap={"10px"}>
            <Button w={"50%"} variant={"white"} color="var(--Black) !important">
              Back
            </Button>
            <Button w={"50%"}>Deposit</Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
