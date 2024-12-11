import { Box, Button, Flex, Image, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { getBalance, getChainId, getChains, switchChain } from "@wagmi/core";
import { config } from "./config";
import { formatBalacne, formatTokenBalance } from "../../utils";
import { AddressCopier } from "../addressCopier";
import ActionButton from "../button/ActionButton";
import IconEth from "../../assets/img/node/icon-eth.png";
import { IoArrowForwardSharp } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
// for example call contract
import bachi_node_contract from "../../utils/contracts/bachi_node_contract";
import { useReadContract, useWriteContract } from "wagmi";
import MainButton from "../button/MainButton";
import { base } from "viem/chains";
import useScreenWidth from "../../hooks/useScreenWidth";
import taiko_token_contract from "../../utils/contracts/taiko_token_contract";
import { useTab } from "../../contexts/useTab";
import { useTranslation } from "react-i18next";

export function Account() {
  const { t } = useTranslation("menu");
  const { admin, setAdmin } = useTab();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address,
  });
  const chains = getChains(config);
  const chainId = getChainId(config);
  const currentChain = chains.find((chain) => chain.id === chainId);
  console.log({ currentChain, chains });

  const handleSwitchChange = async (event) => {
    const { value } = event?.target;
    await switchChain(config, { chainId: Number(value) });
  };

  const taikoTokenContract = {
    address: taiko_token_contract.CONTRACT_ADDRESS,
    abi: taiko_token_contract.CONTRACT_ABI,
  };

  const { data: taikoBalance } = useBalance({
    address: address,
    token: taikoTokenContract.address,
  });

  console.log({ taikoBalance });

  const isMobile = useScreenWidth(476);
  return (
    <Flex
      width={"100%"}
      textAlign={"center"}
      flexDirection={"column"}
      gap={{ base: "16px", md: "20px" }}
      alignItems={"center"}
    >
      {ensAvatar && (
        <Image
          width={{ base: "40px" }}
          height={{ base: "40px" }}
          alt="ENS Avatar"
          src={ensAvatar}
        />
      )}
      {address && (
        <Box>
          <AddressCopier
            address={ensName ? `${ensName} (${address})` : address}
            fontSize={{ base: "24px", xl: "28px", "3xl": "40px" }}
            fontWeight={"600"}
          />
        </Box>
      )}
      {address && !isLoading && (
        <Text
          fontSize={{ base: "16px", lg: "24px" }}
          color={"var(--color-main)"}
        >{`${formatTokenBalance(taikoBalance?.formatted)} ${taikoBalance?.symbol}`}</Text>
      )}
      <MainButton
        my="12px"
        w={{ base: "230px", md: "300px" }}
        height={{ base: "40px", lg: "62px", "3xl": "64px" }}
        bgColor={"white"}
        onClick={() => {
          window.open(currentChain?.blockExplorers?.default?.url, "_blank");
        }}
        padding={{ base: "8px 16px" }}
      >
        <Flex
          w={{ base: "100%", md: "100%" }}
          justifyContent={"space-around"}
          alignItems={"center"}
          gap={{ base: "8px" }}
        >
          <Text
            color={"black"}
            fontSize={{ base: "16px", md: "24px" }}
            fontWeight={"500"}
          >
            {t("Block Explorer")}
          </Text>
          <Box sx={{ transform: "rotate(-45deg)" }}>
            <IoArrowForwardSharp
              color="black"
              size={isMobile ? "32px" : "32px"}
            />
          </Box>
        </Flex>
      </MainButton>
      <Select
        borderRadius={"0px"}
        size={"lg"}
        defaultValue={currentChain?.id}
        onChange={handleSwitchChange}
        _focus={{ border: "1px solid var(--color-border-bottom)" }}
      >
        {chains?.map((chain) => (
          <option
            style={{ color: "#000", textAlign: "center" }}
            value={chain?.id}
          >
            {chain?.name}
          </option>
        ))}
      </Select>
      {/* <CustomSelect network={chains} handleSwitchChange={handleSwitchChange} currentChain={currentChain}/> */}
      {/* <ActionButton
        w={"100%"}
        _hover={{ bg: "var(--color-main)" }}
        display={{ base: "none", md: "block" }}
      >
        <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"24px"} fontWeight={"500"}>
            Buy Crypto
          </Text>
          <Box w={"36px"}>
            <IoArrowForwardSharp fontSize={"36px"} color="black" />
          </Box>
        </Flex>
      </ActionButton> */}
      {/* <ActionButton
        w={"100%"}
        _hover={{ bg: "var(--color-main)" }}
        display={{ base: "none", md: "block" }}
      >
        <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"24px"} fontWeight={"500"}>
            Activity
          </Text>
          <Box w={"36px"}>
            <IoArrowForwardSharp fontSize={"36px"} color="black" />
          </Box>
        </Flex>
      </ActionButton> */}
      <MainButton
        height={{ base: "44px", lg: "62px", "3xl": "64px" }}
        backgroundColor="var(--color-main)"
        borderRadius={"8px"}
        padding={"16px 16px"}
        w={"100%"}
        onClick={() => {
          disconnect();
          setAdmin(false);
        }}
        _hover={{ bg: "var(--color-main)" }}
      >
        <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight={"500"}
            color={"#FFF"}
          >
            {t("Logout")}
          </Text>
          <Box w={"15px"}>
            <RxExit color="white" size={"20px"} />
          </Box>
        </Flex>
      </MainButton>
    </Flex>
  );
}
