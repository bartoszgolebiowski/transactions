import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/store/authorization";

const Login = () => {
  const [current, send] = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    send("LOG_IN", Object.fromEntries(formData));
  };

  const isEmailError = current.matches("loggedOut.invalidEmail");
  const isAuthFailed = current.matches("loggedOut.authFailed");

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} mt="10" mx="5">
        <Heading>Login</Heading>
        {isAuthFailed ? (
          <Heading color="red.500">Login has failed, try again</Heading>
        ) : null}
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input required id="email" type="email" name="email" />
          {isEmailError ? (
            <Heading color="red.500">Email is required</Heading>
          ) : null}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input required id="password" type="password" name="password" />
        </FormControl>
        <Text>
          <Link color="teal.500" to="/auth/register">
            Register here
          </Link>
        </Text>
        <HStack justifyContent="space-between">
          <Button type="reset">Clean</Button>
          <Button type="submit">Login</Button>
        </HStack>
      </Stack>
    </form>
  );
};

export default Login;
