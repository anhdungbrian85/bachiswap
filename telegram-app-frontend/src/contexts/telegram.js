import { createContext, useContext, useEffect } from "react";
const TelegramContext = createContext();
/* **************************************** *
  SETUP TELEGRAM SDK NEW VERSION 
  ******************************************* */
export const TelegramProvider = ({ children }) => {
  const tgsdk = window.Telegram;
  const tgWebApp = tgsdk.WebApp;
  const tgUtil = tgsdk.Utils;
  useEffect(() => {
    if (tgsdk && tgsdk.WebApp) {
      tgWebApp.ready();

      // Example: Set the main button text
      // tg.MainButton.setText("Click Me");
      // tg.MainButton.show();

      tgWebApp.disableVerticalSwipes();
    }
  }, []);
  return (
    <TelegramContext.Provider value={{ tgsdk, tgWebApp, tgUtil }}>
      {tgsdk && tgWebApp && children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
