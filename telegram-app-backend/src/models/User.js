const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  device: {
    type: String,
    default: 0,
  },
});

const balanceSchema = new mongoose.Schema({
  bachi: { type: String, default: 0 },
  ton: { type: String, default: 0 },
});

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    default: "",
  },
  last_name: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
  language_code: {
    type: String,
    default: "en",
  },
  is_premium: {
    type: Boolean,
    default: false,
  },
  point: {
    type: Number,
    default: 0,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
  refer: {
    type: String,
  },
  age: {
    type: Number,
    default: 0,
  },
  twitter: {
    type: String,
    default: "",
  },
  wallet: walletSchema,
  balance: balanceSchema,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
