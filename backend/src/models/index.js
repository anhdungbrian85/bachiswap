const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.blockedIps = require("./BlockedIPModel");
db.scannedBlocks = require("./scannedBlocks.model");
db.transactions = require("./TransactionModel");
db.referrals = require("./referrals.model");
db.users = require("./users.model");
db.tasks = require("./tasks.model");
db.rewardHistory = require("./rewardHistory.model");
db.userNodeLinks = require("./userNodeLinks.nodel");
db.transactionQueue = require("./TransactionQueue.model");
db.freeFarmer = require("./freeFarmer.model");
db.connectWalletHistory = require("./connectWalletHistory.model");
db.platformAnalysis = require("./PlatformAnalysis.model");

module.exports = db;
