import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";

import Router from "./routes/Router";
import AppContextProvider from "./store/contexts";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <AppContextProvider>
        <Router />
      </AppContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
