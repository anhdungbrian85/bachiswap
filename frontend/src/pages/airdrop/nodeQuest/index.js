import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import SectionContainer from "../../../components/container";
import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Text,
  TableContainer,
  Table,
  Thead,
  HStack,
  Td,
  Tr,
  Tbody,
  Image,
} from "@chakra-ui/react";
import CommonButton from "../../../components/button/commonbutton";
import MainButton from "../../../components/button/MainButton";
import QuestBox from "../../../components/questbox";
import { clientAPI } from "../../../api/client";
import { useAccount, useClient } from "wagmi";
import quest_manager_contract from "../../../utils/contracts/quest_manager_contract";
import {
  getBalance,
  writeContract,
  waitForTransactionReceipt,
  getChainId,
  getChains,
  readContract,
  getGasPrice,
  getTransaction,
  getTransactionReceipt,
} from "@wagmi/core";
import { config } from "../../../components/wallets/config";
import { taikoHeklaClient } from "../../../components/wallets/viemConfig";
import { getUserIpAddress } from "../../../utils";
import toast from "react-hot-toast";
import MessageBox from "../../../components/message/messageBox";
import { FAIURE, PENDING } from "../../../utils/mesages";
import useScreenWidth from "../../../hooks/useScreenWidth";
import {
  useQuestHistory,
  useQuestHistoryInfinity,
} from "../../../hooks/useQuestHistory";
import { formatTableValue } from "./formatTable";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import useInterval from "../../../hooks/useInterval";
import { AddressCopier } from "../../../components/addressCopier";
import ReactPaginate from "react-paginate";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import node_manager_contract from "../../../utils/contracts/node_manager_contract";
import iconNodedetail from "../../../assets/img/node/icon-node-detail.png";

import { useTranslation } from "react-i18next";

const NodeQuest = () => {
  const { t } = useTranslation("airdrop");
  const { address } = useAccount();
  const quests = [
    // {
    //   task_id: 1,
    //   title: "Claim your Referral Link",
    //   rewardText: "Reward",
    //   rewardTotal: 0.1,
    //   buttonText: "Claim",
    //   onClick: () => console.log("Invite Friend Quest Clicked"),
    //   handleTask: () => toast.error("You are not qualified!"),
    //   inputPlaceholder: "Input",
    // },
    {
      title: t("PURCHASE YOUR FIRST BOOSTER"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("FOLLOW @TAIKOXYZ ON X"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Twitter Connect Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("SAY HELLO TO THE DISCORD SERVER!"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("REACHED LEVEL 10 ON DISCORD SERVER"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("REACHED LEVEL 20 ON DISCORD SERVER"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("REACHED LEVEL 50 ON DISCORD SERVER"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("PURCHASED 3 BOOSTERS"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
    {
      title: t("PURCHASED 5 BOOSTERS"),
      rewardText: t("Reward"),
      rewardTotal: "0.005",
      buttonText: t("Claim Quest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => toast.error("You are not qualified!"),
      inputPlaceholder: null,
    },
  ];
  const isMobile = useScreenWidth(768);
  const isTablet = useScreenWidth(1024);
  const [currentPage, setCurrentPage] = useState(1);
  const questsPerPage = 3;

  const indexOfLastQuest = currentPage * questsPerPage;
  const indexOfFirstQuest = indexOfLastQuest - questsPerPage;
  const currentQuests = quests.slice(indexOfFirstQuest, indexOfLastQuest);
  const totalPages = Math.ceil(quests.length / questsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const {
    questHistoryData,
    totalPages: questHistoryTotalPages,
    isLoading: isLoadingTransactionHistoryData,
    refetch: refetchTransactionHistoryData,
    isRefetching: isRefetchingTransactionHistoryData,
    prevPage: handlePrev,
    nextPage: handleNext,
    setCurrentPage: questHistorySetCurrentPage,
    currentPage: questHistoryCurrentPage,
  } = useQuestHistory(address);

  const {
    questHistoryDataInfinity,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useQuestHistoryInfinity(address);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
    refetchTransactionHistoryData();
  };

  const { ref, inView } = useInView();

  useInterval(() => {
    refetch();
    refetchTransactionHistoryData();
  }, 3000);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const historyTableData = {
    headers: [
      {
        label: "#",
        key: "num",
      },
      {
        label: t("Wallet"),
        key: "wallet_address",
      },
      {
        label: "XP",
        key: "point",
      },
      {
        label: t("Date"),
        key: "date",
      },
    ],
    headersMobile: [
      {
        label: t("Wallet"),
        key: "wallet_address",
      },
      {
        label: "XP",
        key: "point",
      },
      {
        label: t("Date"),
        key: "date",
      },
    ],
    data: isMobile ? questHistoryData : questHistoryDataInfinity,
  };
  const [referralCode, setReferralCode] = useState(null);
  const nodeManagerContract = {
    address: node_manager_contract.CONTRACT_ADDRESS,
    abi: node_manager_contract.CONTRACT_ABI,
  };
  useEffect(() => {
    if (address) {
      getReferral();
    }
  }, [address]);
  /***Get Referral*****/
  const getUserReferral = async () => {
    const refId = await readContract(config, {
      ...nodeManagerContract,
      functionName: "userReferralIdLinks",
      args: [address],
    });
    const referrals = await readContract(config, {
      ...nodeManagerContract,
      functionName: "referrals",
      args: [refId],
    });
    return referrals[0];
  };
  const getReferral = async () => {
    const code = await getUserReferral(address);
    setReferralCode(code);
  };

  return (
    <SectionContainer py={{ base: "24px", lg: "50px", "3xl": "64px" }}>
      <SimpleGrid
        spacing={{ base: "17px" }}
        columns={{ base: 1, lg: 2, xl: 3 }}
      >
        {isMobile
          ? currentQuests.map((quest, index) => (
              <Box
                key={index}
                gridColumn={
                  quest.inputPlaceholder
                    ? { lg: "span 2", xl: "span 1" }
                    : "auto"
                }
              >
                <QuestBox
                  title={quest.title}
                  rewardText={quest.rewardText}
                  rewardTotal={quest.rewardTotal}
                  buttonText={quest.buttonText}
                  onClick={quest.onClick}
                  inputPlaceholder={quest.inputPlaceholder}
                  handleTask={quest.handleTask}
                />
              </Box>
            ))
          : quests.map((quest, index) => (
              <Box
                key={index}
                gridColumn={
                  quest.inputPlaceholder
                    ? { lg: "span 2", xl: "span 1" }
                    : "auto"
                }
              >
                <QuestBox
                  title={quest.title}
                  rewardText={quest.rewardText}
                  rewardTotal={quest.rewardTotal}
                  buttonText={quest.buttonText}
                  onClick={quest.onClick}
                  inputPlaceholder={quest.inputPlaceholder}
                  handleTask={quest.handleTask}
                />
              </Box>
            ))}
      </SimpleGrid>
      {isMobile && (
        <Flex justifyContent="center" mt="24px" alignItems="center" gap="8px">
          <Button
            color={"#FFF"}
            border={"0.5px solid #EB7FB3"}
            backgroundColor="var(--color-background)"
            width={"30px"}
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            borderRadius="50%"
          >
            <Box boxSize="20px" paddingTop={"2px"}>
              <AiOutlineLeft />
            </Box>
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              border={"0.5px solid #EB7FB3"}
              borderRadius={"50%"}
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              bg={
                currentPage === index + 1
                  ? "#EB7FB3"
                  : "var(--color-background)"
              }
              color={currentPage === index + 1 ? "black" : "white"}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            width={"30px"}
            color={"#FFF"}
            border={"0.5px solid #EB7FB3"}
            backgroundColor="var(--color-background)"
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            borderRadius="50%"
          >
            <Box boxSize="20px" paddingTop={"2px"}>
              <AiOutlineRight />
            </Box>
          </Button>
        </Flex>
      )}
      <Flex flexDirection={"column"} gap={{ base: "24px" }}>
        <Text
          fontSize={{ base: "24px", "2xl": "64px" }}
          fontWeight={400}
          fontFamily="var(--font-heading)"
          textAlign={"center"}
          paddingTop={{ base: "50px", "2xl": "135px" }}
        >
          {t("Airdrophistory")}
        </Text>

        {isMobile ? (
          <CommonButton
            border="0.5px solid var(--color-main)"
            width={"100%"}
            height={"100%"}
            backgroundColor="var(--color-background-footer)"
            fontFamily={"var(--font-text-main)"}
            fontSize={{ base: "12px" }}
          >
            {historyTableData.data?.length > 0 ? (
              historyTableData.data?.map((record) => {
                return (
                  <Box
                    padding={"32px"}
                    borderBottom={"0.5px solid var(--color-main)"}
                  >
                    <Flex direction={"column"} w={"100%"} gap={"8px"}>
                      {historyTableData.headersMobile.map((item) => {
                        return (
                          <SimpleGrid columns={2} w={"100%"}>
                            <Box>
                              <Text>{item.label}</Text>
                            </Box>
                            <Box>
                              {item.key === "wallet_address" ? (
                                <AddressCopier
                                  address={record.caller}
                                  digits={5}
                                />
                              ) : (
                                <Text>{record[item.key]}</Text>
                              )}
                            </Box>
                          </SimpleGrid>
                        );
                      })}
                    </Flex>
                  </Box>
                );
              })
            ) : (
              <Box
                padding={"32px"}
                borderBottom={"0.5px solid var(--color-main)"}
                fontFamily={"var(--font-heading-main)"}
              >
                <CommonButton
                  backgroundColor={"rgba(27, 27, 27, 0.20)"}
                  boxShadow={"inset 0 0 10px var(--color-main)"}
                  border="0.5px solid var(--color-main)"
                  display="flex"
                  flexDirection="column"
                  flex="1"
                  position="relative"
                  zIndex="10"
                  height={{ base: "250px" }}
                  width="100%"
                  padding="40px"
                >
                  <Text
                    py={{ base: "15px" }}
                    fontSize={{
                      base: "16px",
                      md: "32px",
                    }}
                    fontFamily="var(--font-text-extra)"
                  >
                    {t("descriptionAirdrop")}
                  </Text>
                  <Box mt={"12px"} fontSize={{ base: "16px" }}>
                    {!referralCode ? (
                      <Text>{"---"}</Text>
                    ) : (
                      <ReferralCopier referralCode={referralCode} />
                    )}
                  </Box>
                </CommonButton>
              </Box>
            )}
            <Box
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
              py={"24px"}
            >
              <ReactPaginate
                pageCount={questHistoryTotalPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                breakClassName={"ellipsis"}
                breakLabel={"..."}
                previousLabel={<MdOutlineArrowBackIosNew />}
                nextLabel={<MdOutlineArrowForwardIos />}
                renderOnZeroPageCount={null}
                initialPage={currentPage - 1}
              />
            </Box>
          </CommonButton>
        ) : (
          <CommonButton
            border="0.5px solid var(--color-main)"
            width={"100%"}
            height={"100%"}
            backgroundColor={
              !isTablet
                ? "var(--color-background-popup)"
                : "var(--color-background-footer)"
            }
            padding={"32px 24px"}
          >
            <TableContainer w={"100%"}>
              <Table w={"100%"} variant="unstyled" className="history-table">
                <Thead
                  w={"100%"}
                  h={"80px"}
                  color="white"
                  fontWeight="400"
                  borderRadius="3px"
                  backgroundColor="var(--color-main)"
                  sx={{
                    backdropFilter: "blur(10px) !important",
                    clipPath:
                      "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                    "::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "20px",
                      height: "20px",
                      backgroundColor: "pink.500",
                      clipPath: "polygon(0 100%, 100% 0, 0 0)",
                    },
                    "::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "20px",
                      height: "20px",
                      backgroundColor: "pink.500",
                      clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
                    },
                    "@media (max-width: 992px)": {
                      clipPath:
                        "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                      "::before": {
                        width: "20px",
                        height: "20px",
                        backgroundColor: "pink.500",
                      },
                      "::after": {
                        width: "20px",
                        height: "20px",
                        backgroundColor: "pink.500",
                      },
                    },
                  }}
                >
                  <Tr className="transaction-history-table-header-container">
                    {historyTableData.headers.map((e, index) => {
                      let width = "auto";
                      if (e.key === "caller") {
                        width = "40%";
                      } else {
                        width = "20%";
                      }
                      return (
                        <Td
                          className="transaction-table-header-column"
                          border={"none"}
                          color={"white"}
                          fontFamily={"var(--font-text-main)"}
                          fontSize={{ base: "16px", xl: "20px" }}
                          w={width}
                        >
                          <Box ml={"24px"}>{e.label}</Box>
                        </Td>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody w={"100%"}>
                  {historyTableData.data?.length > 0 ? (
                    historyTableData.data?.map((e, rowIndex) => {
                      const keyValues = Object.keys(e);
                      return (
                        <Tr>
                          {keyValues.map((keyvalue, index) => {
                            let width = "auto";
                            if (e.key === "caller") {
                              width = "40%";
                            } else {
                              width = "20%";
                            }
                            return (
                              <Td w={width}>
                                <Box
                                  mt={"24px"}
                                  ml={"24px"}
                                  fontFamily={"var(--font-text-main)"}
                                  fontSize={{ base: "16px", xl: "20px" }}
                                >
                                  {formatTableValue(e[keyvalue], keyvalue)}
                                </Box>
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr w={"100%"} fontFamily={"var(--font-heading-main)"}>
                      <Td colSpan={4} w={"100%"} padding={"40px 0px 0px 0px"}>
                        <CommonButton
                          backgroundColor={"rgba(27, 27, 27, 0.20)"}
                          boxShadow={"inset 0 0 10px var(--color-main)"}
                          border="0.5px solid var(--color-main)"
                          display="flex"
                          flexDirection="column"
                          flex="1"
                          position="relative"
                          zIndex="10"
                          height="250px"
                          width="100%"
                          padding="40px"
                        >
                          <Text
                            py={{ base: "15px" }}
                            fontSize={{
                              base: "20px",
                              "2xl": "32px",
                            }}
                            fontFamily="var(--font-text-extra)"
                          >
                            {t("descriptionAirdrop")}
                          </Text>
                          <Box mt={"12px"}>
                            {!referralCode ? (
                              <Text>{"---"}</Text>
                            ) : (
                              <ReferralCopier referralCode={referralCode} />
                            )}
                          </Box>
                        </CommonButton>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
              {historyTableData.data?.length ? (
                <HStack
                  pt="32px"
                  pb="20px"
                  justifyContent="center"
                  w="full"
                  fontFamily={"var(--font-heading-main)"}
                >
                  <Text ref={ref} fontFamily={"var(--font-text-main)"}>
                    {isFetchingNextPage ? (
                      <BeatLoader color="#7ae7ff" size="10px" />
                    ) : hasNextPage ? (
                      ""
                    ) : (
                      t("Nothingmoretoload")
                    )}
                  </Text>
                </HStack>
              ) : (
                ""
              )}
            </TableContainer>
          </CommonButton>
        )}
      </Flex>
    </SectionContainer>
  );
};

const ReferralCopier = ({ referralCode }) => {
  const handleCopy = (label, text) => {
    toast.success(`${label} copied!`);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Flex
        onClick={() => handleCopy("referral", referralCode)}
        alignItems="center"
        maxWidth={{
          base: "290px",
          md: "450px",
          xl: "250px",
          "2xl": "340px",
          "3xl": "400px",
        }}
        overflow="hidden"
      >
        <Text
          fontSize={{ base: "14px", md: "20px" }}
          fontWeight={300}
          isTruncated
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {`http://bachi.swap.io/Bachi-Taiko-Swap?referral-code=${referralCode}`}
        </Text>
        <Image
          src={iconNodedetail}
          height={{ base: "20px", md: "25px" }}
          marginLeft="8px"
        />
      </Flex>
    </>
  );
};

export default NodeQuest;
