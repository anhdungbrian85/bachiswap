const express = require("express");
const rewardAirdropHistory = require("../controllers/rewardAirdropHistoryController");
const route = express.Router();

route.post("/addRewardHistory", rewardAirdropHistory.addRewardHistory);
route.post("/updateRewardHistory", rewardAirdropHistory.updateRewardHistory);
route.post("/getAllRewardHistory", rewardAirdropHistory.getAllRewardHistory);
route.post("/getRewardHistory", rewardAirdropHistory.getRewardHistory);
route.post("/getRewardHistoryByTaskId", rewardAirdropHistory.getRewardHistoryByTaskId);

module.exports = route;