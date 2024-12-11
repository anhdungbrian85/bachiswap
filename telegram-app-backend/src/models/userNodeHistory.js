const mongoose = require("mongoose");

const UserNodeHistorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    nodeTierId: { type: Number, required: true },
    qty: { type: String },
    bachi_claim_last_time: { type: Number },
    ton_claim_last_time: { type: Number },
    hash: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);
const UserNodeHistory = mongoose.model(
  "UserNodeHistory",
  UserNodeHistorySchema
);
module.exports = UserNodeHistory;
