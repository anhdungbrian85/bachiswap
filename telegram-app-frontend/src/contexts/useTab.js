import React, { createContext, useContext, useState } from "react";

const TabContext = createContext();
export const TabProvider = ({ children }) => {
  const [farmTab, setFarmTab] = useState(0);
  return (
    <TabContext.Provider
      value={{
        farmTab,
        setFarmTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);
