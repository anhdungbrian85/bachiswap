import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import iconReferral from "../../assets/img/node/icon-referral-node.png";
import { useEffect, useState } from "react";
import { config } from "../wallets/config";
import { getBalance, getChainId, getChains, switchChain } from "@wagmi/core";
const CustomSelect = ({ network, currentChain }) => {
  const [selectedChain, setSelectedChain] = useState(currentChain);

  useEffect(() => {
    setSelectedChain(currentChain);
  }, [currentChain]);

  const handleSwitchChange = async (chainId) => {
    await switchChain(config, { chainId: Number(chainId) });
    setSelectedChain(network.find((chain) => chain.id === Number(chainId)));
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon color="white" />}
        width={"100%"}
        backgroundColor={"#231A2E"}
        _hover={{ backgroundColor: "var(--color-background-popup)" }}
        border="1px solid #FCDDEC"
      >
        <Flex alignItems="center">
          <Image src={iconReferral} boxSize="20px" mr="10px" />
          <Box color={"#FFF"}>
            {selectedChain ? selectedChain.name : "Chọn mạng"}
          </Box>
        </Flex>

        <MenuList _hover={{ backgroundColor: "var(--color-background-popup)" }}>
          {network.map((chain) => (
            <MenuItem
              value={chain?.id}
              width={"100%"}
              _hover={{ backgroundColor: "var(--color-background-popup)" }}
              onClick={() => handleSwitchChange(chain.id)}
            >
              <Flex alignItems="center" width={"400px"}>
                <Image src={iconReferral} boxSize="20px" mr="10px" />
                <Box>{chain?.name}</Box>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </MenuButton>
    </Menu>
  );
};

export default CustomSelect;
