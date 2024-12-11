import { Box, Flex, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CommonButton from "../button/commonbutton";
import MainButton from "../button/MainButton";
import { useAccount } from "wagmi";
import { config } from "../../components/wallets/config";
import toast from "react-hot-toast";
import iconNodedetail from "../../assets/img/node/icon-node-detail.png";
import node_manager_contract from "../../utils/contracts/node_manager_contract";
import { readContract } from "@wagmi/core";
import airDropComplete from "../../assets/img/airdrop/airdrop-complete.png";

import { useTranslation } from "react-i18next";
const QuestBox = ({
  title,
  rewardText,
  rewardTotal,
  claimText,
  buttonText,
  onClick,
  inputPlaceholder,
  handleTask,
  status = "pending",
  completeTask,
  isDisabled,
  task_id,
}) => {
  const { t } = useTranslation("airdrop");
  const { address } = useAccount();
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

  const loadTelegramWidget = () => {
    const container = document.getElementById("telegram-login");

    if (container) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", "Bachiswap_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "false");
      script.setAttribute("data-request-access", "write");
      script.setAttribute(
        "data-auth-url",
        `${process.env.REACT_APP_BACKEND_API}/api/telegram/callback?wallet=${address}&task_id=8`
      );

      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  };

  useEffect(() => {
    loadTelegramWidget();
  }, [address, task_id]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      alignItems="stretch"
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
      }}
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
        w={"100%"}
      >
        <Flex
          flexDirection={"column"}
          padding={{
            base: "24px 32px",
            lg: "16px 20px 16px 20px",
            xl: "24px 36px 24px 36px",
            "3xl": "32px 40px 40px 40px",
          }}
          gap={{ base: "24px", lg: "32px", "2xl": "22px", "3xl": "25px" }}
          height="100%"
          w={"100%"}
        >
          <Flex
            flexDirection={"column"}
            flex="1"
            justifyContent={"space-between"}
          >
            <Text
              py={{ base: "15px", "3xl": "24px" }}
              fontSize={{
                base: "20px",
                "3xl": "24px",
              }}
              fontFamily="var(--font-text-extra)"
            >
              {title}
            </Text>
            {rewardText && (
              <Flex alignItems={"center"} gap={{ base: "24px" }}>
                <Text
                  fontSize={{ "3xl": "20px" }}
                  color={"#646464"}
                  fontFamily="var(--font-text-main)"
                >
                  {rewardText}
                </Text>
                <MainButton
                  backgroundColor={"transparent"}
                  border={"2px solid #23F600"}
                  borderRadius={"20px"}
                  padding={"8px 16px"}
                  height={{ base: "40px" }}
                >
                  <Text color={"#23F600"} fontFamily="var(--font-text-main)">
                    {rewardTotal} TAIKO
                  </Text>
                </MainButton>
              </Flex>
            )}
            {claimText && status === "pending" && (
              <Text
                mt={"5px"}
                fontFamily="var(--font-text-main)"
                fontSize={{
                  base: "16px",
                  xl: "14px",
                  "2xl": "12px",
                  "3xl": "16px",
                }}
              >
                {claimText}
              </Text>
            )}
          </Flex>
          <Flex
            flexDirection={{ base: "column", lg: "row", xl: "column" }}
            gap={{ base: "24px" }}
            w={"100%"}
          >
            {inputPlaceholder && (
              <Box
                width="100%"
                border="1px solid #FCDDEC"
                padding="10px"
                position="relative"
                w={"100%"}
              >
                <Box
                  position="absolute"
                  top="-17px"
                  left={{ base: "20px", xl: "20px", "3xl": "50px" }}
                  width="fit-content"
                  padding="0 5px"
                  zIndex={1}
                >
                  <Box
                    width="100%"
                    height="2px" // Chiều cao giống với chiều cao border
                    backgroundColor="transparent"
                    clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                  />
                  <Text
                    backgroundColor="var(--color-background-popup)"
                    color="#FFFFFF"
                    fontSize={{ base: "16px", md: "16px", xl: "20px" }}
                    fontWeight={500}
                    fontFamily="var(--font-text-main)"
                  >
                    {t("My Referral")}
                  </Text>
                </Box>
                <Flex flexDirection={"column"} width={"100%"}>
                  {!referralCode ? (
                    <Text>{"---"}</Text>
                  ) : (
                    <ReferralCopier referralCode={referralCode} />
                  )}
                </Flex>
              </Box>
            )}
            {/* {status == "pending" &&
              (task_id != 8 ? (
                <MainButton
                  width={"100%"}
                  backgroundColor="var(--color-main)"
                  onClick={handleTask}
                  height={{ "3xl": "71px" }}
                  isDisabled={isDisabled}
                >
                  <Text
                    color={"#FFF"}
                    fontSize={"20px"}
                    lineHeight={{ base: "24px" }}
                    fontFamily="var(--font-text-main)"
                  >
                    {buttonText}
                  </Text>
                </MainButton>
              ) : address ? (
                <Box
                  id="telegram-login"
                  display={"flex"}
                  justifyContent={"center"}
                  alignContent={"center"}
                ></Box>
              ) : (
                <MainButton
                  width={"100%"}
                  backgroundColor="var(--color-main)"
                  onClick={handleTask}
                  height={{ "3xl": "71px" }}
                  isDisabled={isDisabled}
                >
                  <Text
                    color={"#FFF"}
                    fontSize={"20px"}
                    lineHeight={{ base: "24px" }}
                    fontFamily="var(--font-text-main)"
                  >
                    {"please connect wallet"}
                  </Text>
                </MainButton>
              ))} */}

            {status === "pending" && (
              <MainButton
                width={"100%"}
                backgroundColor="var(--color-main)"
                onClick={handleTask}
                height={{ "3xl": "71px" }}
                isDisabled={isDisabled}
              >
                <Text
                  color={"#FFF"}
                  fontSize={"20px"}
                  lineHeight={{ base: "24px" }}
                  fontFamily="var(--font-text-main)"
                >
                  {buttonText}
                </Text>
              </MainButton>
            )}

            {status === "success" && (
              <MainButton
                width={"100%"}
                backgroundColor="var(--color-main)"
                onClick={completeTask}
                height={{ "3xl": "71px" }}
                isDisabled={isDisabled}
              >
                <Text
                  color={"#FFF"}
                  fontSize={"20px"}
                  lineHeight={{ base: "24px" }}
                  fontFamily="var(--font-text-main)"
                >
                  {t("Claim reward")}
                </Text>
              </MainButton>
            )}
            {status === "completed" && (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                gap={"16px"}
              >
                <Text
                  fontSize={{ base: "", lg: "", "3xl": "32px" }}
                  fontWeight={400}
                  lineHeight={{ base: "", "3xl": "40px" }}
                  fontFamily="var(--font-text-main)"
                  color="#23F600"
                >
                  {t("Complete")}
                </Text>
                <Image src={airDropComplete} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </CommonButton>
    </Box>
  );
};

export default QuestBox;

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
        // maxWidth={{
        //   base: "290px",
        //   md: "450px",
        //   xl: "250px",
        //   "2xl": "340px",
        //   "3xl": "400px",
        // }}
        w={"100%"}
        overflow="hidden"
      >
        <Text
          fontSize={{ base: "14px", md: "20px" }}
          fontWeight={300}
          isTruncated
          maxWidth="100%"
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
