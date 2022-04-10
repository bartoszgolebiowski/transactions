import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as LinkRouter } from "react-router-dom";

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEmailError: boolean;
  isAuthFailed: boolean;
  disabled: boolean;
};

const LoginForm = (props: Props) => {
  const { onSubmit, isEmailError, isAuthFailed, disabled } = props;

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3} mt="10" mx="5">
        <Heading>Login</Heading>
        {isAuthFailed ? (
          <Heading color="red.500">Login has failed, try again</Heading>
        ) : null}
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            required
            disabled={disabled}
            id="email"
            type="email"
            name="email"
          />
          {isEmailError ? (
            <Heading color="red.500">Email is required</Heading>
          ) : null}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            required
            disabled={disabled}
            id="password"
            type="password"
            name="password"
          />
        </FormControl>
        <Text>
          <Link
            as={LinkRouter}
            color="blue.500"
            fontWeight="bold"
            to="/auth/register"
          >
            Register here
          </Link>
        </Text>
        <HStack justifyContent="space-between">
          <Button disabled={disabled} type="reset">
            Clean
          </Button>
          <Button disabled={disabled} type="submit">
            Login
          </Button>
        </HStack>
      </Stack>
    </form>
  );
};

export default LoginForm;
