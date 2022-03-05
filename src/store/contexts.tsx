import React, { ComponentProps } from "react";

import { AuthProvider } from "./authorization";

const providers = [AuthProvider];

const combineProviders = (...components: React.FC[]): React.FC => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: ComponentProps<React.FC>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

export default combineProviders(...providers);
