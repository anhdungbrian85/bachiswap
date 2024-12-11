import React, { useEffect } from "react";
import { Account } from "./accounts";
import { WalletOptions } from "./walletOption";
import { useAccount } from "wagmi";
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useModal } from "../../contexts/useModal";
import CloseButton from "../button/CloseButton";
import { IoCloseSharp } from "react-icons/io5";
import EllipseIcon from "../../assets/img/node/ellipse-2.png";
import appLogo from "../../assets/img/app-logo.png";
import { getUserIpAddress } from "../../utils";
import { clientAPI } from "../../api/client";

function ConnectWallet() {
  const { address } = useAccount();
  const account = useAccount();
  const { isConnected } = useAccount();
  const addWalletHistory = async (address) => {
    /***Get IP user ***/
    const ipAddress = await getUserIpAddress();
    await clientAPI("post", "/api/connectWalletHistory/addWalletHistory", {
      wallet_address: address,
      ipAddress: ipAddress,
    });
  };

  if (isConnected && address) {
    addWalletHistory(address);
    return <Account />;
  }
  return <WalletOptions />;
}

export default function ConnectWalletModal() {
  const { connectWalletModalVisible, setConnectWalletModalVisible } =
    useModal();
  const onCloseWalletModal = () => setConnectWalletModalVisible(false);
  const { address } = useAccount();

  return (
    <>
      <Modal
        isOpen={connectWalletModalVisible}
        onClose={onCloseWalletModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width={{ base: "90%", md: "100%" }}
          borderRadius={"0px"}
          backgroundColor={"var(--color-background-popup)"}
          pt={{ base: "16px", lg: "23.27px", "3xl": "24px" }}
          pb={{ base: "22px", lg: "46px", "3xl": "60px  " }}
          border={"1px solid #FCDDEC"}
          sx={{
            clipPath:
              "polygon(0 36px, 36px 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)",
            "::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "36px",
              height: "36px",
              backgroundColor: "#FCDDEC",
              clipPath: "polygon(0 100%, 100% 0, 0 0)",
            },
            "::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "36px",
              height: "36px",
              backgroundColor: "#FCDDEC",
              clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
            },
          }}
        >
          <ModalBody py={"0px"} fontFamily={"var(--font-heading-main)"}>
            <Flex w={"100%"} justifyContent={"end"}>
              <CloseButton onClick={onCloseWalletModal}>
                <IoCloseSharp color="black" />
              </CloseButton>
            </Flex>
            {address && (
              <Box w={"100%"} h={"100px"} mx={"auto"} position={"relative"}>
                <Box
                  position={"absolute"}
                  top={{ base: "0px", lg: "-2px" }}
                  left={"50%"}
                  transform={"translateX(-50%)"}
                >
                  <Image
                    width={{ base: "130px", lg: "150px", "3xl": "200px" }}
                    src={appLogo}
                    alt=""
                  />
                </Box>
              </Box>
            )}
            <ConnectWallet />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
