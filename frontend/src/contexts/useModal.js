import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [connectWalletModalVisible, setConnectWalletModalVisible] =
    useState(false);
  return (
    <ModalContext.Provider
      value={{
        connectWalletModalVisible,
        setConnectWalletModalVisible,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
