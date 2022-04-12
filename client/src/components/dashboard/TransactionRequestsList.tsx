import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";

import { CreateTransactionRequestOutput } from "@/api/dashboard";

import GenerateQRCodeButton from "./GenerateQRCodeButton";

type Props = {
  transactionRequests: CreateTransactionRequestOutput[] | undefined;
};

const TransactionRequestsList = (props: Props) => {
  const { transactionRequests = [] } = props;

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Your tranaction requests</TableCaption>
        <Thead>
          <Tr>
            <Th>Description</Th>
            <Th isNumeric>Amount</Th>
            <Th isNumeric>Share</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactionRequests.map(transReq => (
            <Tr key={transReq.id}>
              <Td>{transReq.description}</Td>
              <Td isNumeric>{transReq.amount}</Td>
              <Td isNumeric>
                <GenerateQRCodeButton requestId={transReq.id} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionRequestsList;
