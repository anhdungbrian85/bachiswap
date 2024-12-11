import {
  Box,
  Button,
  Flex,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import BachiBox from "../../components/bachiBox";
import CopyRef from "../../assets/icons/referral-copy.svg";
import { formatTableValue } from "./formatTable";
import ReferralAdd from "../../components/popup/referralAdd";
import toast from "react-hot-toast";

export default function Referral() {
  const inputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const historyTableData = {
    headers: [
      {
        label: "Time",
        key: "time",
      },
      {
        label: "Type",
        key: "type",
      },
      {
        label: "Amount",
        key: "amount",
      },
    ],
    data: [],
  };
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
    <Flex flexDirection={"column"} gap={"64px"}>
      <BachiBox p={"12px 15px"}>
        <Box p={"16px"} borderRadius={"4px"} bg="var(--Primary-100)">
          <Text
            textAlign={"center"}
            fontSize={"12px"}
            fontWeight={400}
            lineHeight={"normal"}
            color="var(--Black)"
          >
            Invite friends and receive{" "}
            <Text as="span" fontWeight={600}>
              100 TOS
            </Text>{" "}
            bonus for every account you invited. You can also receive{" "}
            <Text as="span" fontWeight={600}>
              10%
            </Text>{" "}
            cashback in TOS each time your friends rent a machine.
          </Text>
        </Box>
        <Flex gap={"12px"} mt={"24px"} flexDirection={"column"}>
          <Text
            w={"100%"}
            fontSize={"16px"}
            fontWeight={600}
            lineHeight={"normal"}
            color="var(--White)"
            textAlign={"center"}
          >
            Your Invites Link
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
          <Button onClick={() => onOpen()}>
            <Text>Invite</Text>
          </Button>
        </Flex>
      </BachiBox>
      <Flex flexDirection={"column"} gap={"12px"} mb={"261px"}>
        <Text
          textAlign={"center"}
          w={"100%"}
          fontSize={"16px"}
          fontWeight={600}
          lineHeight={"normal"}
          color="var(--White)"
        >
          Your Invites (0)
        </Text>
        <BachiBox
          flexDirection={"column"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <TableContainer width={"100%"} pb={"16px"}>
            <Table w={"100%"} variant="unstyled">
              <Thead
                w={"100%"}
                h={"41px"}
                color="white"
                fontWeight="400"
                backgroundColor="var(--fill-avatar)"
              >
                <Tr h={{ base: "41px" }}>
                  {historyTableData.headers.map((e, index) => {
                    return (
                      <Td
                        p={"12px 16px 8px 15px"}
                        key={index}
                        border={"none"}
                        color="var(--White)"
                        fontSize={{ base: "16px" }}
                        w={"20%"}
                        fontWeight={600}
                        lineHeight={"normal"}
                        borderBottom={"1px solid var(--Primary-500)"}
                      >
                        <Box textAlign={"center"}>{e.label}</Box>
                      </Td>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody w={"100%"} h={"100%"}>
                {historyTableData.data?.length > 0 ? (
                  historyTableData.data?.map((e, rowIndex) => {
                    const items = { ...e };
                    delete items.detail;
                    delete items.edit;
                    const keyValues = Object.keys(items);
                    return (
                      <Tr
                        w={"100%"}
                        key={rowIndex}
                        h={"72px"}
                        backgroundColor={
                          rowIndex % 2 === 0
                            ? "#transparent"
                            : "var(--fill-avatar)"
                        }
                      >
                        {keyValues.map((keyvalue, index) => {
                          let width;
                          let whiteSpace;
                          if (keyvalue === "fullName") {
                            width = "116px";
                            whiteSpace = "normal";
                          } else if (keyvalue === "code") {
                            width = "126px";
                          } else {
                            width = "auto";
                            whiteSpace = "inherit";
                          }
                          const isShow =
                            keyvalue === "avatar" ||
                            keyvalue === "code" ||
                            keyvalue === "fullName";
                          return (
                            <Td p={"16px 16px 8px 16px"} w={"20%"} key={index}>
                              <Box
                                fontSize={{ base: "14px" }}
                                lineHeight={"19.6px"}
                                fontWeight={500}
                                color={"#293755"}
                                w={width}
                                whiteSpace={whiteSpace}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                display="-webkit-box"
                                sx={{
                                  WebkitLineClamp: "2",
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {formatTableValue(items[keyvalue], keyvalue)}
                              </Box>
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td
                      colSpan={historyTableData.headers.length}
                      textAlign="center"
                      padding={"70px 0"}
                      fontSize={"16px"}
                      fontWeight={400}
                      lineHeight={"normal"}
                      color="var(--Primary-100)"
                    >
                      No invites
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </BachiBox>
      </Flex>
      <ReferralAdd isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
