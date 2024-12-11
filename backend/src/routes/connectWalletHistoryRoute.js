const express = require("express");
const connectWalletHistory = require("../controllers/connectWalletHistoryController");
const route = express.Router();

route.post("/addWalletHistory", connectWalletHistory.addWalletdHistory);
route.post("/getUserWallet", connectWalletHistory.getAllUserWallet);
route.post("/getCountAllWallet", connectWalletHistory.getCoutAllWallet);
route.post("/getPlatform", connectWalletHistory.getPlatform);

module.exports = route;
