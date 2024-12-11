const mongoose = require("mongoose");

const ReferralsSchema = new mongoose.Schema(
  {
    caller: { type: String, required: true },
    referralsOwner: { type: String, required: true },
    referralId: { type: Number, required: true },
    amount: { type: Number, required: true },
    timestamps: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Referrals = mongoose.model("Referrals", ReferralsSchema);

module.exports = Referrals;
