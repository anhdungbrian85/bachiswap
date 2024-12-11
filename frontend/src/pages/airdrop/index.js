import React, { useRef } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
//import component
import SectionContainer from "../../components/container";
import CustomButton from "../../components/button";
//import image
import backgroundNode from "../../assets/img/node/background-node.png";
import { useTab } from "../../contexts/useTab";
import SocialQuest from "./socialQuest";
import NodeQuest from "./nodeQuest";
import { useTranslation } from "react-i18next";

const AirDrop = () => {
  const { t } = useTranslation("airdrop");
  const { airdropTab, setAirdropTask } = useTab();

  const productTab = [
    {
      title: t("SocialQuest"),
      content: <SocialQuest />,
    },
    {
      title: t("NodeQuest"),
      content: <NodeQuest />,
    },
  ];
  return (
    <>
      <Image
        src={backgroundNode}
        position={"absolute"}
        right={"0px"}
        top={"70px"}
      />
      <SectionContainer
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
            paddingTop={{ base: "50px", "2xl": "118.5px" }}
          >
            {t("BachiSwapAirdrop")}
          </Text>
          <Flex
            justifyContent={{ base: "space-around", xl: "flex-start" }}
            width={"100%"}
            gap={{ base: "", xl: "80px", "2xl": "100px" }}
            marginTop={{ base: "47px", "2xl": "120.5px" }}
            borderBottom="1px solid #FCDDEC"
          >
            {productTab.map((e, index) => {
              return (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  key={index}
                  onClick={() => setAirdropTask(index)}
                  cursor={"pointer"}
                  padding={"12px 5px 0px 5px"}
                  zIndex={"10"}
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
                        base: airdropTab === index ? "3px" : "0",
                        "2xl": airdropTab === index ? "5px" : "0",
                      },
                      backgroundColor: "var(--color-main)",
                    }}
                    fontSize={{
                      base: "16px",
                      md: "24px",
                      "2xl": "32px",
                      "3xl": "36px",
                    }}
                    fontWeight={400}
                    lineHeight={"normal"}
                    fontFamily="var(--font-heading-main)"
                    color={airdropTab == index ? "var(--color-main)" : "#FFF"}
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
        <Box>{productTab[airdropTab].content}</Box>
      </SectionContainer>
    </>
  );
};

export default AirDrop;
