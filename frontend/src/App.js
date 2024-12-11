import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  ScrollRestoration,
} from "react-router-dom";
import NotFoundPage from "./pages/404";
import AdminPage from "./pages/admin";
import HomePage from "./pages/home";
import Node from "./pages/node";
import DefaultLayout from "./layouts";
import AirDrop from "./pages/airdrop";
import Swap from "./pages/swap";
import "./global.css";
import Terms from "./pages/terms";
import PrivacyPolicy from "./pages/privacypolicy";
import { useAccount, useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "./components/wallets/config";
import node_manager_contract from "./utils/contracts/node_manager_contract";
import { useTab } from "./contexts/useTab";

const App = () => {
  const { address } = useAccount();

  // const [admin, setAdmin] = useState(false);
  const { admin, setAdmin } = useTab();
  const nodeManagerContract = {
    address: node_manager_contract.CONTRACT_ADDRESS,
    abi: node_manager_contract.CONTRACT_ABI,
  };
  const checkAdmin = async () => {
    const addressAdmin = await readContract(config, {
      ...nodeManagerContract,
      functionName: "owner",
    });

    if (
      address === addressAdmin ||
      address == process.env.REACT_APP_DEFAULT_ADDRESS ||
      address == process.env.REACT_APP_ADMIN_ADDRESS
    ) {
      setAdmin(true);
    }
  };

  useEffect(() => {
    if (address) {
      checkAdmin();
    }
  }, [address]);
  console.log({ admin });
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          {/* User */}
          <Route path="/" element={<HomePage />} />
          <Route path="/farm" element={<Node />} />
          <Route path="/airdrop" element={<AirDrop />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Admin */}
          <Route
            path="/hehiha"
            element={admin ? <AdminPage /> : <NotFoundPage />}
          />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
};

export default App;
