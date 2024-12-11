import { createPublicClient, http } from "viem";
import { taikoHekla, holesky, mainnet } from "viem/chains";

const chain = {
  testnet: {
    CHAIN: holesky,
  },
  mainnet: {
    CHAIN: mainnet,
  },
};
export const taikoHeklaClient = createPublicClient({
  chain: chain[process.env.REACT_APP_ENV || "testnet"].CHAIN,
  transport: http(),
});
