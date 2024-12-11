import {
  Box,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Image,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "./style.css";

//import component
import SectionContainer from "../container";
import CustomButton from "../button";
//import image
import appLogo from "../../assets/img/app-logo.png";
import iconMenu from "../../assets/img/icon-menu.png";
import navIcon from "../../assets/img/nav-icon.png";
import { useModal } from "../../contexts/useModal";
import { useAccount } from "wagmi";
import { getUserIpAddress, truncateStr } from "../../utils";
import { Link, NavLink, useLocation } from "react-router-dom";
import NavbarMobile from "./navbarmobile";
import MainButton from "../button/MainButton";
import { enumMenu } from "../../utils/contants";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useTab } from "../../contexts/useTab";
import { clientAPI } from "../../api/client";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  //i18n
  const { i18n } = useTranslation();
  const { t } = useTranslation("menu");
  const [shownav, setShowNav] = useState(false);
  const [navActive, setNavActive] = useState("");
  const [navColor, setNavColor] = useState("");
  const { setConnectWalletModalVisible } = useModal();
  const onOpenConnectWalletModal = () => setConnectWalletModalVisible(true);
  const { address } = useAccount();
  const { setFarmTab, setAirdropTask, menuActive, setMenuActive } = useTab();
  const handleShowNav = () => {
    setShowNav(!shownav);
  };
  useEffect(() => {
    const storedMenuActive = localStorage.getItem("menuActive");
    if (storedMenuActive) {
      setMenuActive(storedMenuActive);
    }
  }, []);
  ///
  const addWalletHistory = async (address) => {
    /***Get IP user ***/
    const ipAddress = await getUserIpAddress();
    await clientAPI("post", "/api/connectWalletHistory/addWalletHistory", {
      wallet_address: address,
      ipAddress: ipAddress,
    });
  };
  useEffect(() => {
    if (address) {
      addWalletHistory(address);
    }
  }, [address]);

  //
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <SectionContainer
        backgroundColor={"rgba(27, 27, 27, 0.20)"}
        borderBottom="0.5px solid var(--color-border-bottom)"
        position="relative"
        sx={{ backdropFilter: "blur(10px)" }}
        zIndex={{ base: "100", xl: "1000" }}
        padding={{
          base: "16px 24px",
          lg: "16px 48px",
          "3xl": "18px 32px 18px 64px",
        }}
      >
        <Grid templateColumns="repeat(10, 1fr)" gap={0} alignItems="center">
          <Link
            to="/"
            style={{ gridColumn: "span 3" }}
            onClick={() => {
              setNavActive("");
              setMenuActive("");
              localStorage.removeItem("menuActive");
            }}
          >
            <Flex gap={{ base: "4.64px", md: "8px" }} alignItems={"center"}>
              <Image src={appLogo} height={{ base: "24px", md: "52px" }} />
              <Text
                fontSize={{
                  base: "16px",
                  md: "32px",
                  "2xl": "36px",
                  "3xl": "40px",
                }}
                lineHeight={{
                  base: "24px",
                  md: "40px",

                  "3xl": "48px",
                }}
                fontFamily="var(--font-heading-main)"
                fontWeight={400}
                letterSpacing={{ "3xl": "-1px" }}
              >
                BachiSwap
              </Text>
            </Flex>
          </Link>
          <Flex
            style={{ gridColumn: "span 5" }}
            gap={{ base: "20px", "2xl": "40px" }}
            alignItems={"center"}
            fontFamily="var(--font-text-main)"
            display={{ base: "none", xl: "flex" }}
            justifyContent={{ base: "space-around" }}
          >
            {enumMenu.map((item) => (
              <NavLink
                to={item.disabled ? "#" : item.path}
                key={item.name}
                onClick={() => {
                  if (!item.disabled) {
                    setNavActive(navActive !== item.name ? item.name : "");
                    setMenuActive(item.name);
                    localStorage.setItem("menuActive", item.name);
                  }
                }}
                style={{
                  color: item.disabled
                    ? "#B0B0B0"
                    : menuActive === item.name
                      ? "var(--color-main)"
                      : "white",
                  position: "relative",
                  pointerEvents: item.disabled ? "none" : "auto",
                }}
              >
                <Flex
                  alignItems={"center"}
                  gap={"16px"}
                  justifyContent={"space-between"}
                >
                  <Text
                    lineHeight={{ base: "", xl: "32px" }}
                    fontSize={{ base: "16px", xl: "20px" }}
                    fontWeight={400}
                    fontFamily="var(--font-text-main)"
                  >
                    {t(item.name)}
                  </Text>
                  {item?.children &&
                    (!navActive.includes(item.name) ? (
                      <IoIosArrowDown
                        size={"24px"}
                        color={
                          navActive.includes(item.name)
                            ? "var(--color-main)"
                            : ""
                        }
                      />
                    ) : (
                      <IoIosArrowUp
                        size={"24px"}
                        color={
                          navActive.includes(item.name)
                            ? "var(--color-main)"
                            : ""
                        }
                      />
                    ))}
                </Flex>
                <Box
                  borderBottomRadius={"15px"}
                  backgroundColor="var(--color-background)"
                  position="absolute"
                  top={"70px"}
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={"10000"}
                  width={"210px"}
                  boxShadow={"inset 0 0 10px #FFF"}
                >
                  {item?.children && navActive.includes(item.name) && (
                    <Flex
                      padding={{ base: "24px 11px" }}
                      border={"none"}
                      direction={"column"}
                      className={"slideDown-animation"}
                    >
                      {item?.children.map((subItem, index) => (
                        <Link
                          to={subItem.path}
                          key={subItem.name}
                          onClick={() => {
                            console.log({
                              a: item.name,
                              index,
                            });
                            if (item.name == enumMenu[0].name)
                              setFarmTab(index);
                            else if (item.name == enumMenu[1].name) {
                              setAirdropTask(index);
                            }
                          }}
                        >
                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Box
                              color={"#788AA3"}
                              padding={"8px 29px"}
                              _hover={{
                                backgroundColor: "#788AA3",
                                borderRadius: "12px",
                                color: "white !important",
                              }}
                              w={"100%"}
                            >
                              <Text fontSize={{ base: "16px" }}>
                                {t(subItem.name)}
                              </Text>
                            </Box>
                          </Flex>
                        </Link>
                      ))}
                    </Flex>
                  )}
                </Box>
              </NavLink>
            ))}
          </Flex>
          <Flex
            style={{ gridColumn: "span 2" }}
            justifyContent={"flex-end"}
            display={{ base: "none", xl: "flex" }}
            alignItems={"center"}
            gap={"10px"}
          >
            <MainButton
              width={"75%"}
              height="64px"
              _hover={{
                backgroundColor: "var(--color-main)",
              }}
              onClick={onOpenConnectWalletModal}
              backgroundColor="var(--color-main)"
              padding={"16px 36px"}
            >
              <Text
                lineHeight={{ base: "", "3xl": "32px" }}
                fontSize={{ base: "18px", "3xl": "24px" }}
                color={"#FFF"}
                fontFamily={"var(--font-heading-main)"}
              >
                {address ? truncateStr(address) : t("ConnectWallet")}
              </Text>
            </MainButton>
            <Box as="li" listStyleType="none">
              <FormControl as="form" action="/#">
                <Select
                  fontSize={"16px"}
                  fontFamily={"var(--font-heading-main)"}
                  width="auto"
                  variant="unstyled"
                  _focus={{ boxShadow: "none" }}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  <option
                    style={{
                      color: "#000",
                      fontFamily: "var(--font-heading-main)",
                    }}
                    value="en"
                  >
                    EN
                  </option>
                  <option
                    style={{
                      color: "#000",
                      fontFamily: "var(--font-heading-main)",
                    }}
                    value="ko"
                  >
                    KO
                  </option>
                  <option
                    style={{
                      color: "#000",
                      fontFamily: "var(--font-heading-main)",
                    }}
                    value="hi"
                  >
                    HI
                  </option>
                  <option
                    style={{
                      color: "#000",
                      fontFamily: "var(--font-heading-main)",
                    }}
                    value="ar"
                  >
                    AR
                  </option>
                </Select>
              </FormControl>
            </Box>
          </Flex>
          <Flex
            cursor={"pointer"}
            display={{ base: "flex", xl: "none" }}
            style={{ gridColumn: "span 7" }}
            justifyContent={"flex-end"}
            onClick={handleShowNav}
          >
            <Image
              src={iconMenu}
              width={{ base: "18px", md: "26px" }}
              height={"100%"}
            />
          </Flex>
        </Grid>
      </SectionContainer>

      {shownav && (
        <NavbarMobile
          zIndex="1000"
          handleShowNav={handleShowNav}
          shownav={shownav}
        />
      )}
      {shownav && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          zIndex="999"
        />
      )}
    </>
  );
};

export default Navbar;
