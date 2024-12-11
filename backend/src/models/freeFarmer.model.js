const mongoose = require("mongoose");

const FreeFarmerSchema = new mongoose.Schema(
  {
    wallet_address: { type: String, required: true, unique: true },
    bachiStartTime: { type: Number },
    taikoStartTime: { type: Number },
    bachiRewardAmount: { type: Number },
    taikoRewardAmount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const FreeFarmer = mongoose.model("FreeFarmer", FreeFarmerSchema);

module.exports = FreeFarmer;
