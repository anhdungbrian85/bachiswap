const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema({
  user_name: {
    type: String,
  },
  user_id: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  point: {
    type: Number,
    required: true,
  },
  target: {
    type: String,
  },
  code: {
    type: String,
  },
});

const TaskHistory = mongoose.model("TaskHistory", taskHistorySchema);

module.exports = TaskHistory;
