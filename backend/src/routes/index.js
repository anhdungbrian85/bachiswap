const TransactionRouter = require("./TransactionRoute");
const rewardAirdropRouter = require("./rewardAirdropRoute");
const airdropTaskRouter = require("./airdropTaskRoute");
const rewardAirdropHistoryRouter = require("./rewardAirdropHistoryRoute");
const freeFarmerRouter = require("./freeFarmerRoute");
const telegramRouter = require("./telegramRoute");
const connectWalletHistoryRouter = require("./connectWalletHistoryRoute");

const routes = (app) => {
  app.use("/api/transaction", TransactionRouter);
  app.use("/api/rewardAirdrop", rewardAirdropRouter);
  app.use("/api/airdropTask", airdropTaskRouter);
  app.use("/api/rewardAirdropHistory", rewardAirdropHistoryRouter);
  app.use("/api/freeFarmer", freeFarmerRouter);
  app.use("/api/telegram", telegramRouter);
  app.use("/api/connectWalletHistory", connectWalletHistoryRouter);
};
module.exports = routes;
