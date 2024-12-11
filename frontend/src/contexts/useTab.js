import React, { createContext, useContext, useState } from "react";

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [farmTab, setFarmTab] = useState(0);
  const [airdropTab, setAirdropTask] = useState(0);
  const [menuActive, setMenuActive] = useState("");
  const [admin, setAdmin] = useState(false);
  return (
    <TabContext.Provider
      value={{
        farmTab,
        setFarmTab,
        airdropTab,
        setAirdropTask,
        menuActive,
        setMenuActive,
        admin,
        setAdmin,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);
