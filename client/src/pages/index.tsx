import * as React from "react";

import { CreateTransactionRequestInput } from "@/api/dashboard";
import CreateTransactionRequestForm from "@/components/dashboard/CreateTransactionRequestForm";
import DisplayBalance from "@/components/dashboard/DisplayBalance";
import PayTransactionRequestForm from "@/components/dashboard/PayTransactionRequestForm";
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
      <PayTransactionRequestForm
        isSubmitting={isSubmittingPay}
        onSubmit={handlePay}
      />
      <CreateTransactionRequestForm
        isSubmitting={isSubmittingTransactionRequest}
        onSubmit={handleCreateTransactionRequest}
      />
    </div>
  );
};

export default Dashboard;
