import { Button, Checkbox, Flex, Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BachiBox from "../../../components/bachiBox";
import TotalMission from "../../../assets/icons/total-mission.svg";
import BachiMission from "../../../assets/icons/bachi-mission.svg";
import TwMission from "../../../assets/icons/tw-mission.png";
import DisscordMission from "../../../assets/icons/discord-mission.png";
import ReactPaginate from "react-paginate";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";

import toast from "react-hot-toast";
import { useAppContext } from "../../../contexts";
import { APIClient } from "../../../api";
export default function Social() {
  const rawAddress = useTonAddress();
  // const wallet = useTonWallet();
  const { userToken } = useAppContext();

  const initialMissions = [
    {
      img: BachiMission,
      taskCode: "BACHISWAP_TASK_8",
      taskName: "Invite Partner join us",
      total: "+250",
      isComplete: false,
    },
    {
      img: BachiMission,
      taskCode: "BACHISWAP_TASK_9",
      taskName: "Claim your daily rewards",
      total: "+400",
      isComplete: false,
    },
    {
      img: TwMission,
      taskCode: "BACHISWAP_TASK_10",
      taskName: "Connect your X Account",
      total: "+300",
      isComplete: false,
    },
    {
      img: DisscordMission,
      taskCode: "BACHISWAP_TASK_11",
      taskName: "Connect your Discord Account",
      total: "+250",
      isComplete: false,
    },
    {
      img: DisscordMission,
      taskCode: "BACHISWAP_TASK_12",
      taskName: "Connect your Discord Account",
      total: "+250",
      isComplete: false,
    },
    {
      img: DisscordMission,
      taskCode: "BACHISWAP_TASK_13",
      taskName: "Connect your Discord Account",
      total: "+250",
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
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Mission verification failed.");
    }
  };
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);

  const start = currentPage * itemsPerPage;
  const currentItems = missions.slice(start, start + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <Flex flexDirection="column" pt="24px" gap="24px">
      <Flex flexDirection="column" gap="16px">
        {currentItems.map((item, index) => (
          <BachiBox p="22px 16px" key={index}>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center" gap="8px">
                <Img src={item.img} />
                <Flex flexDirection="column" gap="2px">
                  <Text fontSize="14px" fontWeight={400} color="var(--White)">
                    {item.taskName}
                  </Text>
                  <Flex alignItems="center" gap="4px">
                    <Text
                      fontSize="14px"
                      fontWeight={600}
                      color="var(--Primary-500)"
                    >
                      {item.total}
                    </Text>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      w="14px"
                      h="14px"
                      bg="var(--Black)"
                    >
                      <Img boxSize="8px" src={TotalMission} />
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
                      bg: "var(--green-light)",
                      borderColor: "var(--green-light)",
                      _checked: {
                        bg: "var(--green-light)",
                        borderColor: "var(--green-light)",
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
                  w="74px"
                  h="38px"
                  onClick={() => handleVerifyTask(item.taskCode)}
                >
                  <Text fontSize="16px" fontWeight={500}>
                    Go
                  </Text>
                </Button>
              )}
            </Flex>
          </BachiBox>
        ))}
      </Flex>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={<AiOutlineLeft w={"8px"} h={"12px"} />}
        nextLabel={<AiOutlineRight w={"8px"} h={"12px"} />}
        pageCount={Math.ceil(missions.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        previousClassName={"pagination-previous"}
        nextClassName={"pagination-next"}
        disabledClassName={"pagination-disabled"}
      />
    </Flex>
  );
}
