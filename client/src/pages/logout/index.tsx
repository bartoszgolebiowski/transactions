import * as React from "react";

import { useAuth } from "@/store/authorization";

const Logout = () => {
  const [, send] = useAuth();

  React.useEffect(() => {
    send("LOG_OUT");
  }, [send]);

  return <></>;
};

export default Logout;
