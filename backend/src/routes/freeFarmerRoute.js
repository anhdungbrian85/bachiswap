const express = require("express");
const freeFarmerController = require("../controllers/freeFarmerController");
const route = express.Router();

route.post("/createFreeFarmer", freeFarmerController.createFreeFarmer);
route.post("/getFarmer", freeFarmerController.getFarmer);
route.post("/getAllFreeFarmer", freeFarmerController.getAllFreeFarmer);
route.post("/claimFreeFarmer", freeFarmerController.claimFreeFarmer);

module.exports = route;
