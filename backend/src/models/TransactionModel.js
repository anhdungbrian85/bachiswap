const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    caller: { type: String, required: true },
    chainId: { type: Number, required: true },
    hash: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    ipAddress: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
