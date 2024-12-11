import { Button, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#0E001F",
        color: "white",
      },
    },
  },
  breakpoints: {
    sm: "26.875em",
    md: "48em",
    lg: "64em",
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
    "3xl": "120em", // 1920px
  },

  // fonts: {
  //   heading: `'Bruno Ace SC Regular', sans-serif`,
  //   body: `'Bruno Ace SC Regular', sans-serif`,
  // },
});

export default customTheme;
