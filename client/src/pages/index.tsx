import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import * as React from "react";

import { CreateTransactionRequestInput } from "@/api/dashboard";
import CreateTransactionRequestForm from "@/components/dashboard/CreateTransactionRequestForm";
import DisplayBalance from "@/components/dashboard/DisplayBalance";
import PayTransactionRequestForm from "@/components/dashboard/PayTransactionRequestForm";
import TransactionRequestsList from "@/components/dashboard/TransactionRequestsList";
import useDashboard from "@/components/dashboard/useDashboard";

const Dashboard = () => {
  const dashboard = useDashboard();

  const handleCreateTransactionRequest = (
    data: CreateTransactionRequestInput
  ) => {
    dashboard.createTransactionRequest(data);
  };

  const handlePay = (requestId: string) => {
    dashboard.pay(requestId);
  };

  const isSubmittingTransactionRequest =
    dashboard.transactionRequestsStatus === "loading";

  const isSubmittingPay = dashboard.paymentStatus === "loading";

  return (
    <div>
      <DisplayBalance balance={dashboard.balance} />
      <Tabs isFitted>
        <TabList>
          <Tab>Requests</Tab>
          <Tab>Create</Tab>
          <Tab>Pay</Tab>
        </TabList>
        <TabPanels mt="5">
          <TabPanel p="0">
            <TransactionRequestsList
              transactionRequests={dashboard.transactionRequests}
            />
          </TabPanel>
          <TabPanel p="2 0">
            <CreateTransactionRequestForm
              isSubmitting={isSubmittingTransactionRequest}
              onSubmit={handleCreateTransactionRequest}
            />
          </TabPanel>
          <TabPanel p="2 0">
            <PayTransactionRequestForm
              isSubmitting={isSubmittingPay}
              onSubmit={handlePay}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Dashboard;
