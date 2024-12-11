import { extendTheme } from "@chakra-ui/react";
import { buttonStyles } from "./components/button";
import { inputStyles } from "./components/input";

export default extendTheme(
  buttonStyles,
  inputStyles

  // { breakpoints, fonts, fontSizes }, // Breakpoints

  // globalStyles
);
