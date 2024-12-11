const mongoose = require("mongoose");

const userNodeLinksSchema = new mongoose.Schema(
  {
    caller: { type: String, required: true },
    nodeTierId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    time: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Transaction = mongoose.model("UserNodeLinks", userNodeLinksSchema);
module.exports = Transaction;
