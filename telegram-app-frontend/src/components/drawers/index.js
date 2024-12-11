import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Box,
  DrawerFooter,
} from "@chakra-ui/react";

const BachiDrawer = ({ placement, onClose, isOpen, children }) => {
  return (
    <Drawer
      placement={placement}
      onClose={onClose}
      isOpen={isOpen}
      autoFocus={false}
      trapFocus={false}
    >
      <DrawerOverlay />
      <DrawerContent
        bg={"var(--Background)"}
        borderRadius={"16px 16px 0px 0px"}
        pb={"24px"}
      >
        <DrawerHeader>
          <Flex justifyContent={"space-between"} align={"center"}>
            <Box fontSize={"16px"} color={"var(--Background)"}>
              Close
            </Box>
            <Box
              w={"146px"}
              h={"8px"}
              borderRadius={"8px"}
              bg={"var(--White)"}
            ></Box>
            <Box
              fontSize={"16px"}
              color={"var(--Primary-500)"}
              cursor={"pointer"}
              fontWeight={"400"}
              onClick={onClose}
            >
              Close
            </Box>
          </Flex>
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BachiDrawer;
