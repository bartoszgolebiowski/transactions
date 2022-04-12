import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import QrScanner from "qr-scanner"; // if installed via package and bundling with a module bundler like webpack or rollup
import * as React from "react";

type Props = {
  isSubmitting: boolean;
  onSubmit: (requestId: string) => void;
};

const PayTransactionRequestForm = (props: Props) => {
  const { isSubmitting, onSubmit } = props;
  const ref = React.useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    onSubmit(form.requestId.value);
    e.currentTarget.reset();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      QrScanner.scanImage(e.target.files[0], {
        returnDetailedScanResult: true,
      }).then(result => {
        if (ref.current) {
          ref.current.value = result.data;
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h2">Accept payment</Heading>
      <FormControl>
        <FormLabel htmlFor="requestId">Request ID</FormLabel>
        <Input ref={ref} disabled required id="requestId" type="text" />
      </FormControl>
      <FormControl>
        <Button as="label" htmlFor="qrcode" cursor="pointer">
          QR Code
          <Input
            id="qrcode"
            name="qrcode"
            type="file"
            display="none"
            onChange={handleUpload}
          />
        </Button>
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

export default PayTransactionRequestForm;
