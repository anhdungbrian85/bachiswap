const express = require("express");
const airdropTaskController = require("../controllers/airdropTaskController");
const route = express.Router();

route.post("/addAirdropTask", airdropTaskController.addAirdropTask);
route.post("/updateAirdropTask", airdropTaskController.updateAirdropTask);
route.post("/updateAirdropTaskByCode", airdropTaskController.updateAirdropTaskByCode);
route.post("/getAirdropTaskByCode", airdropTaskController.getAirdropTaskByCode);
route.post("/getAirdropTaskById", airdropTaskController.getAirdropTaskById);
route.post("/getAllAirdropTask", airdropTaskController.getAllAirdropTask);

module.exports = route;