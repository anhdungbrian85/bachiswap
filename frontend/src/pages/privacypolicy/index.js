import React from "react";
import SectionContainer from "../../components/container";
import { Box, Flex, Image, List, ListItem, Text } from "@chakra-ui/react";
import termsbackground from "../../assets/img/terms-background.png";
import termsbackgrounddown from "../../assets/img/terms-background-down.png";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation("PrivacyPolicy");
  const terms = [
    {
      title: t("Introduction"),
      info: t(
        "This Privacy Policy outlines how Bachiswap collects, uses, shares, and protects your personal information when you use our trading platform. We are committed to respecting your privacy and safeguarding your personal data."
      ),
    },
    {
      title: t("Information We Collect"),
      info: t(
        "Personal Information: We may collect personal information when you create an account, including your name, email address, phone number, IP address, and identity verification information"
      ),
      info1: t(
        "Transaction Information: We collect information about your transactions on the platform, such as the types of cryptocurrencies, quantities, prices, and transaction times."
      ),
      info2: t(
        "Device Information: We may collect information about the device you use to access our platform, including the operating system, browser, and IP address."
      ),
    },
    {
      title: t("How We Use Your Information"),
      info: t(
        "Providing Services: We use your personal information to verify your identity, create an account, process transactions, and provide customer support."
      ),
      info1: t(
        "Securing Your Account: We use your personal information to protect your account and prevent fraudulent activity."
      ),
      info2: t(
        "Improving Services: We use information about your transactions to analyze and improve our services."
      ),
      info3: t(
        "Compliance with Laws: We may use your information to comply with legal and regulatory requirements."
      ),
    },
    {
      title: t("Sharing of Information"),
      info: t(
        "We do not share your personal information with any third parties, except as required by law or to protect our rights and property."
      ),
    },
    {
      title: t("Data Security"),
      info: t(
        "We employ technical and organizational security measures to protect your personal information from loss, unauthorized access, disclosure, alteration, use, or destruction."
      ),
    },
    {
      title: t("Your Rights"),
      info: t(
        "You have the right to access, modify, and delete your personal information. You also have the right to object to the processing of your personal information."
      ),
    },
    {
      title: t("Changes to This Privacy Policy"),
      info: t(
        "We may update this Privacy Policy from time to time. We will notify you of any significant changes.  "
      ),
    },
    {
      title: t("Contact Us"),
      info: t(
        "Bachiswap reserves the right to change these Terms of Service at any time. We will notify you of any material changes."
      ),
    },
    {
      title: t("Contact"),
      info: t(
        "If you have any questions or concerns about this Privacy Policy, please contact us using the contact information provided on the Bachiswap website. Note This is a general template. Bachiswap may have a more detailed privacy policy with specific terms and conditions. Please refer to the official Bachiswap website for the most accurate information."
      ),
    },
  ];

  const termservices = [
    {
      title: t(
        "Additionally, when drafting a privacy policy, consider the following:"
      ),
      services: t(
        "Compliance with Laws: Ensure your policy complies with current data protection regulations."
      ),
      services1: t(
        "Transparency: Use clear and understandable language so users can easily comprehend how their information is handled."
      ),
      services2: t(
        "Data Security: Implement robust security measures to protect personal information."
      ),
      services3: t("User Rights: Guarantee users have control over their data"),
    },
  ];
  return (
    <>
      <SectionContainer
        padding={{
          base: "0px 47px 0px 47px",
          lg: "0px 112px 0px 112px",
          "3xl": "0px 188px 0px 188px",
        }}
        backgroundImage={`url(${termsbackground})`}
        backgroundSize={{ base: "100% 100%", "3xl": "100%" }}
        backgroundRepeat={"no-repeat"}
        height={{ base: "270px", lg: "340px", xl: "400px", "3xl": "900px" }}
      >
        <Flex alignItems={"center"} justifyContent={"center"}>
          <Text
            textAlign={"center"}
            marginTop={{
              base: "70px",
              md: "80px",
              lg: "110px",
              xl: "130px",
              "3xl": "250px",
            }}
            fontSize={{ base: "32px", "3xl": "56px" }}
            lineHeight={{ base: "", "3xl": "64px" }}
            letterSpacing={"-1px"}
            fontFamily="var(--font-text-main)"
          >
            {t("Privacy Policy")}
          </Text>
        </Flex>
      </SectionContainer>
      <SectionContainer
        padding={{
          base: "0px 47px 0px 47px",
          lg: "0px 112px 0px 112px",
          "3xl": "0px 188px 0px 188px",
        }}
      >
        {/* <Flex
          flexDirection={"column"}
          gap={{ base: "40px", "3xl": "80px" }}
          paddingTop={"10px"}
        >
          {terms.map((item, index) => (
            <Flex key={index} flexDirection={"column"} gap={"16px"}>
              <Text
                fontSize={{
                  base: "20px",
                  lg: "24px",
                  xl: "28px",
                  "3xl": "32px",
                }}
                fontFamily="var(--font-text-main)"
                letterSpacing={"-1px"}
                lineHeight={{ "3xl": "40px" }}
              >
                {item.title}
              </Text>
              <Text
                fontSize={{ base: "16px", lg: "20px", "3xl": "24px" }}
                fontFamily="var(--font-text-main)"
                letterSpacing={"-1px"}
                lineHeight={{ base: "28px" }}
              >
                {item.info}
              </Text>
            </Flex>
          ))}
        </Flex> */}
        <Flex
          flexDirection={"column"}
          gap={{ base: "40px", "3xl": "80px" }}
          paddingTop={"10px"}
        >
          {terms.map((item, index) => (
            <React.Fragment key={index}>
              {index === 1 || index === 2 ? (
                <Flex
                  flexDirection={"column"}
                  gap={{ base: "40px", "3xl": "80px" }}
                >
                  <Flex flexDirection={"column"} gap={"16px"}>
                    <Text
                      fontSize={{
                        base: "20px",
                        lg: "24px",
                        xl: "28px",
                        "3xl": "32px",
                      }}
                      fontFamily="var(--font-text-main)"
                      lineHeight={{ "3xl": "40px" }}
                      letterSpacing={"-1px"}
                    >
                      {item.title}
                    </Text>
                    <List spacing={2} styleType="disc">
                      {item.info && (
                        <ListItem marginBottom={"16px"} marginLeft={"30px"}>
                          <Text
                            fontSize={{
                              base: "16px",
                              lg: "20px",
                              "3xl": "24px",
                            }}
                            fontFamily="var(--font-text-main)"
                            lineHeight={{ "3xl": "32px" }}
                            letterSpacing={"-1px"}
                          >
                            {item.info}
                          </Text>
                        </ListItem>
                      )}
                      {item.info1 && (
                        <ListItem marginBottom={"16px"} marginLeft={"30px"}>
                          <Text
                            fontSize={{
                              base: "16px",
                              lg: "20px",
                              "3xl": "24px",
                            }}
                            fontFamily="var(--font-text-main)"
                            lineHeight={{ "3xl": "32px" }}
                            letterSpacing={"-1px"}
                          >
                            {item.info1}
                          </Text>
                        </ListItem>
                      )}
                      {item.info2 && (
                        <ListItem marginBottom={"16px"} marginLeft={"30px"}>
                          <Text
                            fontSize={{
                              base: "16px",
                              lg: "20px",
                              "3xl": "24px",
                            }}
                            fontFamily="var(--font-text-main)"
                            lineHeight={{ "3xl": "32px" }}
                            letterSpacing={"-1px"}
                          >
                            {item.info2}
                          </Text>
                        </ListItem>
                      )}
                    </List>
                  </Flex>
                </Flex>
              ) : (
                <Flex flexDirection={"column"} gap={"16px"}>
                  <Text
                    fontSize={{
                      base: "20px",
                      lg: "24px",
                      xl: "28px",
                      "3xl": "32px",
                    }}
                    fontFamily="var(--font-text-main)"
                    letterSpacing={"-1px"}
                    lineHeight={{ "3xl": "40px" }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize={{ base: "16px", lg: "20px", "3xl": "24px" }}
                    fontFamily="var(--font-text-main)"
                    letterSpacing={"-1px"}
                    lineHeight={{ base: "28px" }}
                  >
                    {item.info}
                  </Text>
                </Flex>
              )}
            </React.Fragment>
          ))}
        </Flex>
      </SectionContainer>
      <SectionContainer
        padding={{ base: "0px 47px 0px 47px", "3xl": "0px 188px 0px 188px" }}
        height={{ base: "205px", lg: "429px", "3xl": "569px" }}
        position={"relative"}
      >
        <Image
          width={"100%"}
          height={{
            base: "430px",
            md: "630px",
            lg: "830px",
            xl: "930px",
            "3xl": "1030px",
          }}
          src={termsbackgrounddown}
          position={"absolute"}
          left={0}
          top={{ base: "-180px", md: "-340px", xl: "-380px" }}
        />
      </SectionContainer>

      <SectionContainer
        padding={{
          base: "0px 47px 76px 47px",
          lg: "0px 112px 100px 112px",
          "3xl": "0px 188px 146px 188px ",
        }}
      >
        <Flex flexDirection={"column"} gap={{ base: "32px", "3xl": "40px" }}>
          <Text
            fontSize={{ base: "20px", "3xl": "24px" }}
            lineHeight={{ "3xl": "32px" }}
            letterSpacing={"-1px"}
            fontFamily="var(--font-text-main)"
          >
            {t(
              "Note: This is a general template. Bachiswap may have more detailed Terms of Service with specific terms and conditions. Please refer to the official Bachiswap website for the most accurate information."
            )}
          </Text>
          <Flex flexDirection={"column"} gap={{ base: "40px", "3xl": "80px" }}>
            {termservices.map((item, index) => (
              <Flex flexDirection={"column"} gap={"16px"} key={index}>
                <Text
                  fontSize={{
                    base: "20px",
                    lg: "24px",
                    xl: "28px",
                    "3xl": "32px",
                  }}
                  fontFamily="var(--font-text-main)"
                  lineHeight={{ "3xl": "40px" }}
                  letterSpacing={"-1px"}
                >
                  {item.title}
                </Text>
                <List spacing={2} styleType="disc">
                  {Object.values(item)
                    .slice(1)
                    .map((service, i) => (
                      <ListItem
                        key={i}
                        marginBottom={"16px"}
                        marginLeft={"30px"}
                      >
                        <Text
                          fontSize={{ base: "16px", lg: "20px", "3xl": "24px" }}
                          fontFamily="var(--font-text-main)"
                          lineHeight={{ "3xl": "32px" }}
                          letterSpacing={"-1px"}
                        >
                          {service}
                        </Text>
                      </ListItem>
                    ))}
                </List>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </SectionContainer>
    </>
  );
};

export default PrivacyPolicy;
