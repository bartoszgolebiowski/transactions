import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import * as React from "react";

type Props = { onClose: () => void };

const MenuHeader: React.FC<Props> = props => {
  const { children, onClose } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flex: 1,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
        <IconButton
          position="absolute"
          colorScheme="whiteAlpha"
          aria-label="User menu"
          size="md"
          right="0.5"
          icon={<SmallCloseIcon color="GrayText" />}
          onClick={onClose}
        />
      </Box>
    </Box>
  );
};

export default MenuHeader;
