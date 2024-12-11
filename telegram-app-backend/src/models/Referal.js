const mongoose = require("mongoose");

const referalSchema = new mongoose.Schema({
  from: {
    type: String,
    require: true,
  },
  to: {
    type: String,
    require: true,
  },
  isSync: {
    type: Boolean,
    default: false,
  },
});

const Referal = mongoose.model("Referal", referalSchema);

module.exports = Referal;
