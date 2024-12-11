import React from "react";
import BachiDrawer from "../drawers";
import BachiBox from "../bachiBox";
import {
  Button,
  Flex,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Amount from "../../assets/icons/amount.svg";
export default function TaikoWithDraw({ onClose, isOpen }) {
  return (
    <BachiDrawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
      <BachiBox padding="20px">
        <Flex flexDirection={"column"}>
          <Text
            fontSize={"20px"}
            fontWeight={600}
            lineHeight={"normal"}
            textAlign={"center"}
            color="var(--White)"
            gap={"8px"}
          >
            Withdraw Taiko
          </Text>
          <Flex
            mt={"24px"}
            flexDirection={"column"}
            gap={"8px"}
            alignItems={"center"}
            bg="var(--Primary-100)"
            borderRadius={"12px"}
            p={"12px 26px 12px 26px"}
          >
            <Text
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"normal"}
              textAlign={"center"}
              color="var(--Black)"
            >
              Enter your personal TAIKO address
            </Text>
            <Text
              fontSize={"14px"}
              fontWeight={400}
              lineHeight={"normal"}
              textAlign={"center"}
              color="var(--Black)"
            >
              This amount will be sent to your TAIKO wallet
            </Text>
          </Flex>
          <Flex mt={"32px"} flexDirection={"column"} gap={"8px"}>
            <Input variant={"white"} />
            <InputGroup>
              <Input variant={"white"} placeholder="Amount" />
              <InputRightElement cursor={"pointer"}>
                <Text
                  fontSize={"12px"}
                  fontWeight={600}
                  lineHeight={"normal"}
                  color="var(--Primary-500)"
                >
                  Max
                </Text>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <Flex
            flexDirection={"column"}
            mt={"32px"}
            alignItems={"center"}
            gap={"9px"}
          >
            <Flex alignItems={"center"} gap={"4px"}>
              <Text
                fontSize={"12px"}
                fontWeight={400}
                lineHeight={"normal"}
                color="var(--Grey-400)"
              >
                Minimum amount:
              </Text>
              <Flex alignItems={"center"} gap={"4px"}>
                <Img src={Amount} />
                <Text
                  fontSize={"12px"}
                  fontWeight={400}
                  lineHeight={"normal"}
                  color="var(--Grey-400)"
                >
                  0.4 TON
                </Text>
              </Flex>
            </Flex>
            <Text
              fontSize={"14px"}
              fontWeight={400}
              lineHeight={"normal"}
              color="var(--White)"
            >
              Network fee: 0.01 TON
            </Text>
          </Flex>
          <Flex alignItems={"center"} gap={"8px"} mt={"24px"}>
            <Button variant="pinktransparent" w={"50%"} onClick={onClose}>
              <Text
                fontSize={"16px"}
                fontWeight={600}
                lineHeight={"normal"}
                textAlign={"center"}
                color="var(--White)"
              >
                Cancel
              </Text>
            </Button>
            <Button w={"50%"}>
              <Text
                fontSize={"16px"}
                fontWeight={600}
                lineHeight={"normal"}
                textAlign={"center"}
                color="var(--White)"
              >
                Sent
              </Text>
            </Button>
          </Flex>
        </Flex>
      </BachiBox>
    </BachiDrawer>
  );
}
