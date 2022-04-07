import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/store/authorization";

const NonAutorizedRoute: React.FC = props => {
  const [current] = useAuth();

  if (current.matches("loggedIn")) {
    return <Navigate to="/" />;
  }

  return <React.Suspense fallback={<></>}>{props.children}</React.Suspense>;
};

export default NonAutorizedRoute;
