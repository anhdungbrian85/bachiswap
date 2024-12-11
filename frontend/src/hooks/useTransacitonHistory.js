import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { clientAPI } from "../api/client";

const NUMBER_NFT_PER_PAGE = 10;
const queryKey = "transactionHistory";
const queryKeyInfinity = `transactionHistoryInfinity`;

async function fetchTransactionHistory(currentPage) {
  try {
    const options = {
      limit: NUMBER_NFT_PER_PAGE,
      offset: NUMBER_NFT_PER_PAGE * (currentPage - 1),
      sort: -1,
    };

    let data = await clientAPI(
      "post",
      "/api/transaction/get-transaction",
      options
    );
    const totalpages = Math.ceil(data?.total / NUMBER_NFT_PER_PAGE);
    const newData = data?.data?.map((item, index) => {
      return {
        num: index + 1 + NUMBER_NFT_PER_PAGE * (currentPage - 1),
        type: item.type,
        caller: item.caller,
        status: item.status,
      };
    });
    return { data: newData, totalpages };
  } catch (error) {
    console.log("error", error);

    return { data: [], total: 0 };
  }
}

export function useTransactionHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: [queryKey, currentPage],
    queryFn: async () => fetchTransactionHistory(currentPage),
    refetchOnWindowFocus: false,
  });

  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);

  return {
    transactionHistoryData: data?.data,
    totalPages: data?.totalpages,
    refetch,
    isLoading,
    isRefetching,
    prevPage,
    nextPage,
    setCurrentPage,
    currentPage,
  };
}

async function fetchTransactionHistoryInfinity({ pageParam = 0 }) {
  try {
    const options = {
      limit: NUMBER_NFT_PER_PAGE,
      offset: pageParam,
      sort: -1,
    };

    let data = await clientAPI(
      "post",
      "/api/transaction/get-transaction",
      options
    );

    const newData = data?.data?.map((item, index) => {
      return {
        num: index + 1 + pageParam,
        type: item.type,
        caller: item.caller,
        status: item.status,
      };
    });
    return { data: newData, nextId: pageParam + NUMBER_NFT_PER_PAGE };
  } catch (error) {
    console.log("error", error);
    return { data: [], nextId: pageParam + NUMBER_NFT_PER_PAGE };
  }
}

export function useTransactionHistoryInfinity() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKeyInfinity],
    queryFn: fetchTransactionHistoryInfinity,
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.length < NUMBER_NFT_PER_PAGE) {
        return undefined;
      }
      return lastPage?.nextId;
    },
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );
  return {
    transactionHistoryDataInfinity: flatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  };
}
