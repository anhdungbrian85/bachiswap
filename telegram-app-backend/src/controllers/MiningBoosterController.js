require("dotenv").config();
const User = require("../models/User");
const Referal = require("../models/Referal");
const UserNodeHistory = require("../models/userNodeHistory");
const ClaimHistory = require("../models/claimHistory");
const WithdrawHistory = require("../models/withdrawHistory");
let miningConfig = require("../utils/miningConfig.json");
const {
  verifyTelegramWebAppData,
  parseTelegramInitData,
  getAccountAge,
  escapeData,
  isValidTonWallet,
  getCheckinDate,
  convertToRawAddress,
  convertRawToAddress,
} = require("../utils");
const { getCurrentTimeInSeconds } = require("../utils/tools");
const {
  CLAIM_MODE,
  ERROR_MESSAGE,
  MESSAGE,
  MIN_CLAIM,
  MIN_WITHDRAW,
} = require("../utils/contants");
const { beginCell } = require("@ton/ton");

const MiningBoosterController = {
  freeMining: async (req, res) => {
    try {
      const { userToken, wallet } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        console.log("UPDATE WALLET ERROR: Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }
      if (!isValidTonWallet(wallet?.address) || !wallet?.address) {
        console.log("UPDATE WALLET ERROR: Not valid address", userId);
        return res.status(401).json({ message: "Not valid address" });
      }
      console.log({ id: userId }, wallet);

      const isBuy = await UserNodeHistory.findOne({
        id: userId,
        nodeTierId: 0,
      });

      let data = null;
      if (!isBuy) {
        const currentTime = getCurrentTimeInSeconds();
        const buyInfo = {
          id: userId,
          nodeTierId: 0,
          qty: 1,
          bachi_claim_last_time: currentTime,
          ton_claim_last_time: currentTime,
        };
        data = await UserNodeHistory.create(buyInfo);
      }

      return res.status(200).json({
        message: MESSAGE.SUCCESS,
        success: !!data,
      });
    } catch (error) {
      console.log("AUTH ERROR", error);
      return res
        .status(401)
        .json({ message: "Error occur", error: error.message });
    }
  },
  getUserFarmSpeed: async (req, res) => {
    try {
      const { userToken } = req.body;

      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        console.log("UPDATE WALLET ERROR: Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }

      const data = await UserNodeHistory.find({
        id: userId,
      });

      const userFarmInfor = {
        bachi_amount: BigInt(0),
        ton_amount: BigInt(0),
        bachi_speed: BigInt(0),
        ton_speed: BigInt(0),
      };

      const currentTime = getCurrentTimeInSeconds();
      for (const history of data) {
        const nodeTier = miningConfig.boosterConfig.find(
          (item) => item.nodeTierId == history.nodeTierId
        );

        if (!nodeTier) continue;

        const bachiTimeDifference =
          BigInt(currentTime) - BigInt(history.bachi_claim_last_time);
        const tonTimeDifference =
          BigInt(currentTime) - BigInt(history.ton_claim_last_time);
        const bachiSpeed = BigInt(nodeTier.speed.bachi) * BigInt(history.qty);
        const tonSpeed = BigInt(nodeTier.speed.ton) * BigInt(history.qty);

        userFarmInfor.bachi_speed += bachiSpeed;
        userFarmInfor.ton_speed += tonSpeed;
        userFarmInfor.bachi_amount += bachiTimeDifference * bachiSpeed;
        userFarmInfor.ton_amount += tonTimeDifference * tonSpeed;
      }

      return res.status(200).json({
        message: MESSAGE.SUCCESS,
        success: true,
        data: {
          bachi_amount: userFarmInfor.bachi_amount.toString(),
          ton_amount: userFarmInfor.ton_amount.toString(),
          bachi_speed: userFarmInfor.bachi_speed.toString(),
          ton_speed: userFarmInfor.ton_speed.toString(),
          currentTime,
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  },
  claimNode: async (req, res) => {
    try {
      const { userToken, wallet, mode } = req.body;
      if (!userToken || !wallet || !mode) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        console.log("UPDATE WALLET ERROR: Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }
      if (!isValidTonWallet(wallet?.address) || !wallet?.address) {
        console.log("UPDATE WALLET ERROR: Not valid address", userId);
        return res.status(401).json({ message: "Not valid address" });
      }
      console.log({ id: userId }, wallet);

      let claimAmount = { bachi_amount: BigInt(0), ton_amount: BigInt(0) };
      const currentTime = getCurrentTimeInSeconds();

      const userNodeHistorys = await UserNodeHistory.find({ id: userId });
      if (!userNodeHistorys || userNodeHistorys.length === 0) {
        return res.status(404).json({
          message: "No node histories found",
        });
      }

      const updateHistories = [];

      for (const history of userNodeHistorys) {
        const nodeTier = miningConfig.boosterConfig.find(
          (item) => item.nodeTierId == history.nodeTierId
        );

        if (!nodeTier) continue;

        const bachiTimeDifference =
          BigInt(currentTime) - BigInt(history.bachi_claim_last_time);
        const tonTimeDifference =
          BigInt(currentTime) - BigInt(history.ton_claim_last_time);

        if (mode == CLAIM_MODE.CLAIM_BACHI || mode == CLAIM_MODE.CLAIM_ALL) {
          claimAmount.bachi_amount +=
            bachiTimeDifference *
            BigInt(nodeTier.speed.bachi) *
            BigInt(history.qty);
        }

        if (mode == CLAIM_MODE.CLAIM_TON || mode == CLAIM_MODE.CLAIM_ALL) {
          claimAmount.ton_amount +=
            tonTimeDifference *
            BigInt(nodeTier.speed.ton) *
            BigInt(history.qty);
        }

        const updateFields = {
          ...((mode == CLAIM_MODE.CLAIM_BACHI ||
            mode == CLAIM_MODE.CLAIM_ALL) && {
            bachi_claim_last_time: currentTime,
          }),
          ...((mode == CLAIM_MODE.CLAIM_TON ||
            mode == CLAIM_MODE.CLAIM_ALL) && {
            ton_claim_last_time: currentTime,
          }),
        };
        updateHistories.push(
          UserNodeHistory.findOneAndUpdate({ hash: history.hash }, updateFields)
        );
      }

      if (mode == CLAIM_MODE.CLAIM_BACHI || mode == CLAIM_MODE.CLAIM_ALL) {
        if (claimAmount.bachi_amount < MIN_CLAIM.BACHI) {
          return res.status(500).json({
            message: "Claim amount is too small",
          });
        }
      }

      if (mode == CLAIM_MODE.CLAIM_TON || mode == CLAIM_MODE.CLAIM_ALL) {
        if (claimAmount.ton_amount < MIN_CLAIM.TON) {
          return res.status(500).json({
            message: "Claim amount is too small",
          });
        }
      }

      await Promise.all(updateHistories);
      const bachi_amount_update =
        BigInt(user?.balance?.bachi || 0) + claimAmount.bachi_amount;
      const ton_amount_update =
        BigInt(user?.balance?.ton || 0) + claimAmount.ton_amount;
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            "balance.bachi": bachi_amount_update.toString(),
            "balance.ton": ton_amount_update.toString(),
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: ERROR_MESSAGE.CAN_NOT_UPDATE,
        });
      }

      await ClaimHistory.create({
        id: userId,
        bachi_amount: claimAmount.bachi_amount,
        ton_amount: claimAmount.ton_amount,
        time: Date.now(),
      });

      return res.status(200).json({
        success: true,
        message: MESSAGE.SUCCESS,
        data: updatedUser,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  },
  getPayloadByCode: async (req, res) => {
    try {
      const { userToken, comment } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        console.log("UPDATE WALLET ERROR: Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }

      const commentString = JSON.stringify(comment);
      const payload = beginCell()
        .storeUint(0, 32)
        .storeStringTail(commentString)
        .endCell()
        .toBoc()
        .toString("base64");

      return res.status(200).json({
        message: MESSAGE.SUCCESS,
        success: true,
        data: {
          payload,
          comment,
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  },
  withdraw: async (req, res) => {
    try {
      const { userToken, wallet, mode, amount } = req.body;
      if (!userToken || !wallet || !amount) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        console.log("UPDATE WALLET ERROR: Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }
      if (!isValidTonWallet(wallet?.address) || !wallet?.address) {
        console.log("UPDATE WALLET ERROR: Not valid address", userId);
        return res.status(401).json({ message: "Not valid address" });
      }
      console.log({ id: userId }, wallet);

      const timestamp = Date.now();

      let bachi_amount = 0;
      let ton_amount = 0;
      if (mode == CLAIM_MODE.CLAIM_BACHI) {
        if (BigInt(amount) > BigInt(user?.balance?.bachi || 0)) {
          return res.status(500).json({
            success: false,
            message: "Not enough balance",
          });
        }
        bachi_amount = amount.toString();
        if (bachi_amount < MIN_WITHDRAW.BACHI) {
          return res.status(500).json({
            success: false,
            message: "Withdraw amount is too small",
          });
        }
      } else if (mode == CLAIM_MODE.CLAIM_TON) {
        if (BigInt(amount) > BigInt(user?.balance?.ton || 0)) {
          return res.status(500).json({
            success: false,
            message: "Not enough balance",
          });
        }
        ton_amount = amount.toString();
        if (ton_amount < MIN_WITHDRAW.TON) {
          return res.status(500).json({
            success: false,
            message: "Withdraw amount is too small",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid mode",
        });
      }

      //Save history
      const data = await WithdrawHistory.create({
        id: userId,
        wallet: wallet?.address,
        mode,
        bachi_amount: bachi_amount,
        ton_amount: ton_amount,
        timestamp: timestamp,
        // number: lastNumberNew,
        status: false,
      });

      //Save amount
      if (mode == CLAIM_MODE.CLAIM_BACHI) {
        const remaining_amount =
          BigInt(user?.balance?.bachi) - BigInt(bachi_amount);

        await User.findOneAndUpdate(
          { id: userId },
          { $set: { "balance.bachi": remaining_amount.toString() } },
          { new: true }
        );
      } else if (mode == CLAIM_MODE.CLAIM_TON) {
        const remaining_amount = BigInt(user?.balance?.ton) - BigInt(ton_amount);
        await User.findOneAndUpdate(
          { id: userId },
          { $set: { "balance.ton": remaining_amount.toString() } },
          { new: true }
        );
      }

      return res.status(200).json({
        success: true,
        message: MESSAGE.SUCCESS,
        data,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  },
};
module.exports = MiningBoosterController;
