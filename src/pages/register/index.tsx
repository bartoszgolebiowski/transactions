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
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "@/store/authorization";

const Register = () => {
  const [current, send] = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    send("SIGN_UP", Object.fromEntries(formData));
  };

  const isEmailError = current.matches("loggedOut.invalidEmail");
  const isPassword = current.matches("loggedOut.invalidPassword");
  const isPasswordAgain = current.matches("loggedOut.invalidPasswordAgain");
  const isSignUpFailed = current.matches("loggedOut.signUpFailed");

  if (current.matches("loggedOut.signUpSuccess")) {
    return <Navigate replace to="/auth/login" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} mt="10" mx="5">
        <Heading>Registration</Heading>
        {isSignUpFailed ? (
          <Heading color="red.500">Registration has failed, try again</Heading>
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
          {isPassword ? (
            <Heading color="red.500">Password it too weak</Heading>
          ) : null}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="passwordAgain">Password again</FormLabel>
          <Input
            required
            id="passwordAgain"
            type="password"
            name="passwordAgain"
          />
          {isPasswordAgain ? (
            <Heading color="red.500">Passwords are not the same</Heading>
          ) : null}
        </FormControl>
        <Text>
          <Link color="teal.500" to="/auth/login">
            Login here
          </Link>
        </Text>
        <HStack justifyContent="space-between">
          <Button type="reset">Clean</Button>
          <Button type="submit">Register</Button>
        </HStack>
      </Stack>
    </form>
  );
};

export default Register;
