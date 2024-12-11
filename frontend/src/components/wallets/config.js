import { http, createConfig, createStorage } from "wagmi";
import { holesky, taikoHekla, mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  autoConnect: true,
  chains: [mainnet, holesky, taikoHekla],
  connectors: [injected(), metaMask()],
  // storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http("https://1.rpc.thirdweb.com"),
    [holesky.id]: http(),
    [taikoHekla.id]: http(),
  },
});
