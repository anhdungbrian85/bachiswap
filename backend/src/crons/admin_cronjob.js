const cron = require("node-cron");
const db = require("../models/index");
const { ethers } = require("ethers");
const PlatformAnalysis = db.platformAnalysis;
const FreeFarmer = db.freeFarmer;
const ConnectWalletHistory = db.connectWalletHistory;
const UserNodeLink = db.userNodeLinks;
const {
  node_manager_contract,
} = require("../contracts/node_manager_contract.js");
const {
  taiko_token_contract,
} = require("../contracts/taiko_token_contract.js");
const { CHAINS } = require("../utils/contants.js");

provider = new ethers.JsonRpcProvider(CHAINS[process.env.NODE_ENV].rpcUrls);
const nodeManagerContract = new ethers.Contract(
  node_manager_contract.CONTRACT_ADDRESS,
  node_manager_contract.CONTRACT_ABI,
  provider
);
const taikoTokenContract = new ethers.Contract(
  taiko_token_contract.CONTRACT_ADDRESS,
  taiko_token_contract.CONTRACT_ABI,
  provider
);
cron.schedule("0 0 * * *", async () => {
  try {
    //
    const totalUserWallet = await ConnectWalletHistory.countDocuments({});
    //
    const freeFarmer = await FreeFarmer.countDocuments({});
    //
    const data = await UserNodeLink.aggregate([
      {
        $group: {
          _id: "$caller",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
    ]);
    const userByNode = data.length;
    //
    const nodeData = await UserNodeLink.aggregate([
      {
        $group: {
          _id: null,
          totalNode: { $sum: "$quantity" },
        },
      },
    ]);
    const totalNode = nodeData.length > 0 ? nodeData[0].totalNode : 0;
    //
    const referenceId = await nodeManagerContract.referenceId();
    const totalreferral = Number(referenceId);
    //
    const balance = await taikoTokenContract.balanceOf(
      node_manager_contract.CONTRACT_ADDRESS
    );
    const totalBalance = Number(balance) / 10 ** 18;
    const newEntry = await PlatformAnalysis.create({
      totalNode,
      freeFarmer,
      totalBalance,
      totalUserWallet,
      userByNode,
      totalreferral,
    });

    await newEntry.save();
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
