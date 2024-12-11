import {
  Button,
  Flex,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import LogoReferral from "../../assets/icons/referral-logo.svg";
import CopyRef from "../../assets/icons/referral-copy.svg";
import toast from "react-hot-toast";
export default function ReferralAdd({ isOpen, onClose }) {
  const inputRef = useRef(null);
  //Coppy
  const handleCopy = () => {
    const inputValue = inputRef.current.value;
    navigator.clipboard.writeText(inputValue);
    if (inputValue !== "") {
      toast.success("Copy address successfully");
    } else {
      toast.error("Copy failed");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      autoFocus={false}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent maxW={"360px"} bg="var(--Background)">
        <Flex
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          p={"64px 16px 32px 16px"}
          border="1px solid var(--Primary-500)"
          backdropFilter="blur(10px)"
          bg="transparent"
          boxShadow="inset 0px 0px 15px 5px rgba(255, 0, 150, 0.4)"
          borderRadius={"4px"}
          gap={"16px"}
        >
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            w={"120px"}
            h={"120px"}
            borderRadius={"50%"}
            border="3px solid var(--Primary-500)"
            backdropFilter="blur(10px)"
            bg="transparent"
            boxShadow="inset 0px 0px 60px 0px rgba(255, 1, 124, 0.60 )"
          >
            <Img src={LogoReferral} />
          </Flex>
          <Text
            fontSize={"24px"}
            fontWeight={600}
            lineHeight={"normal"}
            textAlign={"center"}
            color="var(--Primary-500)"
          >
            Your Friends Referral
          </Text>
          <InputGroup>
            <Input
              ref={inputRef}
              placeholder="https://t.me/_BachiSwap_Launch?..."
            />
            <InputRightElement>
              <Img src={CopyRef} cursor={"pointer"} onClick={handleCopy} />
            </InputRightElement>
          </InputGroup>
          <Button w={"100%"}>
            <Text>Invite</Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
