import {
  useIsConnectionRestored,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { APIClient } from "../api";
import { useMutation, useQuery } from "react-query";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  ////////////////////////////////// Modal
  const [drawerBachiBalanceVisibility, setDrawerBachiBalanceVisibility] =
    useState(false);
  const [drawerTonBalanceVisibility, setDrawerTonBalanceVisibility] =
    useState(false);
  const [drawerTaikoBalanceVisibility, setDrawerTaikoBalanceVisibility] =
    useState(false);
  const [messageVisibility, setMessageVisibility] = useState(false);
  const [drawerMiningBoosterVisibility, setDrawerMiningBoosterVisibility] =
    useState(false);
  const [modalVisibility, setModalVisibility] = useState(1); // 0 - close; 1 - start; 2 - wallet
  ////////////////////////////////// Modal
  const [userToken, updatetUserToken] = useState(null);
  const [userInfo, updateUserInfo] = useState(null);
  const [requireRegisted, setRequireRegisted] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [stableSize, setStableSize] = useState(null);
  const [appStatus, setAppStatus] = useState(null);
  const rawAddress = useTonAddress();
  const wallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();
  const [isConnectWalletTaskClicked, setIsConnectWalletTaskClicked] =
    useState(false);
  ////////////////////////////////// energy
  const userInfoRef = useRef(userInfo);
  ///////////////////////////////////////////

  ////////////////////////////////// energy
  useEffect(() => {
    userInfoRef.current = userInfo;
  }, [userInfo]);

  /// app status
  useEffect(() => {
    (async () => {
      const resp2 = await APIClient.getTotalUser(userToken);
      if (resp2?.success) {
        setAppStatus(resp2);
      }
    })();
  }, []);
  ///////////////////////////////////////////

  ///////////////////////////////////////////
  /// check wallet
  useEffect(() => {
    if (rawAddress && userInfo) {
      (async () => {
        const walletInfo = {
          address: rawAddress,
          name: wallet?.name,
          device: wallet?.device?.appName,
        };
        await Promise.all([
          APIClient.updateWaleltAddress(userToken, walletInfo),
          APIClient.freeMining(userToken, walletInfo),
        ]);
        fetchUser();
      })();
    }
  }, [rawAddress, connectionRestored]);
  ///////////////////////////////////////////

  ///////////////////////////////////////////
  const telegramUserToken =
    process.env.REACT_APP_DEV_TOKEN ||
    window?.Telegram?.WebView?.initParams?.tgWebAppData;

  const { isFetching } = useQuery("fetch-user", async () => {
    if (telegramUserToken && !userToken && !userInfo) {
      const userdata = telegramUserToken;
      console.log({ telegramUserToken });
      updatetUserToken(userdata);
      const resp = await APIClient.auth({ userToken: userdata });
      if (resp?.success == true) {
        await fetchUser();
        setRequireRegisted(resp?.registration);
      }
    }
  });

  useEffect(() => {
    if (telegramUserToken && !userToken && !userInfo) {
      updatetUserToken(telegramUserToken);
      fetchUser();
    }
  }, [telegramUserToken, userInfo]);
  ///////////////////////////////////////////

  const fetchUser = async () => {
    try {
      const resp = await APIClient.fetchUser({ userToken: telegramUserToken });
      if (resp?.success == true) {
        updateUserInfo(resp?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!stableSize) {
      setStableSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userToken,
        updatetUserToken,
        userInfo,
        updateUserInfo,
        isLoadingUser: isFetching,
        isValidUser: userToken && userInfo,
        requireRegisted,
        fetchUser,
        stableSize,
        setStableSize,
        appStatus,
        isConnectWalletTaskClicked,
        setIsConnectWalletTaskClicked,
        setRequireRegisted,
        setIsLoadingUser,
        modalVisibility,
        setModalVisibility,
        telegramUserToken,
        drawerBachiBalanceVisibility,
        setDrawerBachiBalanceVisibility,
        drawerMiningBoosterVisibility,
        setDrawerMiningBoosterVisibility,
        drawerTonBalanceVisibility,
        setDrawerTonBalanceVisibility,
        drawerTaikoBalanceVisibility,
        setDrawerTaikoBalanceVisibility,
        messageVisibility,
        setMessageVisibility,
      }}
    >
      {stableSize && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
