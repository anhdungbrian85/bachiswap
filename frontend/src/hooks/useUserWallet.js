import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { clientAPI } from "../api/client";
import { useClient } from "wagmi";

const NUMBER_NFT_PER_PAGE = 10;
const queryKey = "userWallet";
const queryKeyInfinity = `userWalletInfinity`;

async function fetchUserWallet(caller, currentPage, chainDecimal) {
  try {
    const options = {
      caller: caller,
      limit: 10,
      offset: 10 * (currentPage - 1),
      sort: -1,
    };

    let data = await clientAPI(
      "post",
      "/api/connectWalletHistory/getUserWallet",
      options
    );
    const totalpages = Math.ceil(data?.total / 10);
    const newData = data?.data?.map((item) => {
      return {
        timestamps: item.createdAt,
        caller: item.wallet_address,
        ipaddress: item.ipAddress,
      };
    });
    return { data: newData, totalpages };
  } catch (error) {
    console.log("error", error);

    return { data: [], total: 0 };
  }
}

export function useUserWallet(caller) {
  const client = useClient();
  const chainDecimal = client.chain.nativeCurrency.decimals;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: [queryKey, currentPage, caller, client],
    queryFn: async () => fetchUserWallet(caller, currentPage, chainDecimal),
    refetchOnWindowFocus: false,
  });

  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);

  return {
    userWalletData: data?.data,
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

async function fetchUserWalletInfinity(
  caller,
  chainDecimal,
  { pageParam = 0 }
) {
  try {
    const options = {
      wallet_address: caller,
      limit: NUMBER_NFT_PER_PAGE,
      offset: pageParam,
      sort: -1,
    };

    // console.log({ caller, pageParam });
    let data = await clientAPI(
      "post",
      "/api/connectWalletHistory/getUserWallet",
      options
    );

    const newData = data?.data?.map((item) => {
      return {
        timestamps: item.createdAt,
        caller: item.wallet_address,
        ipaddress: item.ipAddress,
      };
    });
    return { data: newData, nextId: pageParam + NUMBER_NFT_PER_PAGE };
  } catch (error) {
    console.log("error", error);
    return { data: [], nextId: pageParam + NUMBER_NFT_PER_PAGE };
  }
}

export function useUserWalletInfinity(caller) {
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
      fetchUserWalletInfinity(caller, chainDecimal, { pageParam }),
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
    userWalletDataInfinity: flatData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  };
}
