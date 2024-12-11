const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const BoostTnxSchema = mongoose.model(
  "BoostTnxSchema",
  new Schema({
    value: {
      type: String,
      required: true,
    },
    created_at: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    source_user_friendly: {
      type: String,
      required: true,
    },
    destination_user_friendly: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    isDoneClaim: {
      type: Boolean,
      required: false,
      default: false
    },
  })
);

const MissedBoostTnxSchema = mongoose.model(
  "MissedBoostTnxSchema",
  new Schema({
    value: {
      type: String,
      required: false,
    },
    created_at: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    destination: {
      type: String,
      required: false,
    },
    source_user_friendly: {
      type: String,
      required: false,
    },
    destination_user_friendly: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    hash: {
      type: String,
      required: false,
    },
    isDoneClaim: {
      type: Boolean,
      required: false,
    },
    tryTime: {
      type: Number,
      required: false,
      default: 0,
    },
  })
);

module.exports = { BoostTnxSchema, MissedBoostTnxSchema };
