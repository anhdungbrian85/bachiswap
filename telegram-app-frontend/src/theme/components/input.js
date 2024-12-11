import { background, border } from "@chakra-ui/react";
import { color } from "framer-motion";

export const inputStyles = {
  components: {
    Input: {
      baseStyle: {
        field: {
          fontWeight: "400",
          color: "var(--White)",
          border: "1px solid",
          background: "var(--Background)",
          fontSize: "12px",
          transition: ".25s all ease",
          boxShadow: "none",
          _focus: {
            boxShadow: "none",
            background: "var(--Background)",
          },
          _hover: {
            background: "var(--Background)",
          },
          _active: {
            background: "var(--Background)",
          },
        },
      },

      variants: {
        primary: {
          field: {
            border: "1px solid",
            borderColor: "var(--Primary-500)",
            background: "var(--Background)",
            borderRadius: "4px",
            _focus: {
              borderColor: "var(--Primary-500)",
            },
          },
        },
        white: {
          field: {
            border: "1px solid",
            borderColor: "var(--Grey-400)",
            background: "var(--Background)",
            borderRadius: "8px",
            _focus: {
              borderColor: "var(--White)",
            },
          },
        },
      },

      defaultProps: {
        variant: "primary",
        size: "md",
      },
    },
  },
};
