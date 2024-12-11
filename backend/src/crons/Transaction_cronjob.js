const cron = require("node-cron");
const Transaction = require("../models/TransactionModel");
const BlockedIP = require("../models/BlockedIPModel");

cron.schedule("* * * * *", async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: oneMinuteAgo },
          type: "Buy Node",
        },
      },
      {
        $group: {
          _id: "$ipAddress",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 4 },
        },
      },
    ]);

    for (const txn of transactions) {
      const { _id: ipAddress } = txn;

      const existingBlockedIP = await BlockedIP.findOne({ ipAddress });

      if (!existingBlockedIP) {
        await BlockedIP.create({ ipAddress });
        console.log(`Blocked IP: ${ipAddress}`);
      }
    }
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
