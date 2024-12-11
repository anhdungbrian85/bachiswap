import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
//import component
import { SpriteAnimator } from "react-sprite-animator";
import earninganimation from "../../../../assets/img/animation/test.png";
import animation from "../../../../assets/img/animation/image-animation.gif";
import SectionContainer from "../../../../components/container";
import { enumMenu } from "../../../../utils/contants";
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import CommonButton from "../../../../components/button/commonbutton";
//import image
import earningNode from "../../../../assets/img/node/earning-node.png";
import staking_contract from "../../../../utils/contracts/staking_contract";
import node_manager_contract from "../../../../utils/contracts/node_manager_contract";
import taiko_token_contract from "../../../../utils/contracts/taiko_token_contract";
import { useAccount, useReadContract } from "wagmi";
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
import { config } from "../../../../components/wallets/config";
import useInterval from "../../../../hooks/useInterval";
import {
  convertAndDivide,
  formatNumDynDecimal,
  formatTokenBalance,
} from "../../../../utils";
import MessageBox from "../../../../components/message/messageBox";
import { ERROR, FAIURE, PENDING, SUCCESS } from "../../../../utils/mesages";
import { getUserIpAddress } from "../../../../utils";
import { useModal } from "../../../../contexts/useModal";
import { taikoHeklaClient } from "../../../../components/wallets/viemConfig";
import { parseGwei, parseEther, parseUnits } from "viem";
import MainButton from "../../../../components/button/MainButton";

import { clientAPI } from "../../../../api/client";
import productCoreI5 from "../../../../assets/img/node/product-corei5.png";
import productCoreI7 from "../../../../assets/img/node/product-corei7.png";
import productCoreI9 from "../../../../assets/img/node/product-corei9.png";
import iconPower from "../../../../assets/img/node/icon-node-power.png";
import { useDispatch } from "react-redux";
import {
  selectBillNode,
  setCaller,
  setMessage,
  setNodeId,
  setPrice,
  setQty,
} from "../../../../store/slices/billNodeSlice";
import { base } from "viem/chains";
import { useTab } from "../../../../contexts/useTab";
import toast from "react-hot-toast";
import { delay, freeFarmeSpeed } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";

const stakingContract = {
  address: staking_contract.CONTRACT_ADDRESS,
  abi: staking_contract.CONTRACT_ABI,
};

const nodeManagerContract = {
  address: node_manager_contract.CONTRACT_ADDRESS,
  abi: node_manager_contract.CONTRACT_ABI,
};

const taikoTokenContract = {
  address: taiko_token_contract.CONTRACT_ADDRESS,
  abi: taiko_token_contract.CONTRACT_ABI,
};

const Earning = () => {
  const { t } = useTranslation("node");
  const oneHour = 3600;
  const { isConnected } = useAccount();
  const [tab, setTab] = useState(0);
  const [taikoAmount, setTaikoAmount] = useState(0);
  const [bachiAmount, setBachiAmount] = useState(0);
  const chains = getChains(config);
  const chainId = getChainId(config);
  const currentChain = chains.find((chain) => chain.id === chainId);
  const { address } = useAccount();
  const chainDecimal = currentChain?.nativeCurrency?.decimals;
  const chainSymbol = currentChain?.nativeCurrency?.symbol;
  //
  const [disabled, setDisabled] = useState(false);
  const { setConnectWalletModalVisible } = useModal();
  const onOpenConnectWalletModal = () => setConnectWalletModalVisible(true);
  //

  const [nodeIdArr, setNodeIdArr] = useState([]);
  const [taikoAmountSecond, setTaikoAmountSecond] = useState(0);
  const [bachiAmountSecond, setBachiAmountSecond] = useState(0);
  const [taikoClaimedAmount, setTaikoClaimedAmount] = useState(0);
  const [bachiClaimedAmount, setBachiClaimedAmount] = useState(0);
  const [freeFarmClaimedAmount, setFreeFarmClaimedAmount] = useState({
    bachi: 0,
    taiko: 0,
  });

  //******CheckNodeFree ********/
  const [disabledNode, setDisabledNode] = useState(false);
  const checkFarmerExist = async () => {
    try {
      const { data } = await clientAPI("post", "/api/freeFarmer/getFarmer", {
        wallet_address: address,
      });

      setDisabledNode(!!data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFarmAmounts = async () => {
    const currentTime = new Date().getTime();

    const [rewardData, freeFarmerData, totalNode] = await Promise.all([
      clientAPI("post", "/api/rewardAirdrop/getRewardAmountByUser", {
        caller: address,
      }),
      clientAPI("post", "/api/freeFarmer/getFarmer", {
        wallet_address: address,
      }),
      readContract(config, {
        ...stakingContract,
        functionName: "getTotalNodeStaked",
        args: [address],
      }),
    ]);
    // console.log({ totalNode });

    let bachiFreeAmount = 0;
    let taikoFreeAmount = 0;
    let bachiFreeSpeed = 0;
    let taikoFreeSpeed = 0;

    if (freeFarmerData?.data) {
      bachiFreeSpeed = freeFarmeSpeed.bachi;
      taikoFreeSpeed = freeFarmeSpeed.taiko;
      bachiFreeAmount =
        ((currentTime - freeFarmerData.data.bachiStartTime) / 1000) *
        bachiFreeSpeed;
      taikoFreeAmount =
        ((currentTime - freeFarmerData.data.taikoStartTime) / 1000) *
        taikoFreeSpeed;
    }

    if (rewardData?.data) {
      const stakeIds = await Promise.all(
        Array.from({ length: Number(totalNode) }, (_, i) =>
          readContract(config, {
            ...stakingContract,
            functionName: "getStakeIdByIndex",
            args: [address, i],
          })
        )
      );

      const stakeIdsNumeric = stakeIds.map(Number);
      setNodeIdArr(stakeIdsNumeric);

      const [bachiAmount, taikoAmount] = await readContract(config, {
        ...stakingContract,
        functionName: "getRewardAmountsIncremental",
        args: [stakeIdsNumeric],
      });

      setBachiAmount(Number(bachiAmount) + bachiFreeAmount);
      setTaikoAmount(Number(taikoAmount) + taikoFreeAmount);
      setBachiAmountSecond(rewardData.data.bachi || 0 + bachiFreeSpeed);
      setTaikoAmountSecond(rewardData.data.taiko || 0 + taikoFreeSpeed);
    }
  };

  const getClaimedAmount = async () => {
    const [claimedAmounts, farmerData] = await Promise.all([
      readContract(config, {
        ...stakingContract,
        functionName: "rewardClaimedInfors",
        args: [address],
      }),
      clientAPI("post", "/api/freeFarmer/getFarmer", {
        wallet_address: address,
      }),
    ]);

    const [bachiClaimed, taikoClaimed] = claimedAmounts;

    setFreeFarmClaimedAmount((prevState) => ({
      ...prevState,
      bachi: farmerData?.data?.bachiRewardAmount,
      taiko: farmerData?.data?.taikoRewardAmount,
    }));
    setBachiClaimedAmount(Number(bachiClaimed));
    setTaikoClaimedAmount(Number(taikoClaimed));
  };

  useEffect(() => {
    if (address) {
      checkFarmerExist();
      getClaimedAmount();
      getFarmAmounts();
    }
    if (!isConnected) {
      setDisabledNode(false);
    }
  }, [address, taikoClaimedAmount, bachiClaimedAmount, isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (address) {
        setBachiAmount(
          (prevBachiAmount) => prevBachiAmount + bachiAmountSecond
        );
        setTaikoAmount(
          (prevTaikoAmount) => prevTaikoAmount + taikoAmountSecond
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [address, bachiAmount, taikoAmount, bachiAmountSecond, taikoAmountSecond]);

  const mining = [
    {
      name: "Taiko",
      // speed: nodeData ? Number(nodeData[3]) : 0,
      level: "1",
      amount: formatTokenBalance(
        convertAndDivide(taikoAmount, chainDecimal),
        14
      ),
      farmSpeed: formatTokenBalance(
        convertAndDivide(taikoAmountSecond, chainDecimal),
        14
      ),
      unitSpeed: "Taiko/h",
    },
    {
      name: "Bachi",
      // speed: nodeData ? Number(nodeData[3]) : 0,
      level: "1",
      amount: formatTokenBalance(
        convertAndDivide(bachiAmount, chainDecimal),
        14
      ),
      farmSpeed: formatTokenBalance(
        convertAndDivide(bachiAmountSecond, chainDecimal),
        14
      ),
      unitSpeed: "Bachi/h",
    },
  ];
  const [showViewOnTaiko, setShowViewOnTaiko] = useState(false);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [txHash, setTxHash] = useState("");
  const handleCloseMessage = () => {
    setIsLoading(false);
    setStatus(null);
  };

  const handleClaim = async () => {
    setDisabled(true);
    let claimMode = 0;
    if (mining[tab].name == "Taiko") {
      claimMode = 1;
    } else claimMode = 0;
    const balance = await getBalance(config, {
      address: address,
    });
    if (!address) {
      setMessage(t("You have not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    setMessage(t(PENDING.txAwait));
    setStatus(null);
    setIsLoading(true);
    try {
      if (nodeIdArr.length > 0) {
        /**
         *  claim free node
         */
        const claimFarmer = await clientAPI(
          "post",
          "/api/freeFarmer/claimFreeFarmer",
          {
            wallet_address: address,
            mode: claimMode,
          }
        )
          .then(() => {
            toast.success(t("Claim free node successfully"));
          })
          .catch(() => {
            toast.error(t("Claim free node failed"));
          });
        await Promise.all([getClaimedAmount(), getFarmAmounts()]);

        /**
         * Check Condition
         */
        if (claimMode == 0) {
          const bachiMinClaimAmount = await readContract(config, {
            ...stakingContract,
            functionName: "bachiMinClaimAmount",
          });
          if (Number(bachiMinClaimAmount) > bachiAmount) {
            setMessage(t("The minimum quantity has not been reached"));
            setStatus(t("failure"));
            setIsLoading(true);
            setDisabled(false);
            return;
          }
        } else {
          const taikoMinClaimAmount = await readContract(config, {
            ...stakingContract,
            functionName: "taikoMinClaimAmount",
          });

          if (Number(taikoMinClaimAmount) > taikoAmount) {
            setMessage(t("The minimum quantity has not been reached"));
            setStatus(t("failure"));
            setIsLoading(true);
            setDisabled(false);
            return;
          }
        }

        /**
         * Check Condition
         */
        const ipAddress = await getUserIpAddress();
        const txObj = {
          ...stakingContract,
          functionName: "claimAllRewards",
          args: [nodeIdArr, claimMode],
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

        /**
         * Start transaction
         */
        const hash = await writeContract(config, {
          ...txObj,
        });
        // console.log({ hash });
        if (hash) {
          // console.log({ hash });
          setTxHash(hash);
          // // const status = await getTransactionStatus(config, hash);
          await clientAPI("post", "/api/transaction/create-transaction", {
            caller: address,
            chainId: chainId,
            hash: hash,
            type: "Claim reward",
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
            await Promise.all([getClaimedAmount(), getFarmAmounts()]);

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
      } else {
        const claimFarmer = await clientAPI(
          "post",
          "/api/freeFarmer/claimFreeFarmer",
          {
            wallet_address: address,
            mode: claimMode,
          }
        ).then(() => {
          setMessage(t("Claim free node successful"));
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
        });
        await Promise.all([getClaimedAmount(), getFarmAmounts()]);
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
  /****Node free ******/
  const dispatch = useDispatch();
  const products = [
    {
      tierId: 1,
      nameproduct: t("freemint"),
      power: null,
    },
    {
      tierId: 2,
      nameproduct: t("Corei5"),
      image: productCoreI5,
      power: "10 GH/s",
      reward: "50.000",
    },
    {
      tierId: 3,
      nameproduct: t("Corei7"),
      image: productCoreI7,
      power: "100 GH/s",
      reward: "100.000",
    },
    {
      tierId: 4,
      nameproduct: t("Corei9"),
      image: productCoreI9,
      power: "1000 GH/s",
      reward: "150.000",
    },
  ];
  const { setFarmTab, setMenuActive } = useTab();
  const [selectProduct, setselectProduct] = useState(products[0]);
  const handleProductSelect = (products) => {
    setselectProduct(products);
    // dispatch(setNodeId(products.tierId));
  };

  const handleOpenTab = () => {
    setFarmTab(1);
    window.scrollTo(0, 0);
    setMenuActive(enumMenu[0].name);
  };
  //*****Recaptcha ******/
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  const handleShowRecaptcha = () => {
    if (isConnected) {
      setShowRecaptcha(true);
    } else {
      setMessage(t("You have not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
    }
  };

  const handleRecaptcha = async (token) => {
    if (token) {
      setRecaptchaVerified(true);

      await handleBuyNodeFree();
      setShowRecaptcha(false);
    }
  };

  /***********PayNode*************/
  // const handlePayNow = async () => {
  //   setDisabled(true);
  //   let price = 0;
  //   if (!address) {
  //     setMessage("You have not connected wallet");
  //     setStatus("failure");
  //     setIsLoading(true);
  //     setDisabled(false);
  //     return;
  //   }

  //   const balance = await getBalance(config, {
  //     address: address,
  //   });

  //   const priceValue = parseUnits(String(price), chainDecimal);

  //   /***Get IP user ***/
  //   const ipAddress = await getUserIpAddress();
  //   const IPBlocked = await clientAPI(
  //     "get",
  //     `/api/transaction/check-ip?ip=${ipAddress}`
  //   );
  //   const isBlocked = IPBlocked?.blocked;

  //   // handle transaction
  //   const txObj = {
  //     ...nodeManagerContract,
  //     functionName: "multiBuyNode",
  //     args: [1, 0, "metadata", 0, 1, priceValue],
  //   };

  //   const [gasPrice, gasLimit] = await Promise.all([
  //     getGasPrice(config),
  //     taikoHeklaClient.estimateContractGas({
  //       ...txObj,
  //       account: address,
  //     }),
  //   ]);

  //   const gasFeeToEther = Number(gasLimit * gasPrice) / 10 ** chainDecimal;

  //   if (Number(balance.formatted) < gasFeeToEther) {
  //     setMessage(ERROR.notBalance);
  //     setStatus("failure");
  //     setIsLoading(true);
  //     setDisabled(false);
  //     return;
  //   }
  //   setMessage(PENDING.txAwait);
  //   setIsLoading(true);
  //   setStatus(null);

  //   if (isBlocked) {
  //     setMessage(FAIURE.ipBlocked);
  //     setStatus("failure");
  //     setIsLoading(true);
  //     setDisabled(false);
  //     return;
  //   }
  //   try {
  //     const hash = await writeContract(config, {
  //       ...txObj,
  //     });

  //     if (hash) {
  //       setTxHash(hash);
  //       console.log({ hash });
  //       // const status = await getTransactionStatus(config, hash);
  //       await clientAPI("post", "/api/transaction/create-transaction", {
  //         caller: address,
  //         chainId: chainId,
  //         hash: hash,
  //         type: "Buy node",
  //         ipAddress: ipAddress,
  //         status: "pending",
  //       });

  //       const result = await waitForTransactionReceipt(config, {
  //         hash: hash,
  //       });

  //       if (result?.status == "success") {
  //         // const status = await getTransactionStatus(config, hash);
  //         await clientAPI("post", "/api/transaction/update-transaction", {
  //           hash: hash,
  //           status: "success",
  //         });
  //         await checkFarmerExist();
  //         setMessage(SUCCESS.txBuySuccess);
  //         setStatus("success");
  //         setIsLoading(true);
  //         setDisabled(false);
  //         return;
  //       } else {
  //         // const status = await getTransactionStatus(config, hash);
  //         await clientAPI("post", "/api/transaction/update-transaction", {
  //           hash: hash,
  //           status: "failure",
  //         });
  //         setMessage(FAIURE.txFalure);
  //         setStatus("failure");
  //         setIsLoading(true);
  //         setDisabled(false);
  //         return;
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     setMessage(FAIURE.txFalure);
  //     setStatus("failure");
  //     setIsLoading(true);
  //     setDisabled(false);
  //     return;
  //   }
  // };

  const handleBuyNodeFree = async () => {
    try {
      setDisabled(true);
      if (!address) {
        setMessage(t("You have not connected wallet"));
        setStatus(t("failure"));
        setIsLoading(true);
        setDisabled(false);
        return;
      }

      setMessage(t(PENDING.txAwait));
      setIsLoading(true);
      setStatus(null);
      await delay(3000);
      const createFarmer = await clientAPI(
        "post",
        "/api/freeFarmer/createFreeFarmer",
        {
          wallet_address: address,
        }
      ).then(() => {
        setMessage(t(SUCCESS.txBuySuccess));
        setStatus(t("success"));
        setIsLoading(true);
        setDisabled(false);
      });
      await Promise.all([checkFarmerExist(), getFarmAmounts()]);
    } catch (e) {
      console.log(e);
      setMessage(t(FAIURE.txFalure));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
  };

  const withdrawBachiBalance = async () => {
    if (!address) {
      setMessage(t("You have not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    if (Number(bachiClaimedAmount) == 0) {
      setMessage(t("Not bachi reward"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const bachiMinWithdrawAmount = await readContract(config, {
      ...stakingContract,
      functionName: "bachiMinWithdrawAmount",
    });

    if (Number(bachiClaimedAmount) < Number(bachiMinWithdrawAmount)) {
      setMessage(t("Withdraw amount is too small"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();

    // handle transaction
    const txObj = {
      ...stakingContract,
      functionName: "withdrawBachiReward",
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
      setMessage(t(ERROR.notBalance));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
    setMessage(t(PENDING.txAwait));
    setIsLoading(true);
    setStatus(null);

    try {
      const approveHash = await writeContract(config, {
        ...txObj,
      });

      if (approveHash) {
        console.log({ approveHash });
        // const status = await getTransactionStatus(config, approveHash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: approveHash,
          type: "Withdraw Bachi",
          ipAddress: ipAddress,
          status: "pending",
        });
        const result = await waitForTransactionReceipt(config, {
          hash: approveHash,
        });

        if (result?.status == "success") {
          // // const status = await getTransactionStatus(config, approveHash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: approveHash,
            status: "success",
          });
          setMessage(t("Claim successful"));
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
          await Promise.all([getClaimedAmount(), getFarmAmounts()]);

          return;
        } else {
          setMessage(t(FAIURE.txFalure));
          setStatus(t("failure withdraw"));
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

  const withdrawTaikoBalance = async () => {
    if (!address) {
      setMessage(t("You have not connected wallet"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    if (Number(taikoClaimedAmount) == 0) {
      setMessage(t("Not taiko reward"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const taikoMinWithdrawAmount = await readContract(config, {
      ...stakingContract,
      functionName: "taikoMinWithdrawAmount",
    });

    if (Number(taikoClaimedAmount) < Number(taikoMinWithdrawAmount)) {
      setMessage(t("Withdraw amount is too small"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const contractBalance = await getBalance(config, {
      address: stakingContract.address,
      token: taikoTokenContract.address,
    });
    const stakingTaikoBalance = parseUnits(
      contractBalance.formatted,
      chainDecimal
    );

    if (Number(stakingTaikoBalance) < Number(taikoClaimedAmount)) {
      setMessage(t("Not enough balance"));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }

    const balance = await getBalance(config, {
      address: address,
    });

    const ipAddress = await getUserIpAddress();

    // handle transaction
    const txObj = {
      ...stakingContract,
      functionName: "withdrawTaikoReward",
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
      setMessage(t(ERROR.notBalance));
      setStatus(t("failure"));
      setIsLoading(true);
      setDisabled(false);
      return;
    }
    setMessage(t(PENDING.txAwait));
    setIsLoading(true);
    setStatus(null);

    try {
      const approveHash = await writeContract(config, {
        ...txObj,
      });

      if (approveHash) {
        console.log({ approveHash });
        // const status = await getTransactionStatus(config, approveHash);
        await clientAPI("post", "/api/transaction/create-transaction", {
          caller: address,
          chainId: chainId,
          hash: approveHash,
          type: "Withdraw Taiko",
          ipAddress: ipAddress,
          status: "pending",
        });
        const result = await waitForTransactionReceipt(config, {
          hash: approveHash,
        });

        if (result?.status == "success") {
          // const status = await getTransactionStatus(config, approveHash);
          await clientAPI("post", "/api/transaction/update-transaction", {
            hash: approveHash,
            status: "success",
          });
          setMessage(t("Claim successful"));
          setStatus(t("success"));
          setIsLoading(true);
          setDisabled(false);
          await Promise.all([getClaimedAmount(), getFarmAmounts()]);
          return;
        } else {
          setMessage(t(FAIURE.txFalure));
          setStatus(t("failure withdraw"));
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

  return (
    <>
      <SectionContainer padding={"0px"}>
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          paddingTop={{ base: "28px", "2xl": "108px" }}
        >
          <Flex
            w={"100%"}
            direction={{ base: "column", md: "row" }}
            gap={{ base: "36px", md: "24px" }}
            paddingBottom={{ base: "40px", md: "48px" }}
            wrap={"wrap"}
            justifyContent={"space-between"}
          >
            <Box
              maxW={{ base: "unset", md: "calc(50% - 12px)" }}
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
                "@media (max-width: 768px)": {
                  clipPath:
                    "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                  "::before": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                  "::after": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                },
              }}
              padding={{
                base: "24px 24px 21.76px 24px",
                lg: "24px 28px 32px 32px",
                "3xl": "40px 40px 56px 68px",
              }}
              boxShadow={"inset 0 0 10px var(--color-main)"}
              border="0.5px solid var(--color-main)"
              width={{
                base: "100%",
                sm: "100%",
                md: "70%",
                xl: "50%",
                "2xl": "50%",
              }}
            >
              <Flex flexDirection={"column"} gap={"24px"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={{ base: "15px", md: "30px" }}
                >
                  <Text
                    fontWeight={400}
                    fontFamily="var(--font-text-extra)"
                    color="var(--color-main)"
                    fontSize={{ base: "24px", "3xl": "72px" }}
                  >
                    {t("titleBachiEarning")}
                  </Text>
                  <MainButton
                    height={{ base: "44px", xl: "64px", "3xl": "80px" }}
                    backgroundColor={disabled ? "#B51F66" : "var(--color-main)"}
                    isDisabled={disabled}
                    padding={{
                      base: "16px 36px",
                      xl: "16px 36px 16px 36px",
                    }}
                    color="white"
                    borderRadius={"8px !important"}
                    onClick={() => withdrawBachiBalance()}
                  >
                    <Text
                      fontSize={{ base: "18px", "2xl": "24px" }}
                      fontWeight={400}
                      fontFamily={"var(--font-text-main)"}
                    >
                      {t("btnWithdraw")}
                    </Text>
                  </MainButton>
                </Flex>
                <Text
                  lineHeight={{ base: "32px" }}
                  fontSize={{ base: "24px", lg: "32px", "3xl": "72px" }}
                  fontWeight={700}
                  fontFamily={"var(--font-text-main)"}
                >
                  {formatTokenBalance(
                    convertAndDivide(bachiClaimedAmount, chainDecimal)
                  )}
                </Text>
              </Flex>
            </Box>

            <Box
              maxW={{ base: "unset", md: "calc(50% - 12px)" }}
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
                "@media (max-width: 768px)": {
                  clipPath:
                    "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                  "::before": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                  "::after": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                },
              }}
              padding={{
                base: "24px 24px 21.76px 24px",
                lg: "24px 28px 32px 32px",
                "3xl": "40px 40px 56px 68px",
              }}
              border="0.5px solid var(--color-main)"
              boxShadow={"inset 0 0 10px var(--color-main)"}
              width={{
                base: "100%",
                sm: "100%",
                md: "70%",
                xl: "50%",
                "2xl": "50%",
              }}
            >
              <Flex flexDirection={"column"} gap={"24px"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={{ base: "15px", "2xl": "30px" }}
                >
                  <Text
                    fontSize={{ base: "24px", "3xl": "72px" }}
                    fontWeight={400}
                    fontFamily="var(--font-text-extra)"
                    color="var(--color-main)"
                  >
                    {t("titleTaikoEarning")}
                  </Text>
                  <MainButton
                    height={{ base: "44px", xl: "64px", "3xl": "80px" }}
                    backgroundColor={disabled ? "#B51F66" : "var(--color-main)"}
                    isDisabled={disabled}
                    padding={{
                      base: "16px 36px",
                      xl: "16px 36px 16px 36px",
                    }}
                    color="white"
                    borderRadius={"8px !important"}
                    onClick={() => withdrawTaikoBalance()}
                  >
                    <Text
                      fontSize={{ base: "18px", "2xl": "24px" }}
                      fontWeight={400}
                      fontFamily={"var(--font-text-main)"}
                    >
                      {t("btnWithdraw")}
                    </Text>
                  </MainButton>
                </Flex>
                <Text
                  lineHeight={{ base: "32px" }}
                  fontSize={{ base: "24px", lg: "32px", "3xl": "72px" }}
                  fontWeight={700}
                  fontFamily={"var(--font-text-main)"}
                >
                  {formatTokenBalance(
                    convertAndDivide(taikoClaimedAmount, chainDecimal)
                  )}
                </Text>
              </Flex>
            </Box>

            <Box
              maxW={{ base: "unset", md: "calc(50% - 12px)" }}
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
                "@media (max-width: 768px)": {
                  clipPath:
                    "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                  "::before": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                  "::after": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                },
              }}
              padding={{
                base: "24px 24px 21.76px 24px",
                lg: "24px 28px 32px 32px",
                "3xl": "40px 40px 56px 68px",
              }}
              border="0.5px solid var(--color-main)"
              boxShadow={"inset 0 0 10px var(--color-main)"}
              width={{
                base: "100%",
                sm: "100%",
                md: "70%",
                xl: "50%",
                "2xl": "50%",
              }}
            >
              <Flex flexDirection={"column"} gap={"24px"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={{ base: "15px", "2xl": "30px" }}
                >
                  <Text
                    fontSize={{ base: "24px", "3xl": "72px" }}
                    fontWeight={400}
                    fontFamily="var(--font-text-extra)"
                    color="var(--color-main)"
                  >
                    {t("titleBachiEarningFree")}
                  </Text>
                  <MainButton
                    height={{ base: "44px", xl: "64px", "3xl": "80px" }}
                    backgroundColor={disabled ? "#B51F66" : "var(--color-main)"}
                    isDisabled={true}
                    padding={{
                      base: "16px 36px",
                      xl: "16px 36px 16px 36px",
                    }}
                    color="white"
                    borderRadius={"8px !important"}
                    onClick={() => withdrawTaikoBalance()}
                  >
                    <Text
                      fontSize={{ base: "18px", "2xl": "24px" }}
                      fontWeight={400}
                      fontFamily={"var(--font-text-main)"}
                    >
                      {t("btnWithdraw")}
                    </Text>
                  </MainButton>
                </Flex>
                <Text
                  lineHeight={{ base: "32px" }}
                  fontSize={{ base: "24px", lg: "32px", "3xl": "72px" }}
                  fontWeight={700}
                  fontFamily={"var(--font-text-main)"}
                >
                  {formatTokenBalance(
                    convertAndDivide(freeFarmClaimedAmount.bachi, chainDecimal)
                  )}
                </Text>
              </Flex>
            </Box>

            <Box
              maxW={{ base: "unset", md: "calc(50% - 12px)" }}
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
                "@media (max-width: 768px)": {
                  clipPath:
                    "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                  "::before": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                  "::after": {
                    width: "40px",
                    height: "40px",
                    backgroundColor: "pink.500",
                  },
                },
              }}
              padding={{
                base: "24px 24px 21.76px 24px",
                lg: "24px 28px 32px 32px",
                "3xl": "40px 40px 56px 68px",
              }}
              border="0.5px solid var(--color-main)"
              boxShadow={"inset 0 0 10px var(--color-main)"}
              width={{
                base: "100%",
                sm: "100%",
                md: "70%",
                xl: "50%",
                "2xl": "50%",
              }}
            >
              <Flex flexDirection={"column"} gap={"24px"}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={{ base: "15px", "2xl": "30px" }}
                >
                  <Text
                    fontSize={{ base: "24px", "3xl": "72px" }}
                    fontWeight={400}
                    fontFamily="var(--font-text-extra)"
                    color="var(--color-main)"
                  >
                    {t("titleTaikoEarningFree")}
                  </Text>
                  <MainButton
                    height={{ base: "44px", xl: "64px", "3xl": "80px" }}
                    backgroundColor={disabled ? "#B51F66" : "var(--color-main)"}
                    isDisabled={true}
                    padding={{
                      base: "16px 36px",
                      xl: "16px 36px 16px 36px",
                    }}
                    color="white"
                    borderRadius={"8px !important"}
                    onClick={() => withdrawTaikoBalance()}
                  >
                    <Text
                      fontSize={{ base: "18px", "2xl": "24px" }}
                      fontWeight={400}
                      fontFamily={"var(--font-text-main)"}
                    >
                      {t("btnWithdraw")}
                    </Text>
                  </MainButton>
                </Flex>
                <Text
                  lineHeight={{ base: "32px" }}
                  fontSize={{ base: "24px", lg: "32px", "3xl": "72px" }}
                  fontWeight={700}
                  fontFamily={"var(--font-text-main)"}
                >
                  {formatTokenBalance(
                    convertAndDivide(freeFarmClaimedAmount.taiko, chainDecimal)
                  )}
                </Text>
              </Flex>
            </Box>
          </Flex>

          <SimpleGrid
            columns={{ base: 1, md: 2, "2xl": 4 }}
            width={"100%"}
            gap={{ base: "16px" }}
            flexDirection={{ base: "column", md: "row" }}
            paddingBottom={{ base: "24px", xl: "48px", "3xl": "64px" }}
            alignItems={"stretch"}
          >
            {products.map((products) => (
              <Box
                flex={"1"}
                key={products.tierId}
                width={"100%"}
                onClick={() => handleProductSelect(products)}
                sx={{
                  backdropFilter: "blur(10px) !important",
                  backgroundColor:
                    selectProduct?.tierId === products.tierId
                      ? "rgba(228, 36, 147, 0.4)"
                      : "transparent",
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
                  "@media (max-width: 768px)": {
                    clipPath:
                      "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                    "::before": {
                      width: "40px",
                      height: "40px",
                      backgroundColor: "pink.500",
                    },
                    "::after": {
                      width: "40px",
                      height: "40px",
                      backgroundColor: "pink.500",
                    },
                  },
                }}
              >
                <Box
                  height={"100%"}
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
                    "@media (max-width: 768px)": {
                      clipPath:
                        "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                      "::before": {
                        width: "40px",
                        height: "40px",
                        backgroundColor: "pink.500",
                      },
                      "::after": {
                        width: "40px",
                        height: "40px",
                        backgroundColor: "pink.500",
                      },
                    },
                  }}
                  backgroundColor={"rgba(27, 27, 27, 0.20)"}
                  boxShadow={"inset 0 0 10px var(--color-main)"}
                  border="0.5px solid var(--color-main)"
                  position="relative"
                  zIndex="10"
                >
                  <Flex
                    height={"100%"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    padding={{
                      base: "16px 36px",
                      "3xl": "24px 40px 32px 40px",
                    }}
                    justifyContent={"space-between"}
                    gap={{ base: "16px" }}
                  >
                    <Flex
                      width={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Flex
                        justifyContent={"space-around"}
                        height={"100%"}
                        width={"100%"}
                        flexDirection={"column"}
                        alignItems={{
                          base: "start",
                        }}
                        gap={{ base: "10px", "3xl": "24px" }}
                      >
                        <Text
                          fontSize={{
                            base: "32px",
                            "2xl": "30px",
                            "3xl": "48px",
                          }}
                          fontWeight={700}
                          fontFamily={{
                            base: "var(--font-text-main)",
                            md: "var(--font-heading)",
                          }}
                        >
                          {products.nameproduct}
                        </Text>
                        <Flex alignItems={"center"} gap={"16px"}>
                          <Text
                            letterSpacing={"-1px"}
                            fontSize={{
                              base: "24px",
                              "2xl": "18px",
                              "3xl": "30px",
                            }}
                            fontWeight={400}
                            fontFamily={{
                              base: "var(--font-text-main)",
                              md: "var(--font-heading)",
                            }}
                          >
                            {products.power}
                          </Text>
                          {products?.power && (
                            <Image
                              src={iconPower}
                              paddingTop={"5px"}
                              height={{ base: "25px" }}
                            />
                          )}
                        </Flex>
                      </Flex>
                      <Image
                        src={products.image}
                        height={{
                          base: "96px",
                          md: "100px",
                          lg: "96px",
                          xl: "120px",
                          "2xl": "88px",
                          "3xl": "128px",
                        }}
                      />
                    </Flex>
                    {showRecaptcha && products.tierId == 1 && (
                      <ReCAPTCHA
                        sitekey={`${process.env.REACT_APP_RECAPTCHA_KEY}`}
                        onChange={handleRecaptcha}
                      />
                    )}
                    <MainButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (products.tierId == 1) {
                          handleShowRecaptcha();
                        } else handleOpenTab();
                      }}
                      height={{ base: "", lg: "40px", "3xl": "56px" }}
                      width={"100%"}
                      backgroundColor={
                        disabled ? "#B51F66" : "var(--color-main)"
                      }
                      isDisabled={products.tierId == 1 && disabledNode}
                      color="#FFF"
                    >
                      <Text
                        fontFamily="var(--font-text-main)"
                        fontSize={{ base: "", lg: "16px" }}
                      >
                        {products.tierId == 1 && disabledNode
                          ? t("Earned")
                          : t("StartEarning")}
                      </Text>
                    </MainButton>
                  </Flex>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          <Box
            border="0.5px solid #FCDDEC"
            width={{
              base: "100%",
            }}
            backgroundColor="var(--color-background-footer)"
            sx={{
              backdropFilter: "blur(10px) !important",
              clipPath:
                "polygon(0 30px, 30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)",
              "::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "30px",
                height: "30px",
                backgroundColor: "#FCDDEC",
                clipPath: "polygon(0 100%, 100% 0, 0 0)",
              },
              "::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "30px",
                height: "30px",
                backgroundColor: "#FCDDEC",
                clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
              },
            }}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              padding={{
                base: "40px 24px 32px 24px",
                md: "64px 56px",
                "3xl": "88px 244px",
              }}
              gap={"16px"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                width="100%"
                justifyContent={"space-around"}
                gap={{ base: "8px", lg: "16px" }}
              >
                <MainButton
                  borderRadius={{ base: "8px" }}
                  width={"100%"}
                  backgroundColor={tab == 0 ? "var(--color-main)" : "#FCDDEC"}
                  color={tab == 0 ? "#FFF" : "#040926"}
                  padding={{
                    base: "16px 36px",
                  }}
                  onClick={() => setTab(0)}
                  height={{ base: "44px", md: "54px", "3xl": "88px" }}
                >
                  <Text
                    fontSize={{ base: "14px", lg: "24px", "3xl": "32px" }}
                    fontWeight={400}
                    textAlign={"center"}
                    fontFamily={"var(--font-text-main)"}
                  >
                    {t("TAIKOMining")}
                  </Text>
                </MainButton>
                <MainButton
                  borderRadius={{ base: "8px" }}
                  width={"100%"}
                  padding={{
                    base: "16px 36px",
                  }}
                  backgroundColor={tab == 1 ? "var(--color-main)" : "#FCDDEC"}
                  color={tab == 1 ? "#FFF" : "#040926"}
                  onClick={() => setTab(1)}
                  height={{ base: "44px", md: "54px", "3xl": "88px" }}
                >
                  <Text
                    fontSize={{ base: "14px", lg: "24px", "3xl": "32px" }}
                    fontWeight={400}
                    textAlign={"center"}
                    fontFamily={"var(--font-text-main)"}
                  >
                    {t("BACHIMining")}
                  </Text>
                </MainButton>
              </Box>
              {/* <SpriteAnimator
                sprite={earninganimation}
                width={300}
                height={300}
                fps={30}
                scale={1}
                // shouldAnimate={true}
              /> */}
              <Image src={animation} w={{ base: "224px", md: "596px" }} />
              <Text
                fontSize={{ base: "20px", md: "48px", "3xl": "72px" }}
                fontWeight={700}
                fontFamily={"var(--font-heading)"}
                color="var(--color-main)"
              >
                {mining[tab].amount} {mining[tab].name}
              </Text>
              {/* <Text
                fontSize={{ base: "16px", md: "32px" }}
                fontWeight={500}
                fontFamily={"var(--font-text-main)"}
              >
                Level {mining[tab].level}: {mining[tab].speed} GH/s
              </Text> */}
              <Text
                fontSize={{ base: "16px", md: "32px" }}
                fontWeight={500}
                fontFamily={"var(--font-text-main)"}
              >
                {t("Speed")}: {mining[tab].farmSpeed * oneHour}{" "}
                {mining[tab].unitSpeed}
              </Text>
              <Flex
                mt={"48px"}
                alignItems={"stretch"}
                justifyContent={"space-between"}
                gap={"10px"}
                width={"100%"}
              >
                <MainButton
                  onClick={handleOpenTab}
                  backgroundColor="#FCDDEC"
                  width={"50%"}
                  display={"flex"}
                  justifyContent={"center"}
                  padding="16px 36px"
                  height={{ base: "44px", lg: "54px", "3xl": "88px" }}
                >
                  <Flex alignItems={"center"}>
                    <Text
                      color={"#000"}
                      fontSize={{ base: "14px", md: "24px" }}
                      fontWeight={500}
                      fontFamily={"var(--font-text-main)"}
                    >
                      {t("Upgrademiner")}
                    </Text>
                  </Flex>
                </MainButton>
                <MainButton
                  width={"50%"}
                  display={"flex"}
                  justifyContent={"center"}
                  padding="16px 36px"
                  height={{ base: "44px", lg: "54px", "3xl": "88px" }}
                  onClick={address ? handleClaim : onOpenConnectWalletModal}
                  backgroundColor={disabled ? "#B51F66" : "var(--color-main)"}
                  isDisabled={disabled}
                >
                  <Text
                    textAlign={"center"}
                    fontSize={{ base: "14px", md: "24px" }}
                    fontWeight={400}
                    color={"white"}
                    fontFamily={"var(--font-text-main)"}
                  >
                    {address ? t("Claim") : t("Connectwallet")}
                  </Text>
                </MainButton>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </SectionContainer>

      {/* Message */}
      <MessageBox
        showViewOnTaiko={showViewOnTaiko}
        isLoading={isLoading}
        status={status}
        message={message}
        handleCloseMessage={handleCloseMessage}
        txHash={txHash}
      />
    </>
  );
};

export default Earning;
