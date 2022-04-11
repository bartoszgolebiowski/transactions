import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import * as React from "react";

type Props = {
  isSubmitting: boolean;
  onSubmit: (requestId: string) => void;
};

const PayTransactionRequestForm = (props: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    props.onSubmit(form.requestId.value);
    e.currentTarget.reset();
  };

  const isSubmitting = props.isSubmitting;

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h2">Accept payment</Heading>
      <FormControl>
        <FormLabel htmlFor="requestId">Request ID</FormLabel>
        <Input required id="requestId" type="text" disabled={isSubmitting} />
      </FormControl>
      <HStack mt="2">
        <Button
          colorScheme="teal"
          variant="outline"
          type="reset"
          disabled={isSubmitting}
        >
          Clear
        </Button>
        <Button colorScheme="teal" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </HStack>
    </form>
  );
};

export default PayTransactionRequestForm;
