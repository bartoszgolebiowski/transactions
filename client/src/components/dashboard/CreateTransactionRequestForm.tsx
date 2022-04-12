import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import * as React from "react";

import { CreateTransactionRequestInput } from "@/api/dashboard";

type Props = {
  isSubmitting: boolean;
  onSubmit: (data: CreateTransactionRequestInput) => void;
};

const CreateTransactionRequestForm = (props: Props) => {
  const { isSubmitting, onSubmit } = props;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    onSubmit({
      amount: Number(form.amount.value),
      description: form.description.value,
    });
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h2">Create transaction request</Heading>
      <FormControl>
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <Input id="amount" type="number" min={1} disabled={isSubmitting} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input required id="description" type="text" disabled={isSubmitting} />
      </FormControl>
      <HStack mt="2" flexDir="row-reverse" gap="4">
        <Button colorScheme="teal" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          type="reset"
          disabled={isSubmitting}
        >
          Clear
        </Button>
      </HStack>
    </form>
  );
};

export default CreateTransactionRequestForm;
