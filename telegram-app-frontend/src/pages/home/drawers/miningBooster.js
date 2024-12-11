import React, { useEffect, useState } from "react";
import BachiDrawer from "../../../components/drawers";
import {
  Box,
  Button,
  Flex,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import BachiBox from "../../../components/bachiBox";
import miningConfig from "../../../utils/miningConfig.json";
import Node1Img from "../../../assets/node1.png";
import Node2Img from "../../../assets/node2.png";
import Node3Img from "../../../assets/node3.png";
import { RocketIcon } from "../../../theme/components/icon";
import { convertAndDivide, delay, formatTokenBalance } from "../../../utils";
import {
  useTonConnectUI,
  useTonAddress,
  useTonWallet,
  useTonConnectModal,
  useIsConnectionRestored,
} from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../../contexts";
import { APIClient } from "../../../api";

export default function MiningBooster({ onClose, isOpen }) {
  const { state: modalState, open: openModal, close } = useTonConnectModal();
  const connectionRestored = useIsConnectionRestored();
  const { userToken, setModalVisibility, userInfo } = useAppContext();
  const boosterConfig = miningConfig.boosterConfig;
  const [count, setCount] = useState(1);
  const [boosterId, setBoosterId] = useState(1);
  const [booster, setBooster] = useState(boosterConfig[1]);
  const [price, setPrice] = useState(boosterConfig[1]?.price * count);
  const [speed, setSpeed] = useState({
    bachi: boosterConfig[1]?.speed.bachi,
    ton: boosterConfig[1]?.speed.ton,
  });
  const listBooster = [
    {
      nodeTierId: boosterConfig[1].nodeTierId,
      name: boosterConfig[1].name,
      price: boosterConfig[1].price,
      Hashrate: boosterConfig[1].Hashrate,
      img: Node1Img,
    },
    {
      nodeTierId: boosterConfig[2].nodeTierId,
      name: boosterConfig[2].name,
      price: boosterConfig[2].price,
      Hashrate: boosterConfig[2].Hashrate,
      img: Node2Img,
    },
    {
      nodeTierId: boosterConfig[3].nodeTierId,
      name: boosterConfig[3].name,
      price: boosterConfig[3].price,
      Hashrate: boosterConfig[3].Hashrate,
      img: Node3Img,
    },
  ];

  const handleBoosterChange = (id) => {
    setBoosterId(id);
    setBooster(boosterConfig[id]);
    setCount(1);
  };

  useEffect(() => {
    if (booster) {
      setPrice(booster?.price * count);
      setSpeed({
        bachi: booster?.speed.bachi * count,
        ton: booster?.speed.ton * count,
      });
    }
  }, [booster, count]);

  const boosterPayments = [
    {
      title: "Mining power",
      active: false,
      content: `${booster.Hashrate} GH/s`,
    },
    {
      title: "Rent Price",
      active: false,
      content: `${formatTokenBalance(
        convertAndDivide(booster.price, 9),
        9
      )} TON`,
    },
    {
      title: "30 days profit",
      active: true,
      content: `${formatTokenBalance(
        convertAndDivide(speed.ton * 86400 * 30, 9),
        9
      )} TON`,
    },
    {
      title: "Daily",
      active: true,
      content: `${formatTokenBalance(
        convertAndDivide(speed.ton * 86400, 9),
        9
      )} TON`,
    },
    {
      title: "Bachi Reward",
      active: false,
      content: `${formatTokenBalance(
        convertAndDivide(speed.bachi * 86400, 9),
        9
      )} BACHI`,
    },
  ];

  const rawAddress = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [referralCodeValue, setReferralCodeValue] = useState("");
  const handleReferralChange = (e) => {
    setReferralCodeValue(e.target.value);
  };

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyBoost = async () => {
    if (price <= 0) {
      toast.error("Invalid price");
      return;
    }

    if (!rawAddress) {
      toast.error("You have not connected wallet");
      return;
    }

    setIsDisabled(true);
    setIsLoading(true);

    const resp = await APIClient.getPayloadByCode({
      userToken,
      comment: {
        id: userInfo?.id,
        nodeTierId: boosterId, // number
        qty: count, // number
        referral: referralCodeValue, // string
      },
    });
    if (resp?.success == false) {
      setIsDisabled(false);
      setIsLoading(false);
      toast.error("Playload errr");
      return;
    }

    const payloadObject = resp?.data;

    try {
      const buyBoostTnx = {
        validUntil: Math.floor(Date.now() / 1000) + 120, // 120 sec
        messages: [
          {
            address: miningConfig.boosterReceiver,
            // amount: price.toString(),
            amount: "1000000",
            payload: payloadObject.payload,
            comment: payloadObject.comment,
          },
        ],
      };
      console.log("buyBoostTnx", buyBoostTnx);
      const resp = await tonConnectUI.sendTransaction(buyBoostTnx);
      console.log("resp", resp);

      if (resp?.boc) {
        toast.promise(
          delay(30000).then(() => {
            console.log("load data...");
            // refetch();
          }),
          {
            loading: "Please waiting for the TX finalize...",
            success: "Refetching...",
            error: "Something wrong !!!.",
          }
        );
      } else {
        toast.error("Transaction Failed");
      }
    } catch (error) {
      toast.error("Something wrong", error);
    }
    setIsDisabled(false);
    setIsLoading(false);
  };
  return (
    <BachiDrawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
      <BachiBox padding="20px">
        <Flex color={"var(--White)"} direction={"column"} gap={"16px"}>
          <Text fontSize={"20px"} fontWeight={"600"} textAlign={"center"}>
            BACHI
          </Text>
          <Box
            padding={"16px 14px"}
            color={"var(--Black)"}
            bg={"var(--Primary-100)"}
            borderRadius={"8px"}
            textAlign={"center"}
          >
            <Text fontSize={"14px"} fontWeight={"500"} lineHeight={"20px"}>
              Here you can rent mining power for 30 days. The investment
              profitability is{" "}
              <span
                style={{
                  color: "var(--Primary-600)",
                }}
              >
                4.87%
              </span>{" "}
              per day and{" "}
              <span
                style={{
                  color: "var(--Primary-600)",
                }}
              >
                146%
              </span>{" "}
              for 30 days.
            </Text>
          </Box>
          <Text fontSize={"16px"} fontWeight={"600"} textAlign={"center"}>
            Choose your configuration
          </Text>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            {listBooster.map((item, index) => {
              const id = index + 1;
              return (
                <Flex
                  onClick={() => handleBoosterChange(id)}
                  key={index}
                  cursor={"pointer"}
                  direction="column"
                  align="center"
                  textAlign="center"
                  minW="104px"
                  height="140px"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "12px",
                    padding: "2px", // Thickness of the border
                    background:
                      boosterId == item.nodeTierId
                        ? "var(--border-image-200)"
                        : "var(--border-image-100)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    zIndex: 0,
                  }}
                  borderRadius="12px"
                  zIndex={1}
                  padding={"8px 0px"}
                  justifyContent={"space-between"}
                  bg={
                    boosterId == item.nodeTierId
                      ? "var(--bg-liner)"
                      : "var(--Background)"
                  }
                >
                  <Text
                    color={
                      boosterId == item.nodeTierId
                        ? "var(--White)"
                        : "var(--Primary-500)"
                    }
                    fontSize={"16px"}
                    fontWeight={"600"}
                    textAlign={"center"}
                  >
                    {item.name}
                  </Text>
                  <Img src={item.img} maxW={"100%"} verticalAlign={"middle"} />
                  <Flex gap={"4px"} alignItems={"center"}>
                    <Text
                      color={
                        boosterId == item.nodeTierId
                          ? "var(--Primary-100)"
                          : "var(--Primary-500)"
                      }
                      fontSize={"12px"}
                      fontWeight={"400"}
                      textAlign={"center"}
                    >
                      {`${item.Hashrate} Gh/s`}
                    </Text>
                    <RocketIcon
                      width="14px"
                      height="14px"
                      color={
                        boosterId == item.nodeTierId
                          ? "var(--Primary-100)"
                          : "#DF2B82"
                      }
                    />
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
          <Flex fontSize={"14px"} gap={"16px"} direction={"column"}>
            {boosterPayments.map((item, index) => {
              return (
                <Flex
                  key={index}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  fontWeight={item.active ? "600" : "400"}
                  color={item.active && "var(--Primary-500)"}
                >
                  <Text>{item.title}</Text>
                  <Text>{item.content}</Text>
                </Flex>
              );
            })}
          </Flex>
          <Input
            type="text"
            value={referralCodeValue}
            onChange={handleReferralChange}
            placeholder="Input Ref code..."
            borderColor={"var(--Primary-500)"}
          />
          <InputGroup>
            <InputLeftElement>
              <Flex
                cursor={"pointer"}
                borderRadius={"50%"}
                w={"24px"}
                height={"24px"}
                bg={"var(--White)"}
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => {
                  if (count > 1) setCount((prevCount) => prevCount - 1);
                }}
              >
                <Text color={"var(--Primary-500)"}>-</Text>
              </Flex>
            </InputLeftElement>
            <Input
              type="number"
              min={1}
              textAlign={"center"}
              value={count}
              borderColor={"var(--Primary-500)"}
              onChange={(e) => setCount(Number(e.target.value))}
            />
            <InputRightElement>
              <Flex
                cursor={"pointer"}
                onClick={() => {
                  setCount((prevCount) => prevCount + 1);
                }}
                borderRadius={"50%"}
                w={"24px"}
                height={"24px"}
                bg={"var(--Primary-500)"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Text color={"var(--White)"}>+</Text>
              </Flex>
            </InputRightElement>
          </InputGroup>

          <Flex
            fontSize={"16px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            color={"var(--White)"}
          >
            <Text>{"Total Renting Price"}</Text>
            <Text>{formatTokenBalance(convertAndDivide(price, 9), 9)} TON</Text>
          </Flex>

          <Button
            isLoading={isLoading}
            isDisabled={isDisabled}
            variant={"primary"}
            onClick={
              rawAddress
                ? handleBuyBoost
                : () => {
                    if (modalState.status == "closed" && connectionRestored) {
                      setModalVisibility(false);
                      openModal();
                    }
                  }
            }
          >
            {!rawAddress ? "Connect Wallet" : "Upgrade Mining"}
          </Button>
        </Flex>
      </BachiBox>
    </BachiDrawer>
  );
}
