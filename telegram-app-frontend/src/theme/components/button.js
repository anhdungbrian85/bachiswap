export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "4px",
        transition: ".25s all ease",
        boxSizing: "border-box",
        boxShadow: "none",
        _focus: { boxShadow: "none" },
        _active: { boxShadow: "none" },
      },
      sizes: {
        md: { height: "42px", fontSize: "lg", fontWeights: "semibold" },
      },
      variants: {
        primary: () => ({
          borderRadius: "4px",
          border: "none",
          background: "var(--Primary-500)",
          boxShadow: "none",
          // bg: "#fa6400",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "normal",
          _focus: {
            borderRadius: "4px",
            border: "none",
            background: "var(--Primary-500)",
            boxShadow: "none",
            color: "#FFF",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "normal",
          },
          _active: { background: "var(--Primary-500)" },
          _hover: { background: "var(--Primary-500)" },
          _disable: { bg: "gray" },
        }),
        pink: () => ({
          borderRadius: "4px",
          border: "none",
          background: "var(--Primary-300)",
          boxShadow: "none",
          // bg: "#fa6400",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "normal",
          _focus: {
            borderRadius: "4px",
            border: "none",
            background: "var(--Primary-300)",
            boxShadow: "none",
            color: "#FFF",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "normal",
          },
          _active: { background: "var(--Primary-300)" },
          _hover: { background: "var(--Primary-300)" },
          _disable: { bg: "gray" },
        }),
        white: () => ({
          borderRadius: "4px",
          border: "none",
          background: "#fff",
          boxShadow: "none",
          // bg: "#fa6400",
          color: "var(--Primary-500)",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "normal",
          _focus: {
            borderRadius: "4px",
            border: "none",
            background: "#fff",
            boxShadow: "none",
            color: "var(--Primary-500)",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "normal",
          },
          _active: { background: "#fff" },
          _hover: { background: "#fff" },
          _disable: { bg: "gray" },
        }),
        transparent: () => ({
          borderRadius: "4px",
          border: "none",
          background: "transparent",
          boxShadow: "none",
          // bg: "#fa6400",
          color: "var(--Grey-500)",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "normal",
          _focus: {
            borderRadius: "4px",
            border: "none",
            background: "transparent",
            boxShadow: "none",
            color: "var(--Grey-500)",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "normal",
          },
          _active: { background: "transparent" },
          _hover: { background: "transparent" },
          _disable: { bg: "gray" },
        }),
        pinktransparent: () => ({
          borderRadius: "4px",
          border: "1px solid var( --Primary-500)",
          background: "transparent",
          boxShadow: "none",
          // bg: "#fa6400",
          color: "var(--Grey-500)",
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "normal",
          _focus: {
            borderRadius: "4px",
            border: "none",
            background: "transparent",
            boxShadow: "none",
            color: "var(--Grey-500)",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "normal",
          },
          _active: {
            background: "transparent",
            border: "1px solid var( --Primary-500)",
          },
          _hover: { background: "transparent" },
          _disable: { bg: "gray" },
        }),
      },
      defaultProps: {
        variant: "primary",
      },
    },
  },
};