import { Box, Link, Text, Tooltip } from "@chakra-ui/react";
import { AddressCopier } from "../../../../components/addressCopier";

export const formatTableValue = (value, key) => {
  switch (key) {
    case "num":
      return (
        <Text>
          {value}
          {"."}
        </Text>
      );
    case "type":
      return <Text>{value}</Text>;
    case "caller":
      return <AddressCopier address={value} digits={18} />;
    case "status":
      let color;
      if (value === "pending" || value === "보류 중") color = "#F8A401";
      else if (
        value === "success" ||
        value === "성공" ||
        value === "सफलता" ||
        value === "نجاح"
      )
        color = "#23F600";
      else color = "#E42493";
      return <Text color={color}>{value}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};

export const formatTableValueMobile = (value, key) => {
  switch (key) {
    case "num":
      return (
        <Text>
          {value}
          {"."}
        </Text>
      );
    case "type":
      return <Text>{value}</Text>;
    case "caller":
      return <AddressCopier address={value} digits={10} />;
    case "status":
      return <Text>{value}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};
