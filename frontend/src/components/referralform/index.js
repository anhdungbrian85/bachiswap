import React from "react";
import { Box, Flex, Input, Button, Text } from "@chakra-ui/react";
import CustomButton from "../button";
import { base } from "viem/chains";
import MainButton from "../button/MainButton";
import { useTranslation } from "react-i18next";

const ReferralCodeForm = ({ title, value, onChange, onClick, error }) => {
  const { t } = useTranslation("node");
  return (
    <Box width={"100%"}>
      <Box
        width="100%"
        border="1px solid #FCDDEC"
        padding="10px"
        position="relative"
      >
        <Text
          position="absolute"
          top={{ base: "-15px" }}
          left={{ base: "20px", xl: "50px" }}
          backgroundColor="#231A2E"
          padding="0 5px"
          color="#FFFFFF"
          fontSize={{ base: "16px", md: "18px", xl: "24px" }}
          fontWeight={500}
        >
          {title}
        </Text>
        <Flex
          padding={{ base: "0px", xl: "25px 28px 25px 34px" }}
          flexDirection={"column"}
        >
          <Flex
            height={{ base: "24px" }}
            width={"100%"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Input
              placeholder={t("Input")}
              border="none"
              bg="#231A2E"
              height={{ base: "24px" }}
              color="#FFFFFF"
              flex="1"
              marginRight="8px"
              _focus={{ outline: "none", boxShadow: "none" }}
              value={value}
              onChange={onChange}
            />
            <MainButton
              padding={"0px"}
              height={{ base: "40px", md: "50px", xl: "48px", "3xl": "70px" }}
              width={{ base: "30%", md: "40%", lg: "20%" }}
              bg="#EC4899"
              display={{ base: "none", xl: "block" }}
              color="#FFFFFF"
              borderRadius="8px"
              border="none"
              _hover={{ bg: "#DB2777" }}
              _active={{ bg: "#BE185D" }}
              onClick={onClick}
            >
              {t("Apply")}
            </MainButton>
          </Flex>

          {error && (
            <Text color="red.500" mt="4">
              {error}
            </Text>
          )}
        </Flex>
      </Box>
      <MainButton
        padding={"0px"}
        display={{ base: "block", xl: "none" }}
        marginTop={"16px"}
        marginBottom={"32px"}
        borderRadius={"8px"}
        height={{ base: "40px", md: "50px", xl: "48px", "3xl": "70px" }}
        width={{ base: "100%" }}
        bg="#EC4899"
        color="#FFFFFF"
        border="none"
        _hover={{ bg: "#DB2777" }}
        _active={{ bg: "#BE185D" }}
        onClick={onClick}
      >
        {t("Apply")} {title}
      </MainButton>
    </Box>
  );
};

export default ReferralCodeForm;
