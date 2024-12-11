import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { TelegramProvider } from "./contexts/telegram";
import { AppContextProvider } from "./contexts";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Toaster } from "react-hot-toast";
import { TabProvider } from "./contexts/useTab";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TonConnectUIProvider
      uiPreferences={{
        borderRadius: "s",
        // colorsSet: THEME.LIGHT,
        theme: THEME.LIGHT,
      }}
      manifestUrl="https://bachiswap.tele-app.betaz.io/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/bachiapp_bot/app",
      }}
    >
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <TabProvider>
              <App />
              <Toaster position="bottom-right" reverseOrder={true} />
            </TabProvider>
          </AppContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
