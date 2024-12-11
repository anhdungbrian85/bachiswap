const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema(
  {
    task_id: { type: Number, required: true },
    task_code: { type: String, required: true },
    reward_point: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const Tasks = mongoose.model("Tasks", TasksSchema);
module.exports = Tasks;
