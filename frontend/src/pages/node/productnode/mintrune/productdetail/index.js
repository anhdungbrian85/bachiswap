import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Input, Select, Text } from "@chakra-ui/react";
import { Link, useLocation, useParams } from "react-router-dom";
//import component
import SectionContainer from "../../../../../components/container";
import CommonButton from "../../../../../components/button/commonbutton";
import Quantity from "../../../../../components/quantity";
import ReferralCodeForm from "../../../../../components/referralform";
import Message from "../../../../../components/message";
//import image
import backgroundNode from "../../../../../assets/img/node/background-node.png";
import backgroundReferral from "../../../../../assets/img/node/background-referral.png";
import iconNodedetail from "../../../../../assets/img/node/icon-node-detail.png";
import iconSuccess from "../../../../../assets/img/node/icon-message-success.png";
import iconError from "../../../../../assets/img/node/icon-message-error.png";
// import productCoreI5 from "../../../../../assets/img/node/product-corei5.png";
import iconReferral from "../../../../../assets/img/node/icon-referral-node.png";
import iconFrame from "../../../../../assets/img/node/icon-node-Frame.png";
import CustomSelect from "../../../../../components/customdropdown";
import { selectBillNode } from "../../../../../store/slices/billNodeSlice";
import { useSelector } from "react-redux";
import { formatNumDynDecimal } from "../../../../../utils";

const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [count, setCount] = useState(0);
  const billNode = useSelector(selectBillNode);
  console.log({ billNode });

  const handlePayNow = () => {
    setIsLoading(true);
    setPaymentStatus(null);
    // console.log(isLoading, "isLoading");

    setTimeout(() => {
      setIsLoading(true);
      const success = 0 > 0.5; // Kết quả random để check
      if (success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failure");
      }
    }, 3000);
  };
  //
  useEffect(() => {
    if (isLoading == true || paymentStatus) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading, paymentStatus]);
  // close message
  const handleCloseMessage = () => {
    setIsLoading(false);
    setPaymentStatus(null);
  };

  const location = useLocation();
  const { products } = location.state || {};

  if (!products) {
    return <div>No product selected</div>;
  }
  return (
    <>
      <Image
        src={backgroundNode}
        position={"absolute"}
        right={"0px"}
        top={"70px"}
      />
      <Image
        src={backgroundReferral}
        position={"absolute"}
        right={"0"}
        top={"380px"}
      />
      <SectionContainer
        marginLeft={"44px"}
        marginRight={"40px"}
        paddingLeft={"0px"}
        paddingRight={"0px"}
        position={"relative"}
      >
        <Flex flexDirection={"column"}>
          <CommonButton
            border="0.5px solid var(--color-main)"
            marginTop={"59px"}
            width={"100%"}
            height={"100%"}
          >
            <Flex alignItems={"center"}>
              <Box width={"40%"} height={"100%"}>
                <Image
                  src={products.image}
                  width={"100%"}
                  height={"100%"}
                  padding={"50px"}
                />
              </Box>
              <Box
                backgroundColor="var(--color--background--extra)"
                width={"100%"}
                height={"100%"}
                borderLeft="0.5px solid var(--color-main)"
              >
                <Flex width={"100%"} height={"100%"} flexDirection={"column"}>
                  <Flex
                    flexDirection={"column"}
                    gap={"22px"}
                    padding={"46px 42px 43px 43px"}
                    borderBottom="0.5px solid var(--color-main)"
                  >
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      padding={"44px 44px 44px 47px"}
                      border="0.25px solid #FCDDEC"
                    >
                      <Text
                        fontSize={"32px"}
                        fontWeight={400}
                        fontFamily="var(--font-text-main)"
                      >
                        Key Balance
                      </Text>
                      <Text
                        fontSize={"40px"}
                        fontWeight={600}
                        color="var(--color-main)"
                      >
                        0 DeBoard Key
                      </Text>
                    </Flex>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      padding={"44px 44px 44px 47px"}
                      border="0.25px solid #FCDDEC"
                    >
                      <Text
                        fontSize={"28px"}
                        fontWeight={400}
                        fontFamily="var(--font-text-main)"
                      >
                        My Referral Code (5%):
                      </Text>
                      <Flex gap={"22px"} alignItems={"center"}>
                        <Text
                          fontSize={"24px"}
                          fontWeight={400}
                          color={"#B2B2B2"}
                        >
                          https://deboard.gg/mint?ref=WdXlC0A4DY
                        </Text>
                        <Image src={iconNodedetail} />
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex alignContent={"center"}>
                    <Flex
                      width={"50%"}
                      flexDirection={"column"}
                      gap={"32px"}
                      padding={"71px 0px 70px 67px"}
                      borderRight="0.5px solid var(--color-main)"
                    >
                      <Flex alignItems={"center"} gap={"20px"}>
                        <Text
                          fontSize={"32px"}
                          fontWeight={400}
                          color={"#8F8F8F"}
                          fontFamily="var(--font-text-main)"
                        >
                          Key Incentive Rewards
                        </Text>
                        <Box
                          width="26px"
                          height="26px"
                          borderRadius="50%"
                          backgroundColor=""
                          border="2px solid #8F8F8F"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            color="#8F8F8F"
                            fontWeight="bold"
                            fontSize="16px"
                          >
                            !
                          </Text>
                        </Box>
                      </Flex>
                      <Text fontSize={"36px"} fontWeight={600}>
                        0 DEVAX
                      </Text>
                    </Flex>
                    <Flex
                      flexDirection={"column"}
                      gap={"32px"}
                      padding={"71px 0px 70px 67px"}
                    >
                      <Text
                        fontSize={"32px"}
                        fontWeight={400}
                        color={"#8F8F8F"}
                        fontFamily="var(--font-text-main)"
                      >
                        Key Farm Rewards
                      </Text>
                      <Text fontSize={"36px"} fontWeight={600}>
                        0 DEVAX
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </CommonButton>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            paddingTop={"71px"}
          >
            <Text
              textAlign={"center"}
              fontSize={"86px"}
              fontWeight={400}
              fontFamily="var(--font-heading)"
            >
              Mint Your Keys
            </Text>
            <CommonButton
              width={"100%"}
              height={"100%"}
              border="0.5px solid var(--color-main)"
              backgroundColor={"#231A2E"}
            >
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={"58px 60px 56px 59px"}
                borderBottom="0.5px solid var(--color-main)"
              >
                <Flex flexDirection={"column"} gap={"23px"}>
                  <Text
                    fontSize={"36px"}
                    fontWeight={400}
                    lineHeight={"normal"}
                    fontFamily="var(--font-text-main)"
                  >
                    Deboard Entry Key
                  </Text>
                  <Text
                    fontSize={"24px"}
                    fontWeight={400}
                    lineHeight={"normal"}
                    color={"#B2B2B2"}
                  >
                    The Key to asserting your eligibility for network challenges
                    and incentives.
                  </Text>
                </Flex>
                <Flex alignItems={"center"} gap={"50px"}>
                  <Text
                    fontSize={"32px"}
                    fontWeight={400}
                    lineHeight={"normal"}
                    color={"#B2B2B2"}
                  >
                    QUANTITY
                  </Text>
                  <Quantity count={count} setCount={setCount} />
                </Flex>
              </Flex>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={"58px 60px 56px 59px"}
                borderBottom="0.5px solid var(--color-main)"
                flexDirection={"column"}
                gap={"79px"}
              >
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Flex flexDirection={"column"} gap={"23px"}>
                    <Text
                      fontSize={"36px"}
                      fontWeight={400}
                      lineHeight={"normal"}
                      fontFamily="var(--font-text-main)"
                    >
                      1x Deboard Key
                    </Text>
                    <Text
                      fontSize={"24px"}
                      fontWeight={400}
                      lineHeight={"normal"}
                      color={"#B2B2B2"}
                    >
                      {formatNumDynDecimal(billNode?.price)} ETH per key
                    </Text>
                  </Flex>
                  <CustomSelect />
                </Flex>
                <Flex
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  <Text
                    fontSize={"36px"}
                    fontWeight={400}
                    fontFamily="var(--font-text-main)"
                  >
                    Pay
                  </Text>
                  <Text fontSize={"36"} fontWeight={600}>
                    {formatNumDynDecimal(billNode?.price)} ETH
                  </Text>
                </Flex>
              </Flex>
              <Flex
                padding={"62px 59px 64px 56px"}
                borderBottom="0.5px solid var(--color-main)"
              >
                <ReferralCodeForm />
              </Flex>
              <Flex alignItems={"center"} justifyContent={"center"}>
                <CommonButton
                  width={"750px"}
                  height={"100px"}
                  backgroundColor="var(--color-main)"
                  margin={"58px 0 52px 0"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  onClick={handlePayNow}
                >
                  <Text textAlign={"center"} fontSize={"32px"} fontWeight={500}>
                    PAY NOW
                  </Text>
                </CommonButton>
              </Flex>
            </CommonButton>
          </Flex>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            paddingTop={"71px"}
          >
            <Text
              textAlign={"center"}
              fontSize={"86px"}
              fontWeight={400}
              fontFamily="var(--font-heading)"
            >
              Referral Program
            </Text>
            <Flex flexDirection={"column"} gap={"66px"} width={"100%"}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingTop={"108px"}
                gap={"18px"}
              >
                {[
                  "YOUR INVITEES",
                  "TOTAL BACHI COMMISSION",
                  "TOTAL ETH COMMISSION",
                ].map((title, index) => (
                  <Box
                    key={index}
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
                        gap={"30px"}
                        paddingTop={"45px"}
                        paddingLeft={"50px"}
                        paddingBottom={"43px"}
                      >
                        <Text
                          fontSize={"32px"}
                          fontWeight={400}
                          fontFamily="var(--font-text-extra)"
                          color="var(--color-main)"
                          lineHeight={"normal"}
                        >
                          {title}
                        </Text>
                        {index === 0 ? (
                          <Text
                            fontSize={"24px"}
                            fontWeight={600}
                            lineHeight={"normal"}
                          >
                            ...
                          </Text>
                        ) : (
                          <Flex alignItems="center">
                            {index === 2 && (
                              <Box
                                as="img"
                                src={iconReferral}
                                alt="ETH Icon"
                                mr={2}
                              />
                            )}
                            <Text
                              fontSize={"24px"}
                              fontWeight={600}
                              lineHeight={"normal"}
                            >
                              0 {index === 1 ? "BACHI" : "ETH"}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </CommonButton>
                  </Box>
                ))}
              </Flex>
              <CommonButton
                border="0.5px solid var(--color-main)"
                backgroundColor="var(--color--background--extra)"
              >
                <Grid
                  templateColumns="repeat(3, 1fr)"
                  gap={6}
                  alignItems="center"
                  paddingTop={"26px"}
                  paddingBottom={"25px"}
                >
                  <Text paddingLeft={"50px"} fontSize={"24px"} fontWeight={500}>
                    Time
                  </Text>
                  <Text paddingLeft={"50px"} fontSize={"24px"} fontWeight={500}>
                    User Wallet
                  </Text>
                  <Text paddingLeft={"50px"} fontSize={"24px"} fontWeight={500}>
                    Key Price
                  </Text>
                </Grid>
              </CommonButton>
            </Flex>
          </Flex>
        </Flex>
      </SectionContainer>
      <Message
        isVisible={isLoading && paymentStatus === null}
        onClose={handleCloseMessage}
      >
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Image src={iconFrame} width={"250px"} />
          <Text
            fontSize={"24px"}
            fontWeight={400}
            fontFamily="var(--font-text-main)"
            marginTop={"50px"}
          >
            Transaction is underway...
          </Text>
        </Flex>
      </Message>
      <Message
        isVisible={isLoading && paymentStatus === "success"}
        onClose={handleCloseMessage}
      >
        <Flex flexDirection={"column"} alignItems={"center"} gap={"30px"}>
          <Image src={iconSuccess} />
          <Text
            fontSize={"28px"}
            fontWeight={400}
            fontFamily="var(--font-text-main)"
          >
            You have just unlocked a new world with this key!
          </Text>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={"14px"}
          >
            <Text
              fontSize={"28px"}
              fontWeight={400}
              fontFamily="var(--font-text-main)"
            >
              Link Referral:
            </Text>
            <Flex
              alignItems={"center"}
              gap={"10px"}
              padding={"10px"}
              border={"1px solid #FCDDEC"}
            >
              <Text fontSize={"24px"} fontWeight={300}>
                http://bachi.swap.io/Bachi-Taiko-Swap?referral-code=153-2...
              </Text>
              <Image src={iconNodedetail} />
            </Flex>
          </Flex>
          <Flex
            alignItems={"center"}
            width={"100%"}
            gap={"30px"}
            justifyContent={"space-between"}
          >
            <CommonButton
              backgroundColor="var(--color-main)"
              width="50%"
              padding="10px"
              display="flex"
              justifyContent="center"
            >
              <Text fontSize={"20px"} fontWeight={500}>
                Pay more and enjoy a moment
              </Text>
            </CommonButton>
            <CommonButton
              backgroundColor="#FFF"
              width="50%"
              padding="10px"
              display="flex"
              justifyContent="center"
            >
              <Text color={"#000"} fontSize={"20px"} fontWeight={500}>
                History Let’s Goooo
              </Text>
            </CommonButton>
          </Flex>
          <Link>
            <Text
              fontSize="20px"
              color="var(--color-main)"
              fontWeight={500}
              textDecoration={"underline"}
            >
              View on Taiko
            </Text>
          </Link>
        </Flex>
      </Message>

      <Message
        isVisible={isLoading && paymentStatus === "failure"}
        onClose={handleCloseMessage}
      >
        <Flex flexDirection={"column"} alignItems={"center"} gap={"10px"}>
          <Image src={iconError} />
          <Text
            fontSize={"24px"}
            fontFamily="var(--font-text-main)"
            fontWeight={400}
          >
            Transaction failed.
          </Text>
          <CommonButton
            backgroundColor="#FFF"
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            padding={"10px"}
          >
            <Text color={"#000"} fontSize={"20px"} fontWeight={600}>
              Try again
            </Text>
          </CommonButton>
        </Flex>
      </Message>
      {isLoading && (
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

export default ProductDetail;
