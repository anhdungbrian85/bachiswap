import React, { createContext, useContext, useState } from "react";

const ClientContext = createContext();

export const chainClientProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  return (
    <ClientContext.Provider
      value={{
        client,
        setClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useChainClient = () => useContext(ClientContext);
