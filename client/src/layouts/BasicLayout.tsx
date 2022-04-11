import { Box, Container } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "react-router-dom";

import UserMenu from "@/components/layouts/UserMenu";

const BasicLayout = () => {
  return (
    <Container minW="20rem">
      <Box as="nav" mt="2" display="flex" flexDir="row">
        <Box marginLeft="auto" display="flex" flexDir="row-reverse" gap="2">
          <UserMenu />
        </Box>
      </Box>
      <Outlet />
    </Container>
  );
};

export default BasicLayout;
