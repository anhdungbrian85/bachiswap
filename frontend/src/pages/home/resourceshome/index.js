import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

//import component
import CommonButton from "../../../components/button/commonbutton";
import SectionContainer from "../../../components/container";
import CustomButton from "../../../components/button";
//import icon
import { HiArrowSmRight } from "react-icons/hi";
//import image
import resourcesHome from "../../../assets/img/homepage/resources-home.png";
import backgroundResources from "../../../assets/img/homepage/background-resources-home.png";
import resourcesMobile from "../../../assets/img/homepage/resources-homemobile.png";
import MainButton from "../../../components/button/MainButton";
import { Link } from "react-router-dom";
import { useTab } from "../../../contexts/useTab";
import { enumMenu } from "../../../utils/contants";
import { useTranslation } from "react-i18next";
const ResourcesHome = () => {
  const { t } = useTranslation("home");
  const { setFarmTab, setMenuActive } = useTab();
  const conectLink = () => {
    setFarmTab(1);
    window.scrollTo(0, 0);
    setMenuActive(enumMenu[0].name);
    localStorage.setItem("menuActive", enumMenu[0].name);
  };
  return (
    <>
      <SectionContainer
        position={"relative"}
        display={"flex"}
        justifyContent={"flex-end"}
        padding={{ base: "48px 25px 48px 25px", lg: "194px 64px 194px 0px" }}
      >
        <Image
          display={{ base: "none" }}
          src={resourcesHome}
          position={"absolute"}
          left={"0"}
          top={{
            base: "30px",
            md: "-20px",
            lg: "-140px",
            xl: "-200px",
            "2xl": "-159.69px",
          }}
        />
        <Image
          src={resourcesMobile}
          position={"absolute"}
          left={"0"}
          top={"0"}
          height={"100%"}
          width={{ lg: "45%" }}
        />
        <Flex
          flexDirection={"column"}
          width={{ base: "100%", md: "50%" }}
          // paddingTop={{
          //   base: "48px",
          //   md: "86px",
          //   lg: "186px",
          //   xl: "300px",
          //   "2xl": "311.31px",
          // }}
          position={"relative"}
        >
          <Text
            fontSize={{ base: "40px", "2xl": "86px" }}
            lineHeight={"normal"}
            fontFamily="var(--font-heading)"
            paddingBottom={{ base: "36px", lg: "32px", "2xl": "48px" }}
          >
            {t("titleResources")}
          </Text>
          <Flex
            flexDirection={"column"}
            gap={{ base: "36px", lg: "32px" }}
            alignItems="stretch"
          >
            <Link to="/farm" onClick={conectLink}>
              <Box
                width={"100%"}
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
                  "@media (max-width: 992px)": {
                    clipPath:
                      "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                    "::before": {
                      width: "10px",
                      height: "10px",
                      backgroundColor: "pink.500",
                    },
                    "::after": {
                      width: "10px",
                      height: "10px",
                      backgroundColor: "pink.500",
                    },
                  },
                }}
              >
                <CommonButton
                  backgroundColor={"rgba(27, 27, 27, 0.20)"}
                  boxShadow={"inset 0 0 10px var(--color-main)"}
                  border="0.5px solid var(--color-main)"
                  position="relative"
                  zIndex="10"
                >
                  <Flex
                    flexDirection={"column"}
                    padding={{
                      base: "24px 29px 24px 20px",
                      lg: "21.5px 16px 21.5px 16px",
                      xl: "24px 36px 24px 36px",
                      "3xl": "48px 56px 48px 56px",
                    }}
                    gap={"22px"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        letterSpacing={"-1px"}
                        width={{ base: "80%", "3xl": "90%" }}
                        fontSize={{
                          base: "20px",
                          "2xl": "32px",
                          "3xl": "40px",
                        }}
                        fontFamily="var(--font-heading-main)"
                        lineHeight={{ base: "28px", "2xl": "48px" }}
                      >
                        {t("h1Resources")}
                      </Text>
                      <Button
                        sx={{
                          backdropFilter: "blur(10px) !important",
                          clipPath:
                            "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%) ",
                          "::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "10px",
                            height: "10px",
                            backgroundColor: "pink.500",
                            clipPath: "polygon(0 100%, 100% 0, 0 0)",
                          },
                          "::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "10px",
                            height: "10px",
                            backgroundColor: "pink.500",
                            clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
                          },
                          "@media (width: 1920px)": {
                            clipPath:
                              "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                            "::before": {
                              width: "20px",
                              height: "20px",
                              backgroundColor: "pink.500",
                            },
                            "::after": {
                              width: "20px",
                              height: "20px",
                              backgroundColor: "pink.500",
                            },
                          },
                        }}
                        width={{ base: "40px", lg: "40px", "3xl": "61px" }}
                        height={{ base: "40px", lg: "40px", "3xl": "61px" }}
                        backgroundColor="var(--color-main)"
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Box sx={{ transform: "rotate(-45deg)" }}>
                          <HiArrowSmRight fontSize={"30px"} color="#000" />
                        </Box>
                      </Button>
                    </Flex>
                    <Text
                      fontSize={{ base: "16px", "2xl": "24px" }}
                      fontFamily="var(--font-text-main)"
                    ></Text>
                  </Flex>
                </CommonButton>
              </Box>
            </Link>
            <Box
              width={"100%"}
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
                "@media (max-width: 992px)": {
                  clipPath:
                    "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                  "::before": {
                    width: "10px",
                    height: "10px",
                    backgroundColor: "pink.500",
                  },
                  "::after": {
                    width: "10px",
                    height: "10px",
                    backgroundColor: "pink.500",
                  },
                },
              }}
              onClick={() => {
                window.open("https://bachiswap.gitbook.io/docs", "_blank");
              }}
            >
              <CommonButton
                backgroundColor={"rgba(27, 27, 27, 0.20)"}
                border="0.5px solid var(--color-main)"
                boxShadow={"inset 0 0 10px var(--color-main)"}
                position="relative"
                zIndex="10"
              >
                <Flex
                  flexDirection={"column"}
                  padding={{
                    base: "24px 29px 24px 20px",
                    lg: "21.5px 16px 21.5px 16px",
                    xl: "24px 36px 24px 36px",
                    "3xl": "48px 56px 48px 56px",
                  }}
                  gap={{ base: "16px", lg: "5px" }}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text
                      etterSpacing={"-1px"}
                      width={{ base: "80%" }}
                      fontSize={{
                        base: "20px",

                        "2xl": "32px",
                        "3xl": "40px",
                      }}
                      fontFamily="var(--font-heading-main)"
                      lineHeight={{ base: "28px", "2xl": "48px" }}
                    >
                      {t("h2Resources")}
                    </Text>
                    <Button
                      sx={{
                        backdropFilter: "blur(10px) !important",
                        clipPath:
                          "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%) ",
                        "::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "10px",
                          height: "10px",
                          backgroundColor: "pink.500",
                          clipPath: "polygon(0 100%, 100% 0, 0 0)",
                        },
                        "::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "10px",
                          height: "10px",
                          backgroundColor: "pink.500",
                          clipPath: "polygon(100% 100%, 100% 0, 0 100%)",
                        },
                        "@media (width: 1920px)": {
                          clipPath:
                            "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                          "::before": {
                            width: "20px",
                            height: "20px",
                            backgroundColor: "pink.500",
                          },
                          "::after": {
                            width: "20px",
                            height: "20px",
                            backgroundColor: "pink.500",
                          },
                        },
                      }}
                      width={{ base: "40px", lg: "40px", "3xl": "61px" }}
                      height={{ base: "40px", lg: "40px", "3xl": "61px" }}
                      backgroundColor="var(--color-main)"
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Box sx={{ transform: "rotate(-45deg)" }}>
                        <HiArrowSmRight fontSize={"30px"} color="#000" />
                      </Box>
                    </Button>
                  </Flex>
                  <Text
                    fontSize={{ base: "16px", "2xl": "24px" }}
                    fontFamily="var(--font-text-main)"
                    width={{ base: "100%", "2xl": "70%" }}
                  >
                    {t("description2Resources")}
                  </Text>
                </Flex>
              </CommonButton>
            </Box>
          </Flex>
        </Flex>
      </SectionContainer>
      <SectionContainer
        position={"relative"}
        backgroundColor="var(--color-main)"
        backgroundImage={`url(${backgroundResources})`}
        backgroundSize={{ base: "100% 100%", md: "cover" }}
        backgroundPosition={"center"}
        backgroundRepeat={"no-repeat"}
      >
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          padding={{
            base: "48px 20px 48px 20px",
            lg: "32px 64px 32px 64px",
            xl: "48px 100px 48px 100px ",
            "3xl": "68px 179px 44px 179px",
          }}
          gap={{ base: "36px", "2xl": "55px" }}
        >
          <Text
            fontSize={{ base: "40px", "2xl": "72px" }}
            textAlign={"center"}
            fontFamily="var(--font-heading)"
            lineHeight={{ base: "48px", "2xl": "80px" }}
            letterSpacing={"-1px"}
          >
            {t("title1Resources")}
          </Text>
          <Link to="/farm" onClick={conectLink}>
            <MainButton
              width={{ base: "172px", lg: "136px", "2xl": "230px" }}
              height={{ base: "44px", lg: "56px", "2xl": "64px" }}
              backgroundColor="var(--color-background)"
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
            >
              <Text
                textAlign={"center"}
                fontSize={{ base: "20px", "3xl": "24px" }}
                color={"#FCDDEC"}
                fontWeight={500}
                lineHeight={"28px"}
                letterSpacing={"-1px"}
                fontFamily={"var(--font-heading-main)"}
              >
                {t("buttonResources")}
              </Text>
            </MainButton>
          </Link>
        </Flex>
      </SectionContainer>
    </>
  );
};

export default ResourcesHome;
