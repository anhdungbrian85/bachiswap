import {
  Box,
  Button,
  Flex,
  Img,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import BachiBox from "../../components/bachiBox";
import CopyRef from "../../assets/icons/wallet-copy.svg";
import { formatTableValue } from "./formatTable";
import { TonIcon } from "../../theme/components/icon";
import BachiIconImg from "../../assets/icons/bachi-logo.png";
import TaikoIconImg from "../../assets/icons/taiko-logo.png";

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { addressShortener } from "../../utils";
import TonWithDraw from "../../components/tonWithdraw";
import { useAppContext } from "../../contexts";
import TaikoWithDraw from "../../components/taikoWithdraw";
import BachiBalanceAbouts from "../home/drawers/bachiBalanceAbouts";
import toast from "react-hot-toast";
import Message from "../../components/popup/message";
export default function Wallet() {
  const rawAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const {
    drawerBachiBalanceVisibility,
    setDrawerBachiBalanceVisibility,
    drawerTonBalanceVisibility,
    setDrawerTonBalanceVisibility,
    drawerTaikoBalanceVisibility,
    setDrawerTaikoBalanceVisibility,
    messageVisibility,
    setMessageVisibility,
  } = useAppContext();
  const Balance = [
    {
      icon: <TonIcon width="24px" height="24px" />,
      title: "Ton Balance",
      total: "100",
      button: {
        text: "Withdraw",
        onClick: () => setDrawerTonBalanceVisibility(true),
      },
    },
    {
      icon: <Img src={BachiIconImg} />,
      title: "Bachi Balance",
      total: "100",
      button: "What is Bachi?",
      button: {
        text: "What is Bachi?",
        onClick: () => setDrawerBachiBalanceVisibility(true),
      },
    },
    {
      icon: <Img src={TaikoIconImg} />,
      title: "TAIKO Balance",
      total: "100",
      button: "Withdraw",
      button: {
        text: "Withdraw",
        onClick: () => setDrawerTaikoBalanceVisibility(true),
      },
    },
  ];
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
      {
        label: "",
        key: "checkbox",
      },
    ],
    data: [
      {
        time: "11/09/2023",
        type: "Bonus",
        amount: "500",
        checkbox: "",
      },
      {
        time: "11/09/2023",
        type: "Bonus",
        amount: "500",
        checkbox: "",
      },
      {
        time: "11/09/2023",
        type: "Bonus",
        amount: "500",
        checkbox: "",
      },
      {
        time: "11/09/2023",
        type: "Bonus",
        amount: "500",
        checkbox: "",
      },
      {
        time: "11/09/2023",
        type: "Bonus",
        amount: "500",
        checkbox: "",
      },
    ],
  };
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(historyTableData.data.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const currentItems = historyTableData.data.slice(start, start + itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
  };
  //Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(rawAddress);
    toast.success("Copy address successfully");
  };
  return (
    <>
      <Flex flexDirection={"column"}>
        <Flex flexDirection={"column"} gap={"12px"}>
          {Balance.map((item, index) => (
            <BachiBox p={"8px 16px"} w={"100%"} key={index}>
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"} gap={{ base: "8px" }}>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    w={"38px"}
                    h={"38px"}
                    borderRadius={"50%"}
                    border={"0.5px solid var(--Primary-500)"}
                  >
                    {item.icon}
                  </Flex>
                  <Flex flexDirection={"column"} gap={{ base: "2px" }}>
                    <Text
                      fontSize={"14px"}
                      fontWeight={400}
                      color="var(--White)"
                      lineHeight={"normal"}
                    >
                      {item.title}
                    </Text>
                    <Flex alignItems={"center"} gap={"4px"}>
                      <Text
                        fontSize={"14px"}
                        fontWeight={600}
                        lineHeight={"normal"}
                        color="var(--Primary-500)"
                      >
                        {item.total}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Button
                  variant={"pink"}
                  w={"126px"}
                  h={"38px"}
                  p={"10px 16px"}
                  onClick={item.button.onClick}
                >
                  <Text
                    fontSize={"16px"}
                    fontWeight={500}
                    lineHeight={"normal"}
                  >
                    {item.button.text}
                  </Text>
                </Button>
              </Flex>
            </BachiBox>
          ))}
        </Flex>
        {rawAddress ? (
          <Button
            display={"flex"}
            gap={"8px"}
            alignItems={"center"}
            mt={"24px"}
          >
            <Text
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"24px"}
              color="var(--White)"
            >
              {addressShortener(rawAddress)}
            </Text>
            <Img src={CopyRef} onClick={() => handleCopy()} />
          </Button>
        ) : (
          <Button
            display={"flex"}
            gap={"8px"}
            alignItems={"center"}
            mt={"24px"}
          >
            <Text
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"24px"}
              color="var(--White)"
            >
              Connect Wallet
            </Text>
          </Button>
        )}

        {rawAddress && (
          <Button
            display={"flex"}
            gap={"8px"}
            alignItems={"center"}
            mt={"24px"}
            onClick={() => {
              tonConnectUI.disconnect();
            }}
          >
            <Text
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"24px"}
              color="var(--White)"
            >
              Disconnect
            </Text>
          </Button>
        )}
        <Flex mt={"24px"} flexDirection={"column"} gap={"12px"}>
          <Text
            fontSize={"16px"}
            fontWeight={600}
            textAlign={"center"}
            lineHeight={"normal"}
            color="var(--White)"
          >
            Transaction history
          </Text>
          <BachiBox
            flexDirection={"column"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <TableContainer width={"100%"} mb={"19px"}>
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
                      let width;
                      let textAlign;
                      if (e.key === "time") {
                        width = "30%";
                        textAlign = "start";
                      } else if (e.key === "type") {
                        width = "30%";
                        textAlign = "center";
                      } else if (e.key === "amount") {
                        width = "30%";
                        textAlign = "center";
                      } else if (e.key === "checkbox") {
                        width = "10%";
                      }
                      return (
                        <Td
                          p={"12px 16px 8px 16px"}
                          key={index}
                          border={"none"}
                          color="var(--White)"
                          fontSize={{ base: "16px" }}
                          w={width}
                          fontWeight={600}
                          lineHeight={"normal"}
                          borderBottom={"1px solid var(--Primary-500)"}
                        >
                          <Text textAlign={textAlign}>{e.label}</Text>
                        </Td>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody w={"100%"} h={"100%"}>
                  {currentItems?.length > 0 ? (
                    currentItems?.map((e, rowIndex) => {
                      const items = { ...e };
                      const keyValues = Object.keys(items);
                      return (
                        <Tr w={"100%"} key={rowIndex} h={"38px"}>
                          {keyValues.map((keyvalue, index) => {
                            let textAlign;
                            let whiteSpace;
                            if (keyvalue === "time") {
                              textAlign = "start";
                            } else if (keyvalue === "type") {
                              textAlign = "center";
                            } else if (keyvalue === "amount") {
                              textAlign = "center";
                            } else if (keyvalue === "checkbox") {
                              textAlign = "end";
                            }
                            return (
                              <Td key={index} p={"14px 16px 0px 16px"}>
                                <Box
                                  textAlign={textAlign}
                                  fontSize={{ base: "14px" }}
                                  lineHeight={"normal"}
                                  fontWeight={400}
                                  color="var(--Primary-200)"
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
            <Box
              borderTop={"1px solid var(--Primary-500)"}
              p={"13px 16px 14px 16px"}
            >
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text
                  w={"62px"}
                  color="var(--White)"
                  fontSize={"16px"}
                  fontWeight={400}
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 0}
                  lineHeight={"normal"}
                  cursor={"pointer"}
                >
                  Previous
                </Text>
                <Text
                  color="var(--White)"
                  fontWeight={400}
                  fontSize={"16px"}
                  lineHeight={"normal"}
                >
                  {currentPage + 1} / {pageCount}
                </Text>
                <Text
                  textAlign={"end"}
                  w={"62px"}
                  color="var(--White)"
                  fontSize={"16px"}
                  fontWeight={400}
                  onClick={goToNextPage}
                  isDisabled={currentPage === pageCount - 1}
                  lineHeight={"normal"}
                  cursor={"pointer"}
                >
                  Next
                </Text>
              </Flex>
            </Box>
          </BachiBox>
        </Flex>
        <BachiBox
          p={"8px 16px"}
          display="flex"
          mt={"24px"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={"113px"}
        >
          <Text
            fontSize={"14px"}
            fontWeight={500}
            lineHeight={"normal"}
            color="var(--White)"
          >
            Your TON balance is getting smaller
          </Text>
          <Button
            variant={"pink"}
            w={"82px"}
            h={"38px"}
            onClick={() => setMessageVisibility(true)}
          >
            Deposit
          </Button>
        </BachiBox>
      </Flex>
      <TonWithDraw
        isOpen={drawerTonBalanceVisibility}
        onClose={() => setDrawerTonBalanceVisibility(false)}
      />
      <BachiBalanceAbouts
        isOpen={drawerBachiBalanceVisibility}
        onClose={() => setDrawerBachiBalanceVisibility(false)}
      />
      <TaikoWithDraw
        isOpen={drawerTaikoBalanceVisibility}
        onClose={() => setDrawerTaikoBalanceVisibility(false)}
      />
      <Message
        isOpen={messageVisibility}
        onClose={() => setMessageVisibility(false)}
      />
    </>
  );
}
