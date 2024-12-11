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
import bachiEclise from "../../../assets/bachi-eclise.png";
import tonEclise from "../../../assets/ton-eclise.png";
import symbols from "../../../assets/material-symbols_link.png";
import { useAppContext } from "../../../contexts";
import {
  useTonConnectModal,
  useIsConnectionRestored,
} from "@tonconnect/ui-react";

const WalletModal = ({ onClose, isOpen }) => {
  const { state: modalState, open: openModal, close } = useTonConnectModal();
  const connectionRestored = useIsConnectionRestored();
  const { modalVisibility, setModalVisibility } = useAppContext();
  return (
    <Modal
      isOpen={modalVisibility === 2}
      onClose={() => setModalVisibility(false)}
      isCentered
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
            <Flex align={"center"} justifyContent={"space-around"}>
              <Image
                src={bachiEclise}
                w={"88px"}
                verticalAlign={"middle"}
                alt=""
              ></Image>
              <Image
                src={symbols}
                h={"32px"}
                w={"32px"}
                verticalAlign={"middle"}
                alt=""
              ></Image>
              <Image
                src={tonEclise}
                w={"88px"}
                verticalAlign={"middle"}
                alt=""
              ></Image>
            </Flex>
            <Text
              fontSize={"14px"}
              color={"var(--White)"}
              fontWeight={"600"}
              mt={"16px"}
            >
              Connect Your wallet
            </Text>
            <Text fontSize={"14px"} color={"var(--White)"} fontWeight={"600"}>
              with{" "}
              <span
                style={{
                  color: "var(--blue)",
                }}
              >
                TonKeeper
              </span>
            </Text>

            <Button
              variant={"primary"}
              mt={"32px"}
              minW={"200px"}
              padding={"10px 17px"}
              onClick={() => {
                if (modalState.status == "closed" && connectionRestored) {
                  setModalVisibility(false);
                  openModal();
                }
              }}
            >
              <Text fontSize={"14px"} fontWeight={"600"}>
                Connect Wallet
              </Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
