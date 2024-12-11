import React, { useEffect } from "react";
import {
  useTransactionHistory,
  useTransactionHistoryInfinity,
} from "../../../../hooks/useTransacitonHistory";
import { useAccount } from "wagmi";
import CommonButton from "../../../../components/button/commonbutton";
import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Td,
  Th,
  Box,
  Tbody,
  Tfoot,
  Text,
  HStack,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { formatTableValue } from "./formatTable";
import { useInView } from "react-intersection-observer";
import { BeatLoader } from "react-spinners";
import useInterval from "../../../../hooks/useInterval";
import useScreenWidth from "../../../../hooks/useScreenWidth";
import { base } from "viem/chains";
import { AddressCopier } from "../../../../components/addressCopier";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";

const RuneExplorer = () => {
  const { t } = useTranslation("node");
  const {
    transactionHistoryData,
    totalPages,
    isLoading: isLoadingTransactionHistoryData,
    refetch: refetchTransactionHistoryData,
    isRefetching: isRefetchingTransactionHistoryData,
    prevPage: handlePrev,
    nextPage: handleNext,
    setCurrentPage,
    currentPage,
  } = useTransactionHistory();

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
    refetchTransactionHistoryData();
  };

  const {
    transactionHistoryDataInfinity,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useTransactionHistoryInfinity();

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
  const isMobile = useScreenWidth(480);
  const isTablet = useScreenWidth(1024);
  const historyTableData = {
    headers: [
      {
        label: t("No"),
        key: "num",
      },
      {
        label: t("Type"),
        key: "type",
      },
      {
        label: t("Wallet"),
        key: "caller",
      },
      {
        label: t("Process"),
        key: "status",
      },
    ],
    headersMobile: [
      {
        label: t("Type"),
        key: "type",
      },
      {
        label: t("Wallet"),
        key: "caller",
      },
      {
        label: t("Process"),
        key: "status",
      },
    ],
    data: isMobile ? transactionHistoryData : transactionHistoryDataInfinity,
  };

  if (isMobile)
    return (
      <>
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
              let color;
              if (record.status === "pending" || record.status === "보류 중")
                color = "#F8A401";
              else if (record.status === "success" || record.status === "성공")
                color = "#23F600";
              else color = "#E42493";
              return (
                <Box
                  padding={"32px"}
                  borderBottom={"0.5px solid var(--color-main)"}
                >
                  <Flex w={"100%"} gap={"12px"}>
                    <Box w={"24px"}>
                      {record.num}
                      {"."}
                    </Box>
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
                                  digits={4}
                                />
                              ) : (
                                <Text color={item.key === "status" && color}>
                                  {record[item.key]}
                                </Text>
                              )}
                            </Box>
                          </SimpleGrid>
                        );
                      })}
                    </Flex>
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
              <Text textAlign={"center"}>{t("Norecord")}</Text>
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
      </>
    );

  return (
    <>
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
                              {formatTableValue(t(e[keyvalue]), keyvalue)}
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
                    <Box textAlign={"center"}>{t("Norecordsfound")}</Box>
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
    </>
  );
};

export default RuneExplorer;
