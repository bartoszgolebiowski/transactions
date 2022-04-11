import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import * as React from "react";

type Props = {
  balance: number | undefined;
};

const DisplayBalance = (props: Props) => {
  return (
    <Stat>
      <StatLabel>Balance</StatLabel>
      <StatNumber>{props.balance}</StatNumber>
    </Stat>
  );
};

export default DisplayBalance;
