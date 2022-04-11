import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as api from "@/api/dashboard";

const useDashboard = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: balance, status: balanceStatus } = useQuery(
    "balance",
    api.getBalance
  );

  const { data: transactionRequests, status: transactionRequestsStatus } =
    useQuery("transactionRequests", api.getUserTransactionRequests);

  const { mutate: pay, status: paymentStatus } = useMutation(api.pay, {
    onSuccess: () => {
      queryClient.invalidateQueries("balance");
      toast({
        title: "Payment successful",
        description: "Balance updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Payment failed",
        description: "Try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const {
    mutate: createTransactionRequest,
    status: createTransactionRequestStatus,
  } = useMutation(api.createTransactionRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("transactionRequests");
      toast({
        title: "Transaction request created",
        description: "You can now pay the request",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Transaction request not created",
        description: "Try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return {
    balance,
    balanceStatus,
    transactionRequests,
    transactionRequestsStatus,
    paymentStatus,
    createTransactionRequestStatus,
    pay,
    createTransactionRequest,
  } as const;
};

export default useDashboard;
