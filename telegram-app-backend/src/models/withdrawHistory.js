const mongoose = require("mongoose");

const WithdrawHistorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    wallet: { type: String, required: true},
    mode : { type: Number, required: true},
    bachi_amount: { type: String },
    ton_amount: { type: String },
    timestamp: { type: Number, required: true},
    // number: { type: Number, required: true},
    status: { type: Boolean, required: true, default: false },
    // cron: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);
const WithdrawHistory = mongoose.model(
  "WithdrawHistory",
  WithdrawHistorySchema
);
module.exports = WithdrawHistory;
