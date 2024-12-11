import { Box, Link, Text, Tooltip } from "@chakra-ui/react";
import { AddressCopier } from "../../../components/addressCopier";

export const formatTableValue = (value, key) => {
  switch (key) {
    case "num":
      return (
        <Text>
          {value}
          {"."}
        </Text>
      );
    case "wallet_address":
      return <AddressCopier address={value} digits={18} />;
    case "point":
      return <Text>{value}</Text>;
    case "date":
      const timestamp = value;

      const date = new Date(timestamp);

      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return <Text>{formattedDate}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};
