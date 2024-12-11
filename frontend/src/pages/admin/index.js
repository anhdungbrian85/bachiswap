import {
  Box,
  Flex,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import CommonButton from "../../components/button/commonbutton";
import { AddressCopier } from "../../components/addressCopier";
import SectionContainer from "../../components/container";
import backgroundNode from "../../assets/img/node/background-node.png";
import { clientAPI } from "../../api/client";
import { useAccount, useBalance } from "wagmi";
import {
  getBalance,
  getGasPrice,
  getChainId,
  getChains,
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "@wagmi/core";
import { config } from "../../components/wallets/config";
import node_manager_contract from "../../utils/contracts/node_manager_contract";
import ReferralCodeForm from "../../components/referralform";
import MainButton from "../../components/button/MainButton";
import taiko_token_contract from "../../utils/contracts/taiko_token_contract";
import { formatTokenBalance, getUserIpAddress } from "../../utils";
import { taikoHeklaClient } from "../../components/wallets/viemConfig";
import { ERROR, FAIURE, PENDING, SUCCESS } from "../../utils/mesages";
import MessageBox from "../../components/message/messageBox";
import { parseUnits } from "viem";
import useScreenWidth from "../../hooks/useScreenWidth";
import {
  useUserWallet,
  useUserWalletInfinity,
} from "../../hooks/useUserWallet";
import ReactPaginate from "react-paginate";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { formatTableValue } from "./formatTable";

import { useInView } from "react-intersection-observer";
import useInterval from "../../hooks/useInterval";
import { BeatLoader, ClimbingBoxLoader } from "react-spinners";

import ChartUI from "../../components/chart";

const AdminPage = () => {
  const { address } = useAccount();
  const [freeFarmer, setfreeFarmer] = useState(0);
  const [totaluserbuynode, settotaluserbuynode] = useState(0);
  const [totalMonney, setTotalMonney] = useState(0);
  const [userWallet, setuserWallet] = useState(0);
  const [totalreferral, settotalreferral] = useState(0);
  const [balance, setBalance] = useState(0);

  /****** GetBalance *****/
  const nodeManagerContract = {
    address: node_manager_contract.CONTRACT_ADDRESS,
    abi: node_manager_contract.CONTRACT_ABI,
  };
  const taikoTokenContract = {
    address: taiko_token_contract.CONTRACT_ADDRESS,
    abi: taiko_token_contract.CONTRACT_ABI,
  };

  const { data: taikoBalance } = useBalance({
    address: nodeManagerContract.address,
    token: taikoTokenContract.address,
  });

  const [balanceContract, setBalanceContract] = useState(0);
  const getBalanceContract = async () => {
    const balance = await getBalance(config, {
      address: nodeManagerContract.address,
      token: taikoTokenContract.address,
    });
    setBalanceContract(Number(balance.formatted));
  };
  const getTotalNodeFree = async () => {
    try {
      const [FreeFarmer, userWallet, totaluserbuynode, data] =
        await Promise.all([
          clientAPI("post", "/api/freeFarmer/getAllFreeFarmer"),
          await clientAPI(
            "post",
            "/api/connectWalletHistory/getCountAllWallet"
          ),
          await clientAPI("post", "/api/transaction/getUserBuyNode"),
          await clientAPI("post", "/api/transaction/getTotalNodeBuy"),
        ]);

      setuserWallet(userWallet?.addressCount);
      setfreeFarmer(FreeFarmer?.data.length);
      settotaluserbuynode(totaluserbuynode?.total);
      let totalNode = 0;
      for (let i = 0; i < data?.data.length; i++) {
        totalNode += data?.data[i].quantity;
      }
      setTotalMonney(totalNode);

      const referrals = await readContract(config, {
        ...nodeManagerContract,
        functionName: "referenceId",
      });

      settotalreferral(Number(referrals));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //chart
  const [Node, setNode] = useState([]);
  const [NodeFree, setNodeFree] = useState([]);
  const [TotalBalance, setTotalBalance] = useState([]);
  const [UserWallet, setUserWallet] = useState([]);
  const [UserBuyNode, setUserBuyNode] = useState([]);
  const [TotalReferral, setTotalReferral] = useState([]);
  const [SelectChart, setSelectChart] = useState(null);
  const [SelectChartSecond, setSelectChartSecond] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleBoxClick = (chartType) => {
    setSelectChart(chartType);
    setSelectChartSecond(null);
    onOpen();
  };
  const handleBoxClickSecond = (chartType) => {
    setSelectChartSecond(chartType);
    setSelectChart(null);
    onOpen();
  };

  const getPlatform = async () => {
    try {
      const [
        Node,
        NodeFree,
        totalBalance,
        UserWallet,
        UserBuyNode,
        TotalReferral,
      ] = await Promise.all([
        clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "totalNode",
        }),
        await clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "freeFarmer",
        }),
        await clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "totalBalance",
        }),
        await clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "totalUserWallet",
        }),
        await clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "userByNode",
        }),
        await clientAPI("post", "/api/connectWalletHistory/getPlatform", {
          field: "totalreferral",
        }),
      ]);
      setNode(Node?.data);
      setNodeFree(NodeFree?.data);
      setTotalBalance(totalBalance?.data);
      setUserWallet(UserWallet?.data);
      setUserBuyNode(UserBuyNode?.data);
      setTotalReferral(TotalReferral?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const handleCloseMessage = () => {
    setIsLoading(false);
    setStatus(null);
  };
  const [disabled, setDisabled] = useState(false);
  const [taikoClaimedAmount, setTaikoClaimedAmount] = useState(0);
  const [value, setValue] = useState(0);
  const chains = getChains(config);
  const chainId = getChainId(config);
  const currentChain = chains.find((chain) => chain.id === chainId);
  const chainDecimal = currentChain?.nativeCurrency?.decimals;
  useEffect(() => {
    getBalanceContract();
  }, [status]);
  const onChangeValue = useCallback((e) => {
    const { value } = e.target;
    const reg = /^\d*\.?\d*$/;
    let val = 0;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      val = parseFloat(value);
      if (val < 0) val = 1;
      else {
        setValue(value);
      }
    }
  });
  const withdrawTaikoBalance = async () => {
    if (!address) {
      setMessage("You have not connected wallet");
      setStatus("failure");
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    if (Number(value) == 0) {
      setMessage("Invalid input");
      setStatus("failure");
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    if (Number(balanceContract) < Number(value)) {
      setMessage("Not enough balance");
      setStatus("failure");
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();

    const amount = parseUnits(String(value), chainDecimal);
    // handle transaction
    const txObj = {
      ...nodeManagerContract,
      functionName: "withdraw",
      args: [address, amount],
    };

    const [gasPrice, gasLimit] = await Promise.all([
      getGasPrice(config),
      taikoHeklaClient.estimateContractGas({
        ...txObj,
        account: address,
      }),
    ]);

    const gasFeeToEther = Number(gasLimit * gasPrice) / 10 ** chainDecimal;

    if (Number(balance.formatted) < gasFeeToEther) {
      setMessage(ERROR.notBalance);
      setStatus("failure");
      setIsLoading(true);
      setDisabled(false);
      return;
    }
    setMessage(PENDING.txAwait);
    setIsLoading(true);
    setStatus(null);

    try {
      const hash = await writeContract(config, {
        ...txObj,
      });

      if (hash) {
        console.log({ hash });
        // const status = await getTransactionStatus(config, hash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: hash,
          type: "Withdraw",
          ipAddress: ipAddress,
          status: "pending",
        });
        const result = await waitForTransactionReceipt(config, {
          hash: hash,
        });

        if (result?.status == "success") {
          // const status = await getTransactionStatus(config, hash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: hash,
            status: "success",
          });
          setMessage("Withdraw successful");
          setStatus("success");
          setIsLoading(true);
          setDisabled(false);

          return;
        } else {
          setMessage(FAIURE.txFalure);
          setStatus("failure withdraw");
          setIsLoading(true);
          setDisabled(false);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setMessage(FAIURE.txFalure);
      setStatus("failure");
      setIsLoading(true);
      setDisabled(false);
      return;
    }
  };

  useEffect(() => {
    if (address) {
      getTotalNodeFree();
      getPlatform();
    }
  }, [address]);
  //
  const {
    userWalletData,
    totalPages,
    isLoading: isLoadingReferralsHistoryData,
    refetch: refetchReferralsHistoryData,
    isRefetching: isRefetchingReferralsHistoryData,
    prevPage: handlePrev,
    nextPage: handleNext,
    setCurrentPage,
    currentPage,
  } = useUserWallet(address);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
    refetchReferralsHistoryData();
  };
  console.log({ userWalletData });

  const {
    userWalletDataInfinity,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useUserWalletInfinity(address);

  const { ref, inView } = useInView();

  useInterval(() => {
    refetch();
    refetchReferralsHistoryData();
  }, 3000);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const isMobile = useScreenWidth(480);
  const isTablet = useScreenWidth(1024);
  const historyTableData = {
    headers: [
      {
        label: "Time",
        key: "timestamps",
      },
      {
        label: "User Wallet",
        key: "caller",
      },
      {
        label: "IpAddress",
        key: "ipaddress",
      },
    ],
    headersMobile: [
      {
        label: "Time",
        key: "timestamps",
      },
      {
        label: "User Wallet",
        key: "caller",
      },
      {
        label: "IpAddress",
        key: "ipaddress",
      },
    ],
    data: isMobile ? userWalletData : userWalletDataInfinity,
  };

  return (
    <>
      <SectionContainer
        backgroundImage={`url(${backgroundNode})`}
        backgroundRepeat={"no-repeat"}
        px={{ base: "25px", xl: "48px", "3xl": "68px" }}
        marginBottom={"24px"}
        position={"relative"}
      >
        <Text
          fontSize={{ base: "24px", "2xl": "64px" }}
          fontWeight={400}
          fontFamily="var(--font-heading)"
          textAlign={"center"}
          paddingTop={{ base: "50px", "2xl": "135px" }}
        >
          Admin
        </Text>
        <Flex
          flexDirection={"column"}
          gap={"66px"}
          fontFamily={"var(--font-heading-main)"}
        >
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            alignItems={"stretch"}
            justifyContent={"space-between"}
            marginTop={{ base: "60px", xl: "108px" }}
            gap={"18px"}
            height={"100%"}
          >
            {["TOTAL NODE ", "FREE FARMER", "TOTAL Balance "].map(
              (title, index) => (
                <Box
                  key={index}
                  width={"100%"}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  onClick={() => handleBoxClick(index)}
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
                        "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                      "::before": {
                        width: "10px",
                        height: "10px",
                        backgroundColor: "pink.500",
                      },
                      "::after": {
                        width: "10px",
                        height: "10px",
                        backgroundColor: "pink.500",
                      },
                    },
                  }}
                >
                  <CommonButton
                    backgroundColor={"rgba(27, 27, 27, 0.20)"}
                    boxShadow={"inset 0 0 10px var(--color-main)"}
                    border="0.5px solid var(--color-main)"
                    position="relative"
                    zIndex="10"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Flex
                      flexDirection={"column"}
                      gap={{ base: "15px", xl: "30px" }}
                      justifyContent={"space-between"}
                      paddingTop={{ base: "25px", md: "45px" }}
                      paddingLeft={{ base: "30px", md: "25px", xl: "50px" }}
                      paddingBottom={{ base: "23px", md: "43px" }}
                      paddingRight={{ base: "20px" }}
                      height="100%"
                    >
                      <Text
                        fontSize={{ base: "24px", xl: "32px" }}
                        fontWeight={400}
                        fontFamily="var(--font-text-extra)"
                        color="var(--color-main)"
                        lineHeight={"normal"}
                      >
                        {title}
                      </Text>
                      {index === 0 ? (
                        <Text
                          fontSize={{ base: "18px", xl: "24px" }}
                          fontWeight={600}
                          lineHeight={"normal"}
                        >
                          {totalMonney}
                        </Text>
                      ) : (
                        <Flex alignItems="center">
                          <Text
                            fontSize={{ base: "18px", xl: "24px" }}
                            fontWeight={600}
                            lineHeight={"normal"}
                          >
                            {index === 1
                              ? freeFarmer
                              : `${formatTokenBalance(balanceContract)} ${taikoBalance?.symbol}`}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </CommonButton>
                </Box>
              )
            )}
          </Flex>
        </Flex>

        <Flex
          flexDirection={"column"}
          gap={"66px"}
          fontFamily={"var(--font-heading-main)"}
        >
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            alignItems={"stretch"}
            justifyContent={"space-between"}
            marginTop={{ base: "60px", xl: "108px" }}
            gap={"18px"}
            height={"100%"}
          >
            {["USER WALLET ", "USER BUY NODE ", "TOTAL REFERRAL "].map(
              (title, index) => (
                <Box
                  key={index}
                  width={"100%"}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  onClick={() => handleBoxClickSecond(index)}
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
                        "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                      "::before": {
                        width: "10px",
                        height: "10px",
                        backgroundColor: "pink.500",
                      },
                      "::after": {
                        width: "10px",
                        height: "10px",
                        backgroundColor: "pink.500",
                      },
                    },
                  }}
                >
                  <CommonButton
                    backgroundColor={"rgba(27, 27, 27, 0.20)"}
                    boxShadow={"inset 0 0 10px var(--color-main)"}
                    border="0.5px solid var(--color-main)"
                    position="relative"
                    zIndex="10"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Flex
                      flexDirection={"column"}
                      gap={{ base: "15px", xl: "30px" }}
                      justifyContent={"space-between"}
                      paddingTop={{ base: "25px", md: "45px" }}
                      paddingLeft={{ base: "30px", md: "25px", xl: "50px" }}
                      paddingBottom={{ base: "23px", md: "43px" }}
                      paddingRight={{ base: "20px" }}
                      height="100%"
                    >
                      <Text
                        fontSize={{ base: "24px", xl: "32px" }}
                        fontWeight={400}
                        fontFamily="var(--font-text-extra)"
                        color="var(--color-main)"
                        lineHeight={"normal"}
                      >
                        {title}
                      </Text>
                      {index === 0 ? (
                        <Text
                          fontSize={{ base: "18px", xl: "24px" }}
                          fontWeight={600}
                          lineHeight={"normal"}
                        >
                          {userWallet}
                        </Text>
                      ) : (
                        <Flex alignItems="center">
                          <Text
                            fontSize={{ base: "18px", xl: "24px" }}
                            fontWeight={600}
                            lineHeight={"normal"}
                          >
                            {index === 1 ? totaluserbuynode : totalreferral}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </CommonButton>
                </Box>
              )
            )}
          </Flex>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            w={"900px"}
            maxW="90%"
            p={4}
            backgroundColor="var(--color-background-popup)"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
          >
            {SelectChart == 0 && (
              <ChartUI Node={Node} SelectChart={SelectChart} />
            )}
            {SelectChart == 1 && (
              <ChartUI NodeFree={NodeFree} SelectChart={SelectChart} />
            )}
            {SelectChart == 2 && (
              <ChartUI TotalBalance={TotalBalance} SelectChart={SelectChart} />
            )}
            {SelectChartSecond == 0 && (
              <ChartUI
                UserWallet={UserWallet}
                SelectChartSecond={SelectChartSecond}
              />
            )}
            {SelectChartSecond == 1 && (
              <ChartUI
                UserBuyNode={UserBuyNode}
                SelectChartSecond={SelectChartSecond}
              />
            )}
            {SelectChartSecond == 2 && (
              <ChartUI
                TotalReferral={TotalReferral}
                SelectChartSecond={SelectChartSecond}
              />
            )}
          </ModalContent>
        </Modal>
        <Flex
          backgroundColor="var(--color-background-popup)"
          marginTop={"65px"}
          marginBottom={"60px"}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "space-between" }}
          alignItems={"center"}
          gap={"20px"}
          padding={{
            base: "32px 32px 0px 32px",
            xl: "47px 58px 55px 58px",
          }}
          border={"0.5px solid var(--color-main)"}
        >
          <Box width={"100%"}>
            <Box
              width="100%"
              border="1px solid #FCDDEC"
              padding="10px"
              position="relative"
            >
              <Text
                fontFamily="var(--font-text-main)"
                position="absolute"
                top={{ base: "-15px" }}
                left={{ base: "20px", xl: "50px" }}
                backgroundColor="#231A2E"
                padding="0 5px"
                color="#FFFFFF"
                fontSize={{ base: "16px", md: "18px", xl: "24px" }}
                fontWeight={500}
              >
                Withdraw Monney
              </Text>
              <Flex
                padding={{ base: "0px", xl: "25px 28px 25px 34px" }}
                flexDirection={"column"}
              >
                <Flex
                  height={{ base: "24px" }}
                  width={"100%"}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Input
                    fontFamily="var(--font-text-main)"
                    value={value}
                    onChange={onChangeValue}
                    placeholder="Input"
                    border="none"
                    bg="#231A2E"
                    height={{ base: "24px" }}
                    color="#FFFFFF"
                    flex="1"
                    marginRight="8px"
                    _focus={{ outline: "none", boxShadow: "none" }}
                  />
                  <MainButton
                    onClick={withdrawTaikoBalance}
                    isDisabled={disabled}
                    padding={"0px"}
                    height={{
                      base: "40px",
                      md: "50px",
                      xl: "48px",
                      "3xl": "70px",
                    }}
                    width={{ base: "30%", md: "40%", lg: "20%" }}
                    bg="#EC4899"
                    display={{ base: "none", xl: "block" }}
                    color="#FFFFFF"
                    borderRadius="8px"
                    border="none"
                    _hover={{ bg: "#DB2777" }}
                    _active={{ bg: "#BE185D" }}
                  >
                    <Text fontFamily="var(--font-text-main)"> Withdraw</Text>
                  </MainButton>
                </Flex>
              </Flex>
            </Box>
            <MainButton
              onClick={withdrawTaikoBalance}
              isDisabled={disabled}
              padding={"0px"}
              display={{ base: "block", xl: "none" }}
              marginTop={"16px"}
              marginBottom={"32px"}
              borderRadius={"8px"}
              height={{ base: "40px", md: "50px", xl: "48px", "3xl": "70px" }}
              width={{ base: "100%" }}
              bg="#EC4899"
              color="#FFFFFF"
              border="none"
              _hover={{ bg: "#DB2777" }}
              _active={{ bg: "#BE185D" }}
            >
              <Text fontFamily="var(--font-text-main)"> Withdraw</Text>
            </MainButton>
          </Box>
        </Flex>
        {isMobile ? (
          <CommonButton
            border="0.5px solid var(--color-main)"
            width={"100%"}
            height={"100%"}
            marginTop={"65px"}
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
                    fontFamily={"var(--font-heading-main)"}
                  >
                    <Flex direction={"column"} w={"100%"} gap={"8px"}>
                      {historyTableData.headersMobile.map((item) => {
                        return (
                          <SimpleGrid columns={2} w={"100%"}>
                            <Box>
                              <Text>{item.label}</Text>
                            </Box>
                            <Box>
                              {item.key === "caller" ? (
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
                <Text textAlign={"center"}>No record</Text>
              </Box>
            )}
            <Box
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
              py={"24px"}
            >
              <ReactPaginate
                pageCount={totalPages}
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
            marginTop={"65px"}
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
                      <Td colSpan={4} w={"100%"}>
                        <Box textAlign={"center"}>No records found</Box>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
              {historyTableData.data?.length ? (
                <HStack pt="32px" pb="20px" justifyContent="center" w="full">
                  <Text ref={ref} fontFamily={"var(--font-text-main)"}>
                    {isFetchingNextPage ? (
                      <BeatLoader color="#7ae7ff" size="10px" />
                    ) : hasNextPage ? (
                      ""
                    ) : (
                      "Nothing more to load"
                    )}
                  </Text>
                </HStack>
              ) : (
                ""
              )}
            </TableContainer>
          </CommonButton>
        )}
        <MessageBox
          isLoading={isLoading}
          status={status}
          message={message}
          handleCloseMessage={handleCloseMessage}
          txHash={txHash}
        />
      </SectionContainer>
    </>
  );
};

export default AdminPage;
