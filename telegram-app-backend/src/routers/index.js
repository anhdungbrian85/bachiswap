const express = require("express");
const router = express.Router();

const WelcomeController = require("../controllers/WelcomeController");
const UserController = require("../controllers/UserController");
const MiningBoosterController = require("../controllers/MiningBoosterController");
const TaskController = require("../controllers/TaskController");

router.get("/", WelcomeController.toHtml);

//User routers
router.post("/user/auth", UserController.authenticateUser);
router.post("/user/total-user", UserController.getTotalUser);
router.post("/user/getUser", UserController.getUser);
router.post("/user/wallet/update", UserController.updateWallet);
router.post("/user/boost-tnx", UserController.getBoostTnxs);

// mining
router.post("/user/freeMining", MiningBoosterController.freeMining);
router.post("/user/getUserFarmSpeed", MiningBoosterController.getUserFarmSpeed);
router.post("/user/claimNode", MiningBoosterController.claimNode);
router.post("/user/getPayloadByCode", MiningBoosterController.getPayloadByCode);
router.post("/user/withdraw", MiningBoosterController.withdraw);

// task
router.post("/task/create", TaskController.create);
router.post("/task/list", TaskController.getList);
router.post("/task/user/list", TaskController.getListTaskByUser);
router.post("/task/verify", TaskController.verify);
router.post("/task/check-task-verify", TaskController.checkTaskVerify);

module.exports = router;
