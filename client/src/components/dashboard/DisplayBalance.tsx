import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import * as React from "react";

type Props = {
  balance: number | undefined;
};

const DisplayBalance = (props: Props) => {
  const { balance } = props;
  return (
    <Stat>
      <StatLabel>Balance</StatLabel>
      <StatNumber>{balance}</StatNumber>
    </Stat>
  );
};

export default DisplayBalance;
