import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Connector, useAccount, useConnect } from "wagmi";
import ActionButton from "../button/ActionButton";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const walletConnectors = connectors?.filter(
    (connectors) => connectors?.type == "injected"
  );
  console.log({ connectors });
  return (
    <Flex flexDirection={"column"} gap={"12px"} mt={"24px"}>
      {walletConnectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
    </Flex>
  );
}

function WalletOption({ connector, onClick }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <ActionButton disabled={!ready} onClick={onClick}>
      <Text fontFamily={"var(--font-heading-main)"} fontSize={{ base: "24px" }}>
        {connector.name}
      </Text>
    </ActionButton>
  );
}
