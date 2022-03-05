import { Container } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const BasicLayout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default BasicLayout;
