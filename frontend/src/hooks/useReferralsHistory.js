import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { clientAPI } from "../api/client";
import { useClient } from "wagmi";

const NUMBER_NFT_PER_PAGE = 10;
const queryKey = "referralsHistory";
const queryKeyInfinity = `referralsHistoryInfinity`;

async function fetchReferralsHistory(caller, currentPage, chainDecimal) {
  try {
    const options = {
      caller: caller,
      limit: 10,
      offset: 10 * (currentPage - 1),
      sort: -1,
    };

    let data = await clientAPI(
      "post",
      "/api/transaction/get-referrals",
      options
    );
    const totalpages = Math.ceil(data?.total / 10);
    const newData = data?.data?.map((item, index) => {
      return {
        timestamps: item.timestamps,
        caller: item.caller,
        amount: chainDecimal ? item.amount / 10 ** chainDecimal : item.amount,
      };
    });
    return { data: newData, totalpages };
  } catch (error) {
    console.log("error", error);

    return { data: [], total: 0 };
  }
}

export function useReferralsHistory(caller) {
  const client = useClient();
  const chainDecimal = client.chain.nativeCurrency.decimals;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: [queryKey, currentPage, caller, client],
    queryFn: async () =>
      fetchReferralsHistory(caller, currentPage, chainDecimal),
    refetchOnWindowFocus: false,
  });

  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);

  return {
    referralsHistoryData: data?.data,
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

async function fetchReferralsHistoryInfinity(
  caller,
  chainDecimal,
  { pageParam = 0 }
) {
  try {
    const options = {
      caller: caller,
      limit: NUMBER_NFT_PER_PAGE,
      offset: pageParam,
      sort: -1,
    };

    console.log({ caller, pageParam });
    let data = await clientAPI(
      "post",
      "/api/transaction/get-referrals",
      options
    );

    const newData = data?.data?.map((item, index) => {
      return {
        timestamps: item.timestamps,
        caller: item.caller,
        amount: (chainDecimal ? item.amount / 10 ** chainDecimal : item.amount),
      };
    });
    return { data: newData, nextId: pageParam + NUMBER_NFT_PER_PAGE };
  } catch (error) {
    console.log("error", error);
    return { data: [], nextId: pageParam + NUMBER_NFT_PER_PAGE };
  }
}

export function useReferralsHistoryInfinity(caller) {
  const client = useClient();
  const chainDecimal = client.chain.nativeCurrency.decimals;
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
    queryFn: ({ pageParam = 0 }) =>
      fetchReferralsHistoryInfinity(caller, chainDecimal, { pageParam }),
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
    referralsHistoryDataInfinity: flatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  };
}
