import { Box, Button, Flex, Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BachiBox from "../../components/bachiBox";
import { TonIcon } from "../../theme/components/icon";
import BachiIconImg from "../../assets/icons/bachi-logo.png";
import TaikoIconImg from "../../assets/icons/taiko-logo.png";
import TonAnimationImg from "../../assets/animation/image-animation.gif";
import BachiAnimationImg from "../../assets/animation/image-swap-animation.gif";
import StartModal from "./modals/startModal";
import { useAppContext } from "../../contexts";
import WalletModal from "./modals/walletModal";
import BachiBalanceAbouts from "./drawers/bachiBalanceAbouts";
import { APIClient } from "../../api";
import { convertAndDivide, formatTokenBalance } from "../../utils";
import { useIsConnectionRestored, useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import MiningBooster from "./drawers/miningBooster";
import TonWithDraw from "../../components/tonWithdraw";
import TaikoWithDraw from "../../components/taikoWithdraw";

export default function Home() {
  const rawAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();

  const {
    userToken,
    userInfo,
    fetchUser,
    isValidUser,
    drawerBachiBalanceVisibility,
    setDrawerBachiBalanceVisibility,
    drawerMiningBoosterVisibility,
    setDrawerMiningBoosterVisibility,
    setModalVisibility,
    drawerTonBalanceVisibility,
    setDrawerTonBalanceVisibility,
    drawerTaikoBalanceVisibility,
    setDrawerTaikoBalanceVisibility,
  } = useAppContext();
  const [bachiAmount, setBachiAmount] = useState(0);
  const [tonAmount, setTonAmount] = useState(0);
  const [bachiAmountSecond, setBachiAmountSecond] = useState(0);
  const [tonAmountSecond, setTonAmountSecond] = useState(0);
  const [bachiClaimedAmount, setBachiClaimedAmount] = useState(0);
  const [tonClaimedAmount, setTonClaimedAmount] = useState(0);

  const getFarmAmounts = async () => {
    try {
      const resp = await APIClient.getUserFarmSpeed({ userToken });
      if (resp?.success == true) {
        setBachiAmount(Number(resp?.data?.bachi_amount));
        setTonAmount(Number(resp?.data?.ton_amount));
        setBachiAmountSecond(Number(resp?.data?.bachi_speed));
        setTonAmountSecond(Number(resp?.data?.ton_speed));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isValidUser) {
      getFarmAmounts();
      setBachiClaimedAmount(Number(userInfo?.balance?.bachi || 0));
      setTonClaimedAmount(Number(userInfo?.balance?.ton || 0));
    }
  }, [isValidUser, userInfo, bachiClaimedAmount, tonClaimedAmount, connectionRestored]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isValidUser) {
        setBachiAmount(
          (prevBachiAmount) => prevBachiAmount + bachiAmountSecond
        );
        setTonAmount((prevTonAmount) => prevTonAmount + tonAmountSecond);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isValidUser,
    userInfo,
    bachiAmount,
    tonAmount,
    bachiAmountSecond,
    tonAmountSecond,
  ]);

  const listBox = [
    {
      title: "Ton Balance",
      amount: formatTokenBalance(convertAndDivide(tonClaimedAmount, 9), 9),
      icon: <TonIcon width="24px" height="24px" />,
      button: {
        text: "Withdraw",
        onClick: () => setDrawerTonBalanceVisibility(true),
      },
    },
    {
      title: "Bachi Balance",
      amount: formatTokenBalance(convertAndDivide(bachiClaimedAmount, 9), 9),
      icon: <Img src={BachiIconImg} maxW={"100%"} verticalAlign={"middle"} />,
      button: {
        text: "What is Bachi?",
        onClick: () => setDrawerBachiBalanceVisibility(true),
      },
    },
    {
      title: "TAIKO Balance",
      amount: 100,
      icon: <Img src={TaikoIconImg} maxW={"100%"} verticalAlign={"middle"} />,
      button: {
        text: "Withdraw",
        onClick: () => setDrawerTaikoBalanceVisibility(true),
      },
    },
  ];
  const [tab, setTab] = useState(0);
  const listMinning = [
    {
      title: "Ton Mining",
      icon: (
        <Img
          mt={"8px"}
          src={TonAnimationImg}
          w={{ base: "100px" }}
          maxW={"100%"}
          verticalAlign={"middle"}
        />
      ),
      amount: formatTokenBalance(convertAndDivide(tonAmount, 9), 9),
      farmSpeed: formatTokenBalance(convertAndDivide(tonAmountSecond, 9), 9),
      unitSpeed: "Ton/h",
      level: 1,
      hashrate: 1,
      currency: "TON",
      button: {
        text: "Upgrade miner",
      },
    },
    {
      title: "Bachi Mining",
      icon: (
        <Img
          mt={"8px"}
          src={BachiAnimationImg}
          w={{ base: "100px" }}
          maxW={"100%"}
          verticalAlign={"middle"}
        />
      ),
      amount: formatTokenBalance(convertAndDivide(bachiAmount, 9), 9),
      farmSpeed: formatTokenBalance(convertAndDivide(bachiAmountSecond, 9), 9),
      unitSpeed: "Bachi/h",
      level: 1,
      hashrate: 1,
      currency: "Bachi",
      button: {
        text: "Claim",
      },
    },
  ];

  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const handleClaim = async () => {
    const toastClaim = toast.loading("Claiming ...");
    setDisabled(true);
    let claimMode = 1;

    if (listMinning[tab].currency == "Bachi") {
      claimMode = 1;
    } else claimMode = 2;

    if (!rawAddress) {
      setMessage("You have not connected wallet");
      setIsLoading(false);
      setDisabled(false);
      toast.error("You have not connected wallet");
      toast.dismiss(toastClaim);
      return;
    }

    setIsLoading(true);
    try {
      const walletInfo = {
        address: rawAddress,
        name: wallet?.name,
        device: wallet?.device?.appName,
      };
      const claimFarmer = await APIClient.claimNode(
        userToken,
        walletInfo,
        claimMode
      ).then((response) => {
        setMessage("Claim free node successful");
        setIsLoading(false);
        setDisabled(false);
        toast.success("Claim free node successful");
      });

      await Promise.all([fetchUser(), getFarmAmounts()]);
    } catch (e) {
      setMessage(e.response.data.message);
      setIsLoading(false);
      setDisabled(false);
      toast.dismiss(toastClaim);
      toast.error(e.response.data.message);
      return;
    }
    toast.dismiss(toastClaim);
  };
  return (
    <>
      <Box w={"full"} h={"full"} overflow={"hidden"}>
        <Flex direction={"column"} gap={"12px"}>
          {/* list */}
          {listBox.map((item, index) => (
            <BachiBox padding={"8px 16px"} key={index}>
              <Flex justifyContent={"space-between"}>
                <Flex className="balance-info" gap={"8px"}>
                  <Flex
                    w={"38px"}
                    h={"38px"}
                    border={"1px solid var(--Primary-500)"}
                    borderRadius={"50%"}
                    bg={"var(--Black)"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {item.icon}
                  </Flex>
                  <Flex direction={"column"}>
                    <Box color={"var(--White)"}>
                      <Text fontSize={"14px"} fontWeight={"500"}>
                        {item.title}
                      </Text>
                    </Box>
                    <Box color={"var(--Primary-500)"}>
                      <Text fontSize={"14px"} fontWeight={"600"}>
                        {item.amount}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
                <Button
                  variant={"pink"}
                  padding={"10px 16px"}
                  minW={"128px"}
                  onClick={item.button.onClick}
                >
                  <Text className="text-btn">{item.button.text}</Text>
                </Button>
              </Flex>
            </BachiBox>
          ))}
          {/* minning box */}
          <BachiBox padding={"16px"} mt="32px" mb="258px">
            <Flex direction={"column"} align={"center"} w={"full"}>
              <Flex
                w={"full"}
                border={"0.5px solid var(--Grey-500)"}
                borderRadius={"24px"}
              >
                {listMinning.map((item, index) => (
                  <Box
                    key={index}
                    background={
                      tab === index ? "var(--Primary-500)" : "transparent"
                    }
                    w={"full"}
                    padding={"9px 16px"}
                    borderRadius={"24px"}
                    onClick={() => setTab(index)}
                    textAlign={"center"}
                    cursor={"pointer"}
                  >
                    <Text
                      className="text-btn"
                      color={tab === index ? "var(--White)" : "var(--Grey-300)"}
                    >
                      {item.title}
                    </Text>
                  </Box>
                ))}
              </Flex>
              {listMinning[tab].icon}
              <Flex gap={"8px"} fontSize={"20px"} fontWeight={"400"}>
                <Text color={"var(--White)"}>{listMinning[tab].amount}</Text>{" "}
                <Text color={"var(--Primary-500)"}>
                  {listMinning[tab].currency}
                </Text>
              </Flex>
              <Flex
                gap={"8px"}
                fontSize={"14px"}
                fontWeight={"400"}
                color={"var(--White)"}
              >
                <Text>
                  {"Speed"}: {listMinning[tab].farmSpeed * 3600}{" "}
                  {listMinning[tab].unitSpeed}
                </Text>{" "}
              </Flex>
              <Flex w={"full"} mt={"16px"} gap={"8px"}>
                <Button
                  variant={"white"}
                  w={"full"}
                  padding={"9px 16px"}
                  onClick={() => setDrawerMiningBoosterVisibility(true)}
                >
                  <Text className="text-btn">{listMinning[0].button.text}</Text>
                </Button>
                <Button
                  variant={"primary"}
                  w={"full"}
                  padding={"9px 16px"}
                  isDisabled={disabled}
                  isLoading={isLoading}
                  onClick={
                    rawAddress ? handleClaim : () => setModalVisibility(2)
                  }
                >
                  <Text className="text-btn">
                    {" "}
                    {!rawAddress
                      ? "Connect Wallet"
                      : listMinning[1].button.text}
                  </Text>
                </Button>
              </Flex>
            </Flex>
          </BachiBox>
        </Flex>
      </Box>
      {/* modal */}
      <StartModal />
      <WalletModal />
      <BachiBalanceAbouts
        isOpen={drawerBachiBalanceVisibility}
        onClose={() => setDrawerBachiBalanceVisibility(false)}
      />
      <MiningBooster
        isOpen={drawerMiningBoosterVisibility}
        onClose={() => setDrawerMiningBoosterVisibility(false)}
      />
      <TonWithDraw
        isOpen={drawerTonBalanceVisibility}
        onClose={() => setDrawerTonBalanceVisibility(false)}
      />
      <TaikoWithDraw
        isOpen={drawerTaikoBalanceVisibility}
        onClose={() => setDrawerTaikoBalanceVisibility(false)}
      />
    </>
  );
}
