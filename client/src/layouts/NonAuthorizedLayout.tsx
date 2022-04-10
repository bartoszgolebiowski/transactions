import { Container } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "react-router-dom";

const NonAuthorizedLayout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default NonAuthorizedLayout;
