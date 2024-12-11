import React, { useEffect, useMemo } from "react";
import { Box, Button, calc, Flex, Image, Text } from "@chakra-ui/react";
import { useAppContext } from "../contexts";
import { useHistory } from "react-router-dom";
import {
  Mission,
  HomePageIcon,
  ReferralIcon,
  WalletIcon,
} from "../theme/components/icon";
import backgroundTop from "../assets/backgroundTop.png";
import backgroundBottom from "../assets/backgroundBottom.png";

export const AppLayout = ({ children }) => {
  useEffect(() => {
    try {
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  return <>{children}</>;
};

export const DefaultLayout = ({ children }) => {
  const { stableSize } = useAppContext();
  const history = useHistory();
  if (
    !(
      [
        "ios",
        "android",
        process.env.REACT_APP_DEV_TOKEN ? "tdesktop" : "---",
      ]?.includes(window?.Telegram?.WebView?.initParams?.tgWebAppPlatform) ||
      process.env.REACT_APP_DEV_TOKEN
    ) &&
    !["/platform"].includes(history?.location?.pathname)
  ) {
    console.log("DefaultLayout", history);
    history?.push("/platform");
  }
  useEffect(() => {
    if (window?.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setBackgroundColor("#FFF");
      window.Telegram.WebApp.setHeaderColor("#FFF");
    }
  }, [window]);
  return (
    <Box
      background="var(--Background)"
      overflow={"hidden"}
      // h={`${stableSize?.height}px`}
      w="full"
    >
      {children}
    </Box>
  );
};
export const CoreLayout = ({ children }) => {
  const { userInfo, stableSize } = useAppContext();
  const history = useHistory();
  const currentPath = history?.location?.pathname;
  if (
    !(
      [
        "ios",
        "android",
        process.env.REACT_APP_DEV_TOKEN ? "tdesktop" : "---",
      ]?.includes(window?.Telegram?.WebView?.initParams?.tgWebAppPlatform) ||
      process.env.REACT_APP_DEV_TOKEN
    ) &&
    !["/platform"].includes(currentPath)
  ) {
    console.log("DefaultLayout", history);
    history?.push("/platform");
  }
  useEffect(() => {
    if (window?.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setBackgroundColor("#FFF");
      window.Telegram.WebApp.setHeaderColor("#FFF");
    }
  }, [window]);

  return (
    <Box background="var(--Background)">
      <Box
        className="bg-top"
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          left: 0,
          w: "100%",
          h: "100%",
          backgroundImage: `url(${backgroundTop})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          zIndex: "1",
          height: "430px !important",
        }}
        _after={{
          content: `""`,
          position: "absolute",
          bottom: "100px",
          left: 0,
          w: "100%",
          h: "100%",
          backgroundImage: `url(${backgroundBottom})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          zIndex: "1",
          height: "430px !important",
        }}
      >
        <Box className="container" display="flex" flexDirection="column">
          <Box
            zIndex={10}
            flex={1}
            display="flex"
            flexDirection="column"
            padding={"24px 24px 0px 24px"}
            w={"full"}
          >
            <Box w={"full"} flex={1}>
              {children}
            </Box>
          </Box>
          <Box minH="13vh" zIndex={10} padding={"16px 24px 24px 24px"}>
            <Flex
              padding={"18px 28px"}
              borderRadius="8px"
              border="1px solid var(--Primary-500)"
              backdropFilter="blur(10px)"
              bg="transparent"
              w="full"
              h="full"
              alignItems="center"
              justifyContent="space-between"
              boxShadow="inset 0px 0px 15px 5px rgba(255, 0, 150, 0.4)"
            >
              {[
                {
                  path: "/",
                  icon: <HomePageIcon width="24px" height="24px" />,
                  name: "Home",
                },
                {
                  path: "/mission",
                  icon: <Mission width="4vh" height="4vh" />,
                  name: "Mission",
                },
                {
                  path: "/referral",
                  icon: <ReferralIcon width="4vh" height="4vh" />,
                  name: "Referral",
                },
                {
                  path: "/wallet",
                  icon: <WalletIcon width="4vh" height="4vh" />,
                  name: "Wallet",
                },
              ].map((e, index) => {
                const isActive = e.path == currentPath;
                return (
                  <Box
                    key={index}
                    mx="7px"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.4s ease",
                      position: "relative",
                      pb: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => history.push(e.path)}
                  >
                    <Box color={isActive ? "#3498db" : "#95a5a6"} mb={"4px"}>
                      {React.cloneElement(e.icon, {
                        color: isActive
                          ? "var(--Primary-500)"
                          : "var(--Grey-500)",
                      })}
                    </Box>
                    <Text
                      mt={"4px"}
                      sx={{
                        color: isActive
                          ? "var(--Primary-500)"
                          : "var(--Grey-500)",
                        position: "absolute",
                        bottom: "-4px",
                        fontSize: "12px",
                      }}
                    >
                      {e.name}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
