import React from "react";
import SectionContainer from "../../components/container";
import { Box, Flex, Image, List, ListItem, Text } from "@chakra-ui/react";
import termsbackground from "../../assets/img/terms-background.png";
import termsbackgrounddown from "../../assets/img/terms-background-down.png";
import { useTranslation } from "react-i18next";
const Terms = () => {
  const { t } = useTranslation("Terms");
  const terms = [
    {
      title: t("Introduction"),
      info: t(
        "These Terms of Service govern the relationship between Bachiswap and its users. By using our trading platform, you agree to be bound by these terms and conditions."
      ),
    },
    {
      title: t("Service Description"),
      info: t(
        "Bachiswap provides a trading platform that enables users to exchange cryptocurrencies. We do not guarantee the continuous or uninterrupted availability of the service."
      ),
    },
    {
      title: t("User Accounts"),
      info: t(
        "To use the platform, you must create an account. You are responsible for maintaining the security of your account information. Bachiswap is not liable for any losses resulting from the unauthorized use of your account."
      ),
    },
    {
      title: t("Transactions"),
      info: t(
        "All transactions on the Bachiswap platform are peer-to-peer. Bachiswap does not act as an intermediary in these transactions. You are solely responsible for your transactions."
      ),
    },
    {
      title: t("Fees"),
      info: t(
        "Bachiswap may charge fees for its services. Fees will be clearly communicated on the platform."
      ),
    },
    {
      title: t("Limitation of Liability"),
      info: t(
        "Bachiswap is not liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the platform."
      ),
    },
    {
      title: t("Intellectual Property"),
      info: t(
        "All intellectual property rights related to the Bachiswap platform belong to Bachiswap."
      ),
    },
    {
      title: t("Changes to Terms of Service"),
      info: t(
        "Bachiswap reserves the right to change these Terms of Service at any time. We will notify you of any material changes."
      ),
    },
    {
      title: t("Contact"),
      info: t(
        "If you have any questions or concerns about these Terms of Service, please contact us using the contact information provided on the Bachiswap website."
      ),
    },
  ];

  const termservices = [
    {
      title: t("Additional considerations when drafting Terms of Service:"),
      services: t(
        "Compliance with Laws: Ensure your Terms of Service comply with applicable laws and regulations related to cryptocurrency trading."
      ),
      services1: t(
        "Clarity and Fairness: Use clear and understandable language and ensure the terms are fair to both parties."
      ),
      services2: t(
        "User Protection: Clearly define Bachiswap's responsibilities to users and the protections afforded to them."
      ),
      services3: t(
        "Dispute Resolution: Specify how disputes between Bachiswap and users will be resolved."
      ),
    },
    {
      title: t(
        "For further assistance with drafting Terms of Service, consult with a legal expert. Would you like me to add specific clauses to this template?"
      ),
      services: t(
        "Disclaimer of Warranties: Explicitly stating that the platform is provided as is without warranties."
      ),
      services1: t(
        "Indemnification: Requiring users to indemnify Bachiswap for certain claims."
      ),
      services2: t(
        "Governing Law and Jurisdiction: Specifying the governing law and jurisdiction for any disputes."
      ),
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
            {t("Terms & Condition")}
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
        <Flex
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

export default Terms;
