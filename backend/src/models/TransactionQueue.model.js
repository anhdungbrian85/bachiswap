const mongoose = require("mongoose");

const transactionQueueSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const TransactionQueue = mongoose.model("TransactionQueue", transactionQueueSchema);
module.exports = TransactionQueue;