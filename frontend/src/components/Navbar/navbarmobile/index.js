import React, { useEffect, useState } from "react";
//import component
import SectionContainer from "../../container";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import CustomButton from "../../button";
import appLogo from "../../../assets/img/app-logo.png";
import iconClose from "../../../assets/img/icon-close-menu.png";
import navIcon from "../../../assets/img/nav-icon.png";
import { useModal } from "../../../contexts/useModal";
import { truncateStr } from "../../../utils";
import { useAccount } from "wagmi";
import MainButton from "../../button/MainButton";
import { enumMenu } from "../../../utils/contants";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useTab } from "../../../contexts/useTab";
import { useTranslation } from "react-i18next";

const NavbarMobile = ({ zIndex, handleShowNav, shownav }) => {
  const { t } = useTranslation("menu");
  const { setConnectWalletModalVisible } = useModal();
  const onOpenConnectWalletModal = () => setConnectWalletModalVisible(true);
  const { address } = useAccount();
  const [navActive, setNavActive] = useState([]);
  const { setFarmTab, setAirdropTask } = useTab();
  useEffect(() => {
    if (shownav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [shownav]);

  return (
    <Box
      padding={"0px"}
      position={"fixed"}
      right={"0px"}
      top={"0px"}
      zIndex={zIndex}
      width={{ base: "100%", md: "75%", lg: "65%" }}
      backgroundColor="var(--color-background-popup)"
      height={"100vh"}
      className="slideIn-animation"
      overflowY={"auto"}
      fontFamily={"var(--font-heading-main)"}
    >
      <Flex
        flexDirection={"column"}
        height={"100%"}
        justifyContent={"space-between"}
      >
        <Box>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={"20px"}
            paddingTop={"16px"}
            paddingBottom={"16px"}
            borderBottom={"0.5px solid  var(--color-border-bottom)"}
            px={"24px"}
          >
            <Link to="/">
              <Flex gap={{ base: "8px" }} alignItems={"center"}>
                <Image src={appLogo} height={{ base: "24px", md: "52px" }} />
                <Text
                  fontSize={{ base: "16px", md: "32px" }}
                  lineHeight={{ base: "19.3px", md: "40px" }}
                  fontFamily="var(--font-heading-main)"
                  fontWeight={400}
                >
                  BachiSwap
                </Text>
              </Flex>
            </Link>
            <Image src={iconClose} onClick={handleShowNav} cursor={"pointer"} />
          </Flex>
          <Flex flexDirection={"column"}>
            {enumMenu.map((item) => (
              <>
                <Box
                  padding={{ base: "32px 24px" }}
                  borderBottom={"0.25px solid #5B5B5B"}
                  onClick={() => {
                    if (!navActive.includes(item.name)) {
                      const newNav = [...navActive];
                      newNav.push(item.name);
                      setNavActive(newNav);
                    } else {
                      const newNav = navActive.filter(
                        (navItem) => navItem !== item.name
                      );
                      setNavActive(newNav);
                    }
                  }}
                  cursor={"pointer"}
                >
                  <Link to={item.path}>
                    <Flex
                      alignItems={"center"}
                      gap={"5px"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        color={
                          navActive.includes(item.name)
                            ? "var(--color-main)"
                            : ""
                        }
                        fontSize={{ base: "20px", md: "32px" }}
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
                  </Link>
                </Box>
                {item?.children && navActive.includes(item.name) && (
                  <Flex
                    padding={{ base: "24px 24px", md: "32px 48px" }}
                    borderBottom={"0.25px solid #5B5B5B"}
                    direction={"column"}
                    className={"slideDown-animation"}
                  >
                    {item?.children.map((subItem, index) => (
                      <Link
                        to={subItem.path}
                        onClick={() => {
                          if (item.name == enumMenu[0].name) setFarmTab(index);
                          else if (item.name == enumMenu[1].name) {
                            setAirdropTask(index);
                          }
                          handleShowNav();
                        }}
                      >
                        <Flex
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Box
                            color={"#788AA3"}
                            padding={{ base: "8px 24px", md: "8px 48px" }}
                            _hover={{
                              backgroundColor: "#788AA3",
                              borderRadius: "12px",
                              color: "white !important",
                            }}
                            w={"100%"}
                          >
                            <Text fontSize={{ base: "16px", md: "32px" }}>
                              {t(subItem.name)}
                            </Text>
                          </Box>
                        </Flex>
                      </Link>
                    ))}
                  </Flex>
                )}
              </>
            ))}
          </Flex>
        </Box>
        <Flex alignItems={"center"} padding={"36px 24px"} direction={"column"}>
          <MainButton
            width="100%"
            height="60px"
            _hover={{
              backgroundColor: "var(--color-main)",
            }}
            onClick={onOpenConnectWalletModal}
            backgroundColor="var(--color-main)"
          >
            <Text
              fontSize={{ base: "20px" }}
              color={"#FFF"}
              fontWeight="var(--font-text-main)"
            >
              {address ? truncateStr(address) : "Connect Wallet"}
            </Text>
          </MainButton>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavbarMobile;
