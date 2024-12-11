const mongoose = require("mongoose");

const ConnectWalletHistorySchema = new mongoose.Schema(
  {
    wallet_address: { type: String, required: true, unique: true },
    ipAddress: { type: String, require: true },
    connectTime: { type: Number },
  },
  {
    timestamps: true,
  }
);

const ConnectWalletHistory = mongoose.model(
  "ConnectWalletHistory",
  ConnectWalletHistorySchema
);

module.exports = ConnectWalletHistory;
