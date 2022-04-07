import { Box, Container } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

import UserMenu from "@/components/layouts/UserMenu";

const BasicLayout = () => {
  return (
    <Container minW="30rem" maxW="100vw">
      <Box as="nav" mt="3px" display="flex" flexDir="row">
        <Box marginLeft="auto" display="flex" flexDir="row-reverse" gap="1rem">
          <UserMenu />
        </Box>
      </Box>
      <Outlet />
    </Container>
  );
};

export default BasicLayout;
