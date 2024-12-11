import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./components/wallets/config";
import { ModalProvider } from "./contexts/useModal";
import ConnectWalletModal from "./components/wallets/ConnectWallet";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store";
import { Toaster } from "react-hot-toast";
import { TabProvider } from "./contexts/useTab";
import "./i18n/i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
            <ModalProvider>
              <TabProvider>
                <App />
                <ConnectWalletModal />
                <Toaster position="bottom-right" reverseOrder={true} />
              </TabProvider>
            </ModalProvider>
          </ReduxProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
