import { Text } from "@chakra-ui/react";

export const formatTableValue = (value, key) => {
  switch (key) {
    case "time":
      return <Text>{value}</Text>;
    case "type":
      return <Text>{value}</Text>;
    default:
      return <Text>{value}</Text>;
  }
};
