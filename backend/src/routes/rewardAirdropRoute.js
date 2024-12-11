const express = require("express");
const rewardAirdropController = require("../controllers/userRewardController");
const route = express.Router();

route.post("/addUserReward", rewardAirdropController.addUserReward);
route.post("/updateUserReward", rewardAirdropController.updateUserReward);
route.post("/getUserReward", rewardAirdropController.getUserReward);
route.post("/getAllUserReward", rewardAirdropController.getAllUserReward);
route.post("/getRewardAmountByUser", rewardAirdropController.getRewardAmountByUser);

module.exports = route;