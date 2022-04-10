import * as React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/store/authorization";

const PrivateRoute: React.FC = props => {
  const [current] = useAuth();

  if (current.matches("initializing")) {
    return <></>;
  }

  if (!current.matches("loggedIn")) {
    return <Navigate replace to="/auth/login" />;
  }

  return <React.Suspense fallback={<></>}>{props.children}</React.Suspense>;
};

export default PrivateRoute;
