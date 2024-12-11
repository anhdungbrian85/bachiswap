import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
//import component
import SectionContainer from "../../../components/container";
import Earning from "./earning";
import MintRune from "./mintrune";
import RuneExplorer from "./runeexplorer";

import ReferralProgram from "./referralprogram";
//import image
import backgroundNode from "../../../assets/img/node/background-node.png";
import backgroundReferral from "../../../assets/img/node/background-referral.png";

import { useTab } from "../../../contexts/useTab";
import { useTranslation } from "react-i18next";
const ProductNode = () => {
  const { t } = useTranslation("node");
  const { farmTab, setFarmTab } = useTab();

  const productTab = [
    {
      title: t("earning"),
      content: <Earning />,
    },
    {
      title: t("boosters"),
      content: <MintRune />,
    },
    {
      title: t("explorer"),
      content: <RuneExplorer />,
    },
    {
      title: t("referral program"),
      content: <ReferralProgram />,
    },
  ];

  return (
    <>
      {/* <Image
        src={backgroundReferral}
        position={"absolute"}
        right={"0"}
        top={{ base: "280px", md: "380px" }}
      /> */}
      <SectionContainer
        backgroundImage={`url(${backgroundNode})`}
        backgroundRepeat={"no-repeat"}
        px={{ base: "25px", xl: "48px", "3xl": "68px" }}
        marginBottom={"24px"}
        position={"relative"}
      >
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Text
            fontSize={{ base: "24px", "2xl": "64px" }}
            fontWeight={400}
            fontFamily="var(--font-heading)"
            textAlign={"center"}
            paddingTop={{ base: "50px", "2xl": "135px" }}
          >
            {t("titleNode")}
          </Text>
          <Flex
            justifyContent={"space-around"}
            wrap={"wrap"}
            width={"100%"}
            marginTop={{ base: "47px", "2xl": "99px" }}
          >
            {productTab.map((e, index) => {
              return (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  key={index}
                  onClick={() => setFarmTab(index)}
                  cursor={"pointer"}
                  padding={"12px 5px 0px 5px"}
                  zIndex={"10"}
                  borderBottom="1px solid #FCDDEC"
                  flex={"1 1 0"}
                >
                  <Text
                    position={"relative"}
                    paddingBottom={"12px"}
                    _before={{
                      content: '""',
                      position: "absolute",
                      bottom: "-1px",
                      left: 0,
                      width: "100%",
                      height: {
                        base: farmTab === index ? "3px" : "0",
                        "2xl": farmTab === index ? "5px" : "0",
                      },
                      backgroundColor: "var(--color-main)",
                      // transition: "height 0.3s ease",
                    }}
                    fontSize={{
                      base: "16px",
                      md: "20px",
                      "2xl": "32px",
                      "3xl": "36px",
                    }}
                    fontWeight={400}
                    lineHeight={"normal"}
                    fontFamily="var(--font-heading-main)"
                    color={farmTab == index ? "var(--color-main)" : "#FFF"}
                    textAlign={"center"}
                    whiteSpace="nowrap"
                  >
                    {e?.title}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
        <Box>{productTab[farmTab].content}</Box>
      </SectionContainer>
    </>
  );
};

export default ProductNode;
