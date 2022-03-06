import { Link } from "@chakra-ui/react";
import React from "react";
import { Link as LinkRouter, LinkProps } from "react-router-dom";

const CommonLink = (props: LinkProps) => {
  return <Link as={LinkRouter} color="blue.500" fontWeight="bold" {...props} />;
};

export default CommonLink;
