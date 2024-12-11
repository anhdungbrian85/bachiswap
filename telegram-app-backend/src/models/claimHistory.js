const mongoose = require("mongoose");

const ClaimHistorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    bachi_amount: { type: String },
    ton_amount: { type: String },
    time: { type: Number },
  },
  {
    timestamps: true,
  }
);
const ClaimHistory = mongoose.model("ClaimHistory", ClaimHistorySchema);
module.exports = ClaimHistory;
