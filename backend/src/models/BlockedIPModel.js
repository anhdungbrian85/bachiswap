const mongoose = require("mongoose");

const blockedipSchema = new mongoose.Schema({
  ipAddress: { type: String, require: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const BlockedIP = mongoose.model("BlockedIP", blockedipSchema);
module.exports = BlockedIP;
