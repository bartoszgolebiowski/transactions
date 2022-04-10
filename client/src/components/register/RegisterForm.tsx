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
  isPasswordError: boolean;
  isPasswordAgainError: boolean;
  isSignUpFailed: boolean;
  disabled: boolean;
};

const RegisterForm = (props: Props) => {
  const {
    onSubmit,
    isEmailError,
    isPasswordError,
    isPasswordAgainError,
    isSignUpFailed,
    disabled,
  } = props;

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3} mt="10" mx="5">
        <Heading>Registration</Heading>
        {isSignUpFailed ? (
          <Heading color="red.500">Registration has failed, try again</Heading>
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
          {isPasswordError ? (
            <Heading color="red.500">Password it too weak</Heading>
          ) : null}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="passwordAgain">Password again</FormLabel>
          <Input
            required
            disabled={disabled}
            id="passwordAgain"
            type="password"
            name="passwordAgain"
          />
          {isPasswordAgainError ? (
            <Heading color="red.500">Passwords are not the same</Heading>
          ) : null}
        </FormControl>
        <Text>
          <Link
            as={LinkRouter}
            color="blue.500"
            fontWeight="bold"
            to="/auth/login"
          >
            Login here
          </Link>
        </Text>
        <HStack justifyContent="space-between">
          <Button disabled={disabled} type="reset">
            Clean
          </Button>
          <Button disabled={disabled} type="submit">
            Register
          </Button>
        </HStack>
      </Stack>
    </form>
  );
};

export default RegisterForm;
