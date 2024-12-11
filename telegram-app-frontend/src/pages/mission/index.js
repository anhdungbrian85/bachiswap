import React, { useEffect, useState } from "react";
import BachiBox from "../../components/bachiBox";
import LogoBachi from "../../assets/logoBachi.png";
import { Box, Button, Checkbox, Flex, Img, Text } from "@chakra-ui/react";
import { AiFillGift } from "react-icons/ai";
import TotalMission from "../../assets/icons/total-mission.svg";
import Social from "./social";
import Node from "./node";
import { useTab } from "../../contexts/useTab";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useAppContext } from "../../contexts";
import { APIClient } from "../../api";
import toast from "react-hot-toast";

export default function Mission() {
  const rawAddress = useTonAddress();
  // const wallet = useTonWallet();
  const { userToken, fetchUser } = useAppContext();
  const { farmTab, setFarmTab } = useTab();

  const initialMissions = [
    {
      taskName: "Invite Your First Friend",
      taskCode: "BACHISWAP_TASK_1",
      total: "+100",
      isComplete: false,
    },
    {
      taskName: "Rent Your First Miner Booster",
      taskCode: "BACHISWAP_TASK_2",
      total: "+400",
      isComplete: false,
    },
    {
      taskName: "Initial Bonus",
      taskCode: "BACHISWAP_TASK_3",
      total: "+500",
      isComplete: false,
    },
  ];

  const [missions, setMissions] = useState(initialMissions);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const completedTasks = await Promise.all(
          initialMissions.map(async (mission) => {
            const response = await APIClient.verifyTaskHistory(
              userToken,
              mission.taskCode
            );
            return {
              ...mission,
              isComplete: response?.isComplete || false,
            };
          })
        );
        setMissions(completedTasks);
      } catch (error) {
        console.error("Failed to fetch completed tasks:", error);
      }
    };
    if (rawAddress) {
      fetchCompletedTasks();
    }
  }, [userToken]);

  const handleVerifyTask = async (taskCode) => {
    if (!rawAddress) {
      toast.error("Please connect your Ton wallet to perform this mission.");
      return;
    }

    try {
      const response = await APIClient.verifyTask(userToken, taskCode);
      const updatedMissions = missions.map((mission) =>
        mission.taskCode === taskCode
          ? { ...mission, isComplete: true }
          : mission
      );
      setMissions(updatedMissions);

      toast.success("Mission verified successfully!");
      await fetchUser();
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Mission verification failed.");
    }
  };

  const missionTab = [
    {
      title: "Social Mission",
      content: <Social />,
    },
    {
      title: "Node Mission",
      content: <Node />,
    },
  ];

  return (
    <Flex flexDirection={{ base: "column" }}>
      <BachiBox p={{ base: "32px 27px 16px 27px " }}>
        <Flex
          flexDirection={{ base: "column" }}
          gap={{ base: "24px" }}
          alignItems={"center"}
        >
          <Img w={"140px"} h={"76px"} src={LogoBachi} />
          <Flex
            flexDirection={{ base: "column" }}
            alignItems={{ base: "center" }}
            gap={{ base: "11px" }}
          >
            <Text
              fontSize={{ base: "16px" }}
              fontWeight={600}
              textAlign={{ base: "center" }}
              color="var(--White)"
            >
              Mission Available
            </Text>
            <Text
              fontSize={{ base: "14px" }}
              fontWeight={400}
              textAlign={{ base: "center" }}
              color="var(--White)"
            >
              We’ll reward you immediately with tokens after each task
              completion
            </Text>
          </Flex>
        </Flex>
      </BachiBox>

      <Flex
        flexDirection={"column"}
        pt={{ base: "24px" }}
        gap={{ base: "24px" }}
      >
        <Text
          fontSize={{ base: "20px" }}
          fontWeight={600}
          lineHeight={"normal"}
          color="var(--White)"
        >
          TonOS missions
        </Text>
        <Flex flexDirection={"column"} gap={"16px"}>
          {missions.map((item, index) => (
            <BachiBox p={{ base: "22px 16px 22px 16px" }} key={index}>
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"} gap={{ base: "8px" }}>
                  <AiFillGift fontSize={"40px"} color="var(--Primary-500" />
                  <Flex flexDirection={"column"} gap={{ base: "2px" }}>
                    <Text
                      fontSize={"14px"}
                      fontWeight={400}
                      color="var(--White)"
                      lineHeight={"normal"}
                    >
                      {item.taskName}
                    </Text>
                    <Flex alignItems={"center"} gap={"4px"}>
                      <Text
                        fontSize={"14px"}
                        fontWeight={600}
                        lineHeight={"normal"}
                        color="var(--Primary-500)"
                      >
                        {item.total}
                      </Text>
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        borderRadius={"50%"}
                        w={"14px"}
                        h={"14px"}
                        bg="var(--Black)"
                      >
                        <Img boxSize={"8px"} src={TotalMission} />
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                {item.isComplete ? (
                  <Checkbox
                    isChecked
                    sx={{
                      ".chakra-checkbox__control": {
                        w: "24px",
                        h: "24px",
                        borderRadius: "4px",
                        bg: "var(--green-light) !important",
                        borderColor: "var(--green-light) !important",
                        _checked: {
                          bg: "var(--green-light) !important",
                          borderColor: "var(--green-light) !important",
                        },
                        _hover: {
                          bg: "var(--green-light) !important",
                          borderColor: "var(--green-light) !important",
                        },
                      },
                    }}
                  />
                ) : (
                  <Button
                    w={"74px"}
                    h={"38px"}
                    p={"10px 12px"}
                    onClick={() => handleVerifyTask(item.taskCode)}
                  >
                    <Text
                      fontSize={"16px"}
                      fontWeight={500}
                      lineHeight={"normal"}
                    >
                      Go
                    </Text>
                  </Button>
                )}
              </Flex>
            </BachiBox>
          ))}
        </Flex>
      </Flex>

      <Flex pt={"66px"}>
        {missionTab.map((e, index) => (
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            key={index}
            onClick={() => setFarmTab(index)}
            cursor={"pointer"}
            padding={"12px 5px 0px 5px"}
            zIndex={"10"}
            flex={"1 1 0"}
          >
            <Text
              position={"relative"}
              paddingBottom={"4px"}
              _before={{
                content: '""',
                position: "absolute",
                bottom: "-1px",
                left: 0,
                width: "100%",
                height: { base: farmTab === index ? "1px" : "0" },
                backgroundColor: "var(--Primary-500)",
              }}
              fontSize={"20px"}
              fontWeight={600}
              lineHeight={"normal"}
              color={
                farmTab == index ? "var(--Primary-500)" : "var(--Grey-500)"
              }
              textAlign={"center"}
              whiteSpace="nowrap"
            >
              {e?.title}
            </Text>
          </Flex>
        ))}
      </Flex>
      <Box mt={"20px"}>{missionTab[farmTab].content}</Box>
    </Flex>
  );
}
