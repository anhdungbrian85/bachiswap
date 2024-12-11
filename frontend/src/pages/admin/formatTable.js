import { Box, Link, Text, Tooltip } from "@chakra-ui/react";
import { AddressCopier } from "../../components/addressCopier";

export const formatTableValue = (value, key) => {
  switch (key) {
    case "timestamps":
      const timestamp = value;

      const date = new Date(timestamp);

      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return <Text>{formattedDate}</Text>;

    case "caller":
      return <AddressCopier address={value} digits={18} />;
    case "ipaddress":
      return <Text>{value}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};

export const formatTableValueMobile = (value, key) => {
  switch (key) {
    case "timestamps":
      const timestamp = value;

      const date = new Date(timestamp);

      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return <Text>{formattedDate}</Text>;

    case "caller":
      return <AddressCopier address={value} digits={10} />;
    case "ipaddress":
      return <Text>{value}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};
