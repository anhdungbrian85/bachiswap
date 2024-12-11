const TaskHistory = require("../models/TaskHistory");
const User = require("../models/User");

const TaskServices = {
  verifyNoCheckTask: async (res, userData, task) => {
    try {
      const { id: userId } = userData;
      const { code, point } = task;
      const rewardHistory = await TaskHistory.findOne({
        user_id: userId,
        code,
      });

      if (rewardHistory) {
        console.log("Already verified", rewardHistory);
        return res
          .status(200)
          .json({ success: true, message: "Already verified" });
      }
      console.log("Start verify", {
        user_id: userId,
        code,
      });
      const claimAmount = {
        bachi_amount: BigInt(point),
      };
      const bachi_amount_update =
        BigInt(userData?.balance?.bachi || 0) + claimAmount.bachi_amount;

      await User.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            "balance.bachi": bachi_amount_update.toString(),
          },
        },
        { new: true }
      );
      await TaskHistory.create({
        user_name: userData?.username || "",
        user_id: userId,
        note: "Reward for task save successfully",
        point: point,
        code,
      });

      return res.status(200).json({ success: true, message: "Verify success" });
    } catch (error) {
      const err = error?.response?.toJSON();
      console.log("error", error);
      return res.status(401).json({ message: err?.body?.description });
    }
  },
};

module.exports = TaskServices;
