import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";

const Quantity = ({ count, setCount }) => {
  const increaseCount = () => {
    if (count < 10) setCount(count + 1);
  };
  const reduceCount = () => {
    if (count > 1) setCount(count - 1);
  };
  return (
    <Flex alignItems={"center"}>
      <Flex
        width={{ base: "27px", md: "37px", xl: "55px" }}
        height={{ base: "26px", md: "36px", xl: "54px" }}
        backgroundColor={"#FFF"}
        borderTopLeftRadius={"7px"}
        borderBottomLeftRadius={"7px"}
        onClick={reduceCount}
        alignItems={"center"}
        justifyContent={"center"}
        cursor={"pointer"}
      >
        <Text color={"#000"} fontSize={"30px"} cursor={"pointer"}>
          -
        </Text>
      </Flex>
      <Flex
        width={{ base: "37px", md: "47px", xl: "77px" }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text fontSize={{ base: "16px", xl: "24px" }} fontWeight={400}>
          {count}
        </Text>
      </Flex>
      <Flex
        width={{ base: "27px", md: "37px", xl: "55px" }}
        height={{ base: "26px", md: "36px", xl: "54px" }}
        backgroundColor={"#FFF"}
        borderTopRightRadius={"7px"}
        borderBottomRightRadius={"7px"}
        onClick={increaseCount}
        alignItems={"center"}
        justifyContent={"center"}
        cursor={"pointer"}
      >
        <Text color={"#000"} fontSize={"30px"} cursor={"pointer"}>
          +
        </Text>
      </Flex>
    </Flex>
  );
};

export default Quantity;
