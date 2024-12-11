import React from "react";
import BachiDrawer from "../../../components/drawers";
import { Box, Flex, Text } from "@chakra-ui/react";
import BachiBox from "../../../components/bachiBox";

export default function BachiBalanceAbouts({ onClose, isOpen }) {
  return (
    <BachiDrawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
      <BachiBox padding="20px">
        <Flex color={"var(--White)"} direction={"column"} gap={"16px"}>
          <Text fontSize={"20px"} fontWeight={"600"} textAlign={"center"}>
            BACHI
          </Text>
          <Text fontSize={"16px"} fontWeight={"400"}>
            Bachi serve as points that allow users to receive airdrop tokens in
            the future, with 50% of the Bachi Airdrop allocated.
          </Text>
          <Text fontSize={"16px"} fontWeight={"400"}>
            Additionally, Bachi act as a basis for receiving various incentives
            and rewards from the project.
          </Text>
          <Text fontSize={"16px"} fontWeight={"400"}>
            You can earn more Bachi by inviting friends or by renting at least
            one miner to activate the Bachi Mining feature.
          </Text>
          <Text fontSize={"16px"} fontWeight={"400"}>
            The hashrate in GH/s of Bachi Mining, once activated, will
            correspond to your current hashrate in Bachi Mining.
          </Text>
        </Flex>
      </BachiBox>
    </BachiDrawer>
  );
}
