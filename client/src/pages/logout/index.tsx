import React, { useEffect } from "react";

import { useAuth } from "@/store/authorization";

const Logout = () => {
  const [, send] = useAuth();

  useEffect(() => {
    send("LOG_OUT");
  }, [send]);

  return <></>;
};

export default Logout;
