const mongoose = require("mongoose");

const PlatformAnalysisSchema = new mongoose.Schema(
  {
    totalNode: { type: Number },
    freeFarmer: { type: Number },
    totalBalance: { type: Number },
    totalUserWallet: { type: Number },
    userByNode: { type: Number },
    totalreferral: { type: Number },
  },
  {
    timestamps: true,
  }
);

const PlatformAnalysis = mongoose.model(
  "PlatformAnalysis",
  PlatformAnalysisSchema
);

module.exports = PlatformAnalysis;
