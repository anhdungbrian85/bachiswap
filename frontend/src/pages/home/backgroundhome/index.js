import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
//import component
import CommonButton from "../../../components/button/commonbutton";
//import image
import appLogo from "../../../assets/img/app-logo.png";
import backgroundHome from "../../../assets/img/homepage/background-home.png";
//import icon
import { HiArrowSmRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTab } from "../../../contexts/useTab";
import { enumMenu } from "../../../utils/contants";
import { useTranslation } from "react-i18next";
const BackgroundHome = () => {
  const { t } = useTranslation("home");
  const { setFarmTab, setMenuActive } = useTab();
  const conectLink = () => {
    setFarmTab(0);
    window.scrollTo(0, 0);
    setMenuActive(enumMenu[0].name);
    localStorage.setItem("menuActive", enumMenu[0].name);
  };
  const conectLinkAirdrop = () => {
    setFarmTab(1);
    window.scrollTo(0, 0);
    setMenuActive(enumMenu[1].name);
    localStorage.setItem("menuActive", enumMenu[1].name);
  };
  return (
    <Box
      backgroundImage={`url(${backgroundHome})`}
      backgroundSize={{ base: "cover", lg: "100% 105%" }}
      backgroundPosition={{ base: "bottom", lg: "bottom" }}
      backgroundRepeat={"no-repeat"}
      // height={"300px"}
      padding={{
        base: "40px 24px 40px 24px",
        lg: "38px 92px 38px 92px",
        xl: "88px 104px 68px 104px",
        "3xl": "128px 179px 128px 179px",
      }}
      zIndex={"1"}
      position={"relative"}
    >
      <Flex flexDirection={"column"} alignItems={"center"} zIndex={"1"}>
        <Image
          width={{ base: "140.897px", "3xl": "235px" }}
          height={{ base: "60px", "3xl": "100px" }}
          src={appLogo}
          // marginTop={"225px"}
          marginBottom={{ base: "32px", lg: "48px", "3xl": "36px" }}
        />
        <Text
          letterSpacing={"-1px"}
          fontSize={{ base: "40px", lg: "40px", xl: "64px", "3xl": "72px" }}
          lineHeight={{ base: "48px", xl: "68px", "3xl": "80px" }}
          fontFamily="var(--font-heading)"
          textAlign={"center"}
          marginBottom={{ base: "40px", lg: "48px", "2xl": "112px" }}
        >
          {t("titleBackground")}
        </Text>
        <Flex
          alignItems={"stretch"}
          gap={{ base: "24px", lg: "48px", "2xl": "48px" }}
          flexDirection={{ base: "column", lg: "row" }}
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
              backgroundColor={"rgba(27, 27, 27, 0.20)"}
            >
              <CommonButton
                height="100%"
                border="0.5px solid var(--color-main)"
                boxShadow={"inset 0 0 10px var(--color-main)"}
                position="relative"
                zIndex="10"
              >
                <Flex
                  flexDirection={"column"}
                  padding={{
                    base: "24px 21px 20px 24px",
                    lg: "16px 20px 16px 20px",
                    xl: "24px 36px 24px 36px",
                    "3xl": "32px 32px 50px 48px",
                  }}
                  gap={{
                    base: "16px",
                    lg: "32px",
                    "2xl": "22px",
                    "3xl": "25px",
                  }}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text
                      letterSpacing={"-1px"}
                      fontSize={{
                        base: "20px",
                        "2xl": "36px",
                        "3xl": "40px",
                      }}
                      fontFamily="var(--font-text-extra)"
                      color="var(--color-main)"
                    >
                      {t("h1Background")}
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
                    letterSpacing={"-1px"}
                    lineHeight={{ base: "28px", "3xl": "40px" }}
                    width={{ base: "80%", lg: "100%", xl: "80%" }}
                    fontSize={{ base: "20px", xl: "24px", "3xl": "32px" }}
                    fontFamily="var(--font-heading-main)"
                  >
                    {t("description1Background")}
                  </Text>
                </Flex>
              </CommonButton>
            </Box>
          </Link>
          <Link to="/airdrop" onClick={conectLinkAirdrop}>
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
                    base: "24px 21px 20px 24px",
                    lg: "16px 20px 16px 20px",
                    xl: "24px 36px 24px 36px",
                    "3xl": "32px 32px 50px 48px",
                  }}
                  gap={{
                    base: "16px",
                    lg: "32px",
                    "2xl": "22px",
                    "3xl": "25px",
                  }}
                >
                  <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={"10px"}
                  >
                    <Text
                      fontSize={{
                        base: "20px",
                        "2xl": "36px",
                        "3xl": "40px",
                      }}
                      fontFamily="var(--font-text-extra)"
                      color="var(--color-main)"
                    >
                      {t("h2Background")}
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
                    letterSpacing={"-1px"}
                    lineHeight={{ base: "28px", "3xl": "40px" }}
                    width={{ base: "80%", lg: "100%", xl: "80%" }}
                    fontSize={{ base: "20px", xl: "24px", "3xl": "32px" }}
                    fontFamily="var(--font-heading-main)"
                  >
                    {t("description2Background")}
                  </Text>
                </Flex>
              </CommonButton>
            </Box>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BackgroundHome;
