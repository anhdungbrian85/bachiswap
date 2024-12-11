import { Checkbox, Flex, Img, Text } from "@chakra-ui/react";
import Amount from "../../assets/icons/amount.svg";
export const formatTableValue = (value, key) => {
  switch (key) {
    case "time":
      return <Text>{value}</Text>;
    case "type":
      return <Text>{value}</Text>;
    case "amount":
      return (
        <Flex alignItems={"center"} gap={"2px"} justifyContent={"center"}>
          <Img src={Amount} />
          {value}
        </Flex>
      );
    default:
      return (
        <Checkbox
          isChecked
          sx={{
            ".chakra-checkbox__control": {
              w: "24px",
              h: "24px",
              borderRadius: "4px",
              bg: "var(--green-light) !important",
              borderColor: "var(--green-light) !important",
              _hover: { bg: "var(--green-light) !important" },
            },
          }}
        />
      );
  }
};
