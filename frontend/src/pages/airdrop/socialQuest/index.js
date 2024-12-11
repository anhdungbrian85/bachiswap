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

const TWITTER_API = process.env.REACT_APP_TWITTER_API;
const DISCORD_API = process.env.REACT_APP_DISCORD_API;

const SocialQuest = () => {
  const { t } = useTranslation("airdrop");
  const client = useClient();
  const chainId = getChainId(config);
  const chainDecimal = client.chain.nativeCurrency.decimals;
  const questManagerContract = {
    address: quest_manager_contract.CONTRACT_ADDRESS,
    abi: quest_manager_contract.CONTRACT_ABI,
  };
  const nodeManagerContract = {
    address: node_manager_contract.CONTRACT_ADDRESS,
    abi: node_manager_contract.CONTRACT_ABI,
  };
  const { address } = useAccount();
  const [task1Status, setTask1Status] = useState("pending");
  const [task2Status, setTask2Status] = useState("pending");
  const [task3Status, setTask3Status] = useState("pending");
  const [task4Status, setTask4Status] = useState("pending");
  const [task5Status, setTask5Status] = useState("pending");
  const [task6Status, setTask6Status] = useState("pending");
  const [task7Status, setTask7Status] = useState("pending");
  const [task8Status, setTask8Status] = useState("pending");
  const [task9Status, setTask9Status] = useState("pending");

  const getStatusTask = async (task_id, setStatus) => {
    const options = {
      wallet_address: address,
      task_id: task_id,
    };
    const isSuccess = await clientAPI(
      "post",
      "/api/rewardAirdropHistory/getRewardHistoryByTaskId",
      options
    );
    const isComplete = await readContract(config, {
      ...questManagerContract,
      functionName: "isTaskCompletedByUser",
      args: [address, task_id],
    });

    if (isSuccess?.data) setStatus(t("success"));
    if (isComplete) setStatus(t("completed"));
  };

  const getStatusTask1 = async (task_id, setStatus) => {
    const options = {
      wallet_address: address,
      task_id: task_id,
    };
    const isSuccess = await clientAPI(
      "post",
      "/api/rewardAirdropHistory/getRewardHistoryByTaskId",
      options
    );
    const isComplete = await readContract(config, {
      ...questManagerContract,
      functionName: "isTaskCompletedByUser",
      args: [address, task_id],
    });
    const refId = await readContract(config, {
      ...nodeManagerContract,
      functionName: "userReferralIdLinks",
      args: [address],
    });

    if (isSuccess?.data) setStatus(t("success"));
    if (isComplete || Number(refId) > 0) setStatus(t("completed"));
  };

  const getStatusTask4 = async (task_id, setStatus) => {
    const options = {
      wallet_address: address,
      task_id: task_id,
    };
    const { data } = await clientAPI(
      "post",
      "/api/rewardAirdropHistory/getRewardHistoryByTaskId",
      options
    );

    const isComplete = await readContract(config, {
      ...questManagerContract,
      functionName: "isTaskDailyCompletedByUser",
      args: [address, task_id],
    });

    if (data) {
      const currentTime = new Date();
      const previousClaimDate = new Date(data.createdAt);
      const currentDay = new Date(currentTime.toDateString());
      const previousDay = new Date(previousClaimDate.toDateString());
      if (currentDay > previousDay) setStatus(t("pending"));
      else setStatus(t("success"));
    }
    if (isComplete) setStatus(t("completed"));
  };

  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [disabled, setDisabled] = useState(false);
  const handleCloseMessage = () => {
    setIsLoading(false);
    setStatus(null);
  };

  useEffect(() => {
    if (address) {
      getStatusTask1(1, setTask1Status);
      getStatusTask(2, setTask2Status);
      getStatusTask(3, setTask3Status);
      getStatusTask4(4, setTask4Status);
      getStatusTask(5, setTask5Status);
      getStatusTask(6, setTask6Status);
      getStatusTask(7, setTask7Status);
      getStatusTask(8, setTask8Status);
      getStatusTask(9, setTask9Status);
    }
  }, [address]);

  const handleSuccessTask1 = async (task_id, setTaskStatus) => {
    setDisabled(true);
    if (!address) {
      setMessage(t("You not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();
    const txObj = {
      ...questManagerContract,
      functionName: "completeReferralTask",
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
      setMessage(t("Not enough balance"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    setMessage(t(PENDING.txAwait));
    setStatus(null);
    setIsLoading(true);
    try {
      const hash = await writeContract(config, {
        ...txObj,
      });
      if (hash) {
        console.log({ hash });
        setTxHash(hash);
        // const status = await getTransactionStatus(config, hash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: hash,
          type: `Complete Task ${task_id}`,
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
          const { data } = await clientAPI(
            "post",
            "/api/airdropTask/getAirdropTaskById",
            { task_id: task_id }
          );
          if (data) {
            const { data: user } = await clientAPI(
              "post",
              "/api/rewardAirdrop/getUserReward",
              { caller: address }
            );
            if (!user) {
              await clientAPI("post", "/api/rewardAirdrop/addUserReward", {
                wallet_address: address,
                point: data.reward_point,
              });
            } else {
              const point = Number(data.reward_point) + Number(user.point);
              await clientAPI("post", "/api/rewardAirdrop/updateUserReward", {
                wallet_address: address,
                point: point,
              });
            }
            const options = {
              wallet_address: address,
              task_id: task_id,
              point: data.reward_point,
            };
            const result = await clientAPI(
              "post",
              "/api/rewardAirdropHistory/addRewardHistory",
              options
            );
            // setStatus(task_id, "success");
          } else toast.error(t("Task not exist"));

          setMessage(`${t("Complete the mission")} ${task_id}!`);
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
          await Promise.all([
            getUserReferral(),
            getStatusTask(task_id, setTaskStatus),
          ]);
          return;
        } else {
          // const status = await getTransactionStatus(config, hash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: hash,
            status: "failure",
          });
          setMessage(t(FAIURE.txFalure));
          setStatus(t("failure"));
          setIsLoading(true);
          setDisabled(false);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setMessage(t(FAIURE.txFalure));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
  };
  const handleSuccessTask2 = async () => {
    if (!address) {
      toast.error(t("Please Connect wallet!"));
      return;
    }
    window.location.href = `${process.env.REACT_APP_TWITTER_API}/auth/twitter?wallet=${address}&&task_id=2`;
  };
  const handleSuccessTask3 = async () => {
    if (!address) {
      toast.error(t("Please Connect wallet!"));
      return;
    }
    window.location.href = `${process.env.REACT_APP_DISCORD_API}/auth/discord?wallet=${address}&&task_id=3`;
  };
  const handleSuccessTask4 = async (task_id, setStatus) => {
    if (!address) {
      toast.error(t("Please Connect wallet!"));
      return;
    }

    try {
      const { data } = await clientAPI(
        "post",
        "/api/airdropTask/getAirdropTaskById",
        { task_id: task_id }
      );
      if (data) {
        const { data: user } = await clientAPI(
          "post",
          "/api/rewardAirdrop/getUserReward",
          { caller: address }
        );
        if (!user) {
          await clientAPI("post", "/api/rewardAirdrop/addUserReward", {
            wallet_address: address,
            point: data.reward_point,
          });
        } else {
          const point = Number(data.reward_point) + Number(user.point);
          await clientAPI("post", "/api/rewardAirdrop/updateUserReward", {
            wallet_address: address,
            point: point,
          });
        }

        const options = {
          wallet_address: address,
          task_id: task_id,
          point: data.reward_point,
        };
        const result = await clientAPI(
          "post",
          "/api/rewardAirdropHistory/addRewardHistory",
          options
        );
        await getStatusTask(task_id, setStatus);
        toast.success(`${t("Complete the mission")} ${task_id}!`);
        // setStatus(task_id, "success");
      } else toast.error(t("Task not exist"));
    } catch (error) {
      if (error.response) {
        // Extract response data in case of a 500 error
        console.error(t("Server Error:"), error.response.data);
        toast.error(`${error.response.data.message}`);
      } else {
        // Handle other errors
        console.error(t("Error:"), error.message);
      }
      return;
    }
  };
  const handleSuccessTaskLike = async (task_id, setStatus) => {
    if (!address) {
      toast.error(t("Please Connect wallet!"));
      return;
    }
    if (task_id === 6)
      window.open("https://discord.com/invite/bachiswap", "_blank");
    window.open("https://x.com/BachiSwap", "_blank");

    try {
      const { data } = await clientAPI(
        "post",
        "/api/airdropTask/getAirdropTaskById",
        { task_id: task_id }
      );
      if (data) {
        const { data: user } = await clientAPI(
          "post",
          "/api/rewardAirdrop/getUserReward",
          { caller: address }
        );
        if (!user) {
          await clientAPI("post", "/api/rewardAirdrop/addUserReward", {
            wallet_address: address,
            point: data.reward_point,
          });
        } else {
          const point = Number(data.reward_point) + Number(user.point);
          await clientAPI("post", "/api/rewardAirdrop/updateUserReward", {
            wallet_address: address,
            point: point,
          });
        }
        const options = {
          wallet_address: address,
          task_id: task_id,
          point: data.reward_point,
        };
        const result = await clientAPI(
          "post",
          "/api/rewardAirdropHistory/addRewardHistory",
          options
        );
        await getStatusTask(task_id, setStatus);
        toast.success(`${t("Complete the mission")} ${task_id}!`);
        // setStatus(task_id, "success");
      } else toast.error(t("Task not exist"));
    } catch (error) {
      if (error.response) {
        // Extract response data in case of a 500 error
        console.error(t("Server Error:"), error.response.data);
        toast.error(`${error.response.data.message}`);
      } else {
        // Handle other errors
        console.error(t("Error:"), error.message);
      }
      return;
    }
  };

  const handleSuccessTask8 = async (task_id, setStatus) => {
    if (!address) {
      toast.error(t("Please Connect wallet!"));
      return;
    }
    if (task_id === 8)
      window.open("https://t.me/BachiSwap_Discussion", "_blank");

    try {
      const { data } = await clientAPI(
        "post",
        "/api/airdropTask/getAirdropTaskById",
        { task_id: task_id }
      );
      if (data) {
        const { data: user } = await clientAPI(
          "post",
          "/api/rewardAirdrop/getUserReward",
          { caller: address }
        );
        if (!user) {
          await clientAPI("post", "/api/rewardAirdrop/addUserReward", {
            wallet_address: address,
            point: data.reward_point,
          });
        } else {
          const point = Number(data.reward_point) + Number(user.point);
          await clientAPI("post", "/api/rewardAirdrop/updateUserReward", {
            wallet_address: address,
            point: point,
          });
        }
        const options = {
          wallet_address: address,
          task_id: task_id,
          point: data.reward_point,
        };
        const result = await clientAPI(
          "post",
          "/api/rewardAirdropHistory/addRewardHistory",
          options
        );
        await getStatusTask(task_id, setStatus);
        toast.success(`${t("Complete the mission")} ${task_id}!`);
        // setStatus(task_id, "success");
      } else toast.error(t("Task not exist"));
    } catch (error) {
      if (error.response) {
        // Extract response data in case of a 500 error
        console.error(t("Server Error:"), error.response.data);
        toast.error(`${error.response.data.message}`);
      } else {
        // Handle other errors
        console.error(t("Error:"), error.message);
      }
      return;
    }
  };

  const completeTask = async (task_id, setStatustx) => {
    setDisabled(true);
    if (!address) {
      setMessage(t("You not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    // if (task_id == 8) {
    //   const { data } = await clientAPI("post", "/api/telegram/verifJoinGroup", {
    //     wallet_address: address,
    //   });

    //   if (!data?.user) {
    //     setMessage("You not joined group");
    //     setStatus("failure");
    //     setIsLoading(true);
    //     setDisabled(false);
    //     return;
    //   }
    // }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();
    const txObj = {
      ...questManagerContract,
      functionName: "completeTask",
      args: [task_id],
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
      setMessage(t("Not enough balance"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    setMessage(t(PENDING.txAwait));
    setStatus(null);
    setIsLoading(true);
    try {
      const hash = await writeContract(config, {
        ...txObj,
      });
      if (hash) {
        console.log({ hash });
        setTxHash(hash);
        // const status = await getTransactionStatus(config, hash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: hash,
          type: `Complete Task ${task_id}`,
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
          setMessage(t("Claim successful"));
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
          await getStatusTask(task_id, setStatustx);
          // setStatus(task_id, "completed");
          return;
        } else {
          // const status = await getTransactionStatus(config, hash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: hash,
            status: "failure",
          });
          setMessage(t(FAIURE.txFalure));
          setStatus(t("failure"));
          setIsLoading(true);
          setDisabled(false);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setMessage(t(FAIURE.txFalure));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
  };
  const completeTask4 = async (task_id, setStatustx) => {
    setDisabled(true);
    if (!address) {
      setMessage(t("You not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();
    const txObj = {
      ...questManagerContract,
      functionName: "completeTaskDaily",
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
      setMessage(t("Not enough balance"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    setMessage(t(PENDING.txAwait));
    setStatus(null);
    setIsLoading(true);
    try {
      const hash = await writeContract(config, {
        ...txObj,
      });
      if (hash) {
        console.log({ hash });
        setTxHash(hash);
        // const status = await getTransactionStatus(config, hash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: hash,
          type: `Complete Task ${task_id}`,
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
          setMessage(t("Claim successful"));
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
          await getStatusTask(task_id, setStatustx);
          // setStatus(task_id, "completed");
          return;
        } else {
          // const status = await getTransactionStatus(config, hash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: hash,
            status: "failure",
          });
          setMessage(t(FAIURE.txFalure));
          setStatus(t("failure"));
          setIsLoading(true);
          setDisabled(false);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setMessage(t(FAIURE.txFalure));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
  };

  const quests = [
    {
      title: t("ClaimyourReferralLink"),
      rewardText: t("Reward"),
      rewardTotal: 0.1,
      claimText: t("claimText"),
      buttonText: t("Claim"),
      onClick: () => console.log("Invite Friend Quest Clicked"),
      inputPlaceholder: "Input",
      handleTask: () => handleSuccessTask1(1, setTask1Status),
      completeTask: () => handleSuccessTask1(1, setTask1Status),
      task_id: 1,
      status: task1Status,
    },
    {
      title: t("CONNECTYOURTIWTTERACCOUNT"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: handleSuccessTask2,
      completeTask: () => completeTask(2, setTask2Status),
      inputPlaceholder: null,
      task_id: 2,
      status: task2Status,
    },
    {
      title: t("CONNECTYOURDISCORDACCOUNT"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Twitter Connect Clicked"),
      handleTask: handleSuccessTask3,
      completeTask: () => completeTask(3, setTask3Status),
      inputPlaceholder: null,
      task_id: 3,
      status: task3Status,
    },
    {
      title: t("CLAIMYOURDAILYREWARD"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => handleSuccessTask4(4, setTask4Status),
      completeTask: () => completeTask4(4, setTask4Status),
      inputPlaceholder: null,
      task_id: 4,
      status: task4Status,
    },
    {
      title: t("FOLLOW@BachiSwapONX"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => handleSuccessTaskLike(5, setTask5Status),
      completeTask: () => completeTask(5, setTask5Status),
      inputPlaceholder: null,
      task_id: 5,
      status: task5Status,
    },
    {
      title: t("JOINDISCORDSERVER"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => handleSuccessTaskLike(6, setTask6Status),
      completeTask: () => completeTask(6, setTask6Status),
      inputPlaceholder: null,
      task_id: 6,
      status: task6Status,
    },
    {
      title: t("LIKETHISTWEETONX"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => handleSuccessTaskLike(7, setTask7Status),
      completeTask: () => completeTask(7, setTask7Status),
      inputPlaceholder: null,
      task_id: 7,
      status: task7Status,
    },
    {
      title: t("JOINTELEGRAMGROUP"),
      rewardText: t("Reward"),
      rewardTotal: 0.005,
      claimText: null,
      buttonText: t("DoQuest"),
      onClick: () => console.log("Daily Reward Clicked"),
      handleTask: () => handleSuccessTask8(8, setTask8Status),
      completeTask: () => completeTask(8, setTask8Status),
      inputPlaceholder: null,
      task_id: 8,
      status: task8Status,
    },
    // {
    //   title: "LIKE THIS TWEET ON X",
    //   rewardText: "Reward",
    //   rewardTotal: 0.005,
    //   buttonText: "Do Quest",
    //   onClick: () => console.log("Daily Reward Clicked"),
    //   handleTask: () => handleSuccessTaskLike(9, setTask9Status),
    //   completeTask: () => completeTask(9, setTask9Status),
    //   inputPlaceholder: null,
    //   task_id: 9,
    //   status: task9Status,
    // },
  ];

  const getTransactionStatus = async (config, hash) => {
    let status;
    const transaction = await getTransaction(config, {
      hash: hash,
    });
    if (transaction.blockNumber === null) {
      status = "pending";
    } else {
      const receipt = await getTransactionReceipt(config, {
        hash: hash,
      });
      status = receipt.status;
    }
    return status;
  };

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
  /*** Get Referral *****/
  const getUserReferral = async () => {
    try {
      const [refId, referrals] = await Promise.all([
        readContract(config, {
          ...nodeManagerContract,
          functionName: "userReferralIdLinks",
          args: [address],
        }),
        readContract(config, {
          ...nodeManagerContract,
          functionName: "referrals",
          args: [
            await readContract(config, {
              ...nodeManagerContract,
              functionName: "userReferralIdLinks",
              args: [address],
            }),
          ],
        }),
      ]);

      setReferralCode(referrals[0] || null);
    } catch (error) {
      console.error("Error fetching referral:", error);
      setReferralCode(null);
    }
  };

  useEffect(() => {
    if (address) {
      getUserReferral();
    } else {
      setReferralCode(null);
    }
  }, [address, status]);

  return (
    <>
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
                    claimText={quest.claimText}
                    buttonText={quest.buttonText}
                    onClick={quest.onClick}
                    inputPlaceholder={quest.inputPlaceholder}
                    handleTask={quest.handleTask}
                    completeTask={quest.completeTask}
                    status={quest.status}
                    isDisabled={disabled}
                    task_id={quest.task_id}
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
                    claimText={quest.claimText}
                    buttonText={quest.buttonText}
                    onClick={quest.onClick}
                    inputPlaceholder={quest.inputPlaceholder}
                    handleTask={quest.handleTask}
                    completeTask={quest.completeTask}
                    status={quest.status}
                    isDisabled={disabled}
                    task_id={quest.task_id}
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
      <MessageBox
        isLoading={isLoading}
        status={status}
        message={message}
        handleCloseMessage={handleCloseMessage}
        txHash={txHash}
      />
    </>
  );
};

const ReferralCopier = ({ referralCode }) => {
  const { t } = useTranslation("airdrop");
  const handleCopy = (label, text) => {
    toast.success(t(`${label} copied!`));
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
          {`bachiswap.com/ref=${referralCode}`}
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

export default SocialQuest;
