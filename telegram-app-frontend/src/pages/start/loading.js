import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useAppContext } from "../../contexts";
import BachiIconImg from "../../assets/logoBachi.png";
const LoadingPage = () => {
  const { stableSize } = useAppContext();

  return (
    <Box
      w={`${stableSize?.width}px`}
      h={`${stableSize?.height}px`}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Flex direction={"column"}>
        <Image
          src={BachiIconImg}
          maxW={"100%"}
          verticalAlign={"middle"}
          alt=""
        />
        <Text
          fontSize={"32px"}
          fontWeight={"600"}
          color={"var(--Primary-500)"}
          textAlign={"center"}
        >
          Bachi Mining
        </Text>
      </Flex>
    </Box>
  );
};

export default LoadingPage;
