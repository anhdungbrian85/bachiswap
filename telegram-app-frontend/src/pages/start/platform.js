import { Box, Button, Flex, Image, Img, Text } from "@chakra-ui/react";
import { useAppContext } from "../../contexts";
import BachiIconImg from "../../assets/logoBachi.png";
import Telegram from "../../assets/icons/telegram.png";
import Tw from "../../assets/icons/tw-mission.png";
import Discord from "../../assets/icons/discord-mission.png";
import Bachi from "../../assets/icons/bachi-mission.svg";
import { useState } from "react";
import QRCode from "react-qr-code";
import backgroundTop from "../../assets/backgroundTop.png";
import backgroundBottom from "../../assets/backgroundBottom.png";

const Platform = () => {
  const { stableSize } = useAppContext();
  const [inputValue, setInputValue] = useState("https://t.me/bachiapp_bot");

  return (
    <Box position="relative" overflow="hidden">
      {/* Ảnh nền trên */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="430px"
        backgroundImage={`url(${backgroundTop})`}
        backgroundSize="cover"
        backgroundPosition="top"
        zIndex="0"
      />
      {/* Ảnh nền dưới */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        width="100%"
        height="430px"
        backgroundImage={`url(${backgroundBottom})`}
        backgroundSize="cover"
        backgroundPosition="bottom"
        zIndex="0"
      />

      {/* Nội dung chính */}
      <Flex
        direction="column"
        alignItems="center"
        zIndex="10"
        position="relative"
        mt="42px"
      >
        <Image src={BachiIconImg} maxW="144px" h="100px" alt="Bachi Icon" />

        <Box mt="32px" p="24px">
          <Flex
            p="20px"
            borderRadius="8px"
            bg="var(--White)"
            w="160px"
            h="160px"
            alignItems="center"
            justifyContent="center"
          >
            <QRCode
              value={inputValue}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </Flex>
        </Box>

        <Flex flexDirection="column" alignItems="center" w="80%" mt="56px">
          <Text
            fontSize="30px"
            fontWeight="700"
            color="var(--Primary-500)"
            textAlign="center"
          >
            BEST EXPERIENCED
          </Text>
          <Text
            fontSize="30px"
            fontWeight="700"
            color="var(--White)"
            textAlign="center"
          >
            ON MOBILE, PLAY ON YOUR PHONE
          </Text>
        </Flex>

        <Flex
          flexDirection="column"
          gap="12px"
          w="100%"
          p="72px 24px 130px 24px"
        >
          <Flex alignItems="center" justifyContent="space-between" gap="16px">
            <Button
              variant="white"
              border="2px solid var(--Primary-500)"
              w="50%"
            >
              <Img src={Telegram} />
            </Button>
            <Button
              border="2px solid var(--Primary-500)"
              variant="white"
              w="50%"
            >
              <Img boxSize="38px" src={Tw} />
            </Button>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" gap="16px">
            <Button
              border="2px solid var(--Primary-500)"
              variant="white"
              w="50%"
            >
              <Img boxSize="38px" src={Discord} />
            </Button>
            <Button
              border="2px solid var(--Primary-500)"
              variant="white"
              w="50%"
            >
              <Img boxSize="38px" src={Bachi} />
            </Button>
          </Flex>
        </Flex>
        <Flex
          width={"100%"}
          h={"64px"}
          bg={"linear-gradient(180deg, rgba(4, 9, 38, 0.00) 0%, #39001C 100%)"}
        ></Flex>
      </Flex>
    </Box>
  );
};

export default Platform;
