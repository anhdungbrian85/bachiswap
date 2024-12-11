const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  point: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  valid_to: {
    type: Date,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
