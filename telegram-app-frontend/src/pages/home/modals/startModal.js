import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import BachiIconImg from "../../../assets/logoBachi.png";
import { useAppContext } from "../../../contexts";
import { APIClient } from "../../../api";
import { useMutation, useQuery } from "react-query";
import { useTonWallet } from "@tonconnect/ui-react";

const StartModal = ({ onClose, isOpen }) => {
  const { modalVisibility, setModalVisibility, isLoadingUser, isValidUser } =
    useAppContext();
  const rawAddress = useTonWallet();

  return (
    <Modal
      isOpen={modalVisibility === 1}
      onClose={() => setModalVisibility(false)}
      isCentered
      closeOnOverlayClick={isValidUser}
    >
      <ModalOverlay />
      <ModalContent borderRadius={"16px"} maxW={"80%"}>
        <ModalBody
          borderRadius={"16px"}
          border={"1px solid var(--Primary-500)"}
          bg={"var(--brown)"}
          padding={"24px"}
        >
          <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Image
              src={BachiIconImg}
              w={"24vh"}
              verticalAlign={"middle"}
              alt=""
            ></Image>
            <Text
              fontSize={"14px"}
              color={"var(--Primary-500)"}
              fontWeight={"600"}
            >
              Welcome to Bachi Mining!
            </Text>
            <Text fontSize={"14px"} color={"var(--White)"} fontWeight={"600"}>
              We’re thrilled to have you join us on this exciting journey 🚀
            </Text>

            <Button
              variant={"primary"}
              mt={"32px"}
              minW={"200px"}
              padding={"10px 17px"}
              isDisabled={!isValidUser}
              isLoading={isLoadingUser}
              onClick={() => {
                if (rawAddress) setModalVisibility(false);
                else setModalVisibility(2);
              }}
            >
              <Text fontSize={"14px"} fontWeight={"600"}>
                Start Now
              </Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StartModal;
