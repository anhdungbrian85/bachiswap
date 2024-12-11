const express = require("express");
const telegramController = require("../controllers/telegramController");
const route = express.Router();

route.post("/verifJoinGroup", telegramController.verifJoinGroup);
route.get(
  "/callback",
  telegramController.verifyTelegramAuthMiddleware,
  telegramController.callback
);

module.exports = route;
