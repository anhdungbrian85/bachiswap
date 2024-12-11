require("dotenv").config();
const User = require("../models/User");
const Referal = require("../models/Referal");
const { BoostTnxSchema } = require("../models/BoostTnx");
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

const UserController = {
  authenticateUser: async (req, res) => {
    try {
      const { userToken } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      let userData = null;
      let requireRegister = false;
      const dataQueryRaw = parseTelegramInitData(userToken);
      // const dataQuery = escapeData(dataQueryRaw);
      const dataQuery = dataQueryRaw;
      const userId = parseInt(dataQuery?.user?.id);
      console.log("userId", userId);
      const accountAge = getAccountAge(userId);
      console.log("accountAge", accountAge);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      userData = await User.findOne({ id: userId });
      if (!userData) {
        const referalAppID = dataQuery?.start_param;
        if (referalAppID == null) {
          console.log("REG VIA CHATBOT");
          const referalData = await Referal.findOne({ to: userId });
          console.log("referalData", referalData);
          requireRegister = true;
          console.log(
            "dataQuery?.user?.is_premium",
            dataQuery?.user?.is_premium
          );
          const isPremiumD = dataQuery?.user?.is_premium == true ? true : false;
          console.log("isPremiumD", isPremiumD);
          if (isPremiumD == null) {
            return res.status(400).json({ message: "Invalid data" });
          }
          // const accountInitScore = scoreAccount(accountAge, isPremiumD);
          const newUser = new User({
            ...dataQuery?.user,
            age: accountAge,
            // point: accountInitScore,
            refer: referalData?.from || process.env.DEFAULT_REF_ID,
          });
          // const referScore = new ReferalScore({
          //   score: getRefScoreAccount(accountInitScore),
          //   user_id: referalData?.from || process.env.DEFAULT_REF_ID,
          //   type: "account",
          // });
          // referScore.save();
          try {
            userData = await newUser.save();
          } catch (error) {
            console.error("Error saving user", error);
          }
        } else {
          console.log("REG VIA MINI APP");
          if (isNaN(referalAppID)) {
            return res.status(400).json({ message: "Invalid ref user ID" });
          }
          requireRegister = true;
          console.log(
            "dataQuery?.user?.is_premium",
            dataQuery?.user?.is_premium
          );
          const isPremiumD = dataQuery?.user?.is_premium == true ? true : false;
          console.log("isPremiumD", isPremiumD);
          if (isPremiumD == null) {
            return res.status(400).json({ message: "Invalid data" });
          }
          // const accountInitScore = scoreAccount(accountAge, isPremiumD);
          const newUser = new User({
            ...dataQuery?.user,
            age: accountAge,
            // point: accountInitScore,
            refer: referalAppID || process.env.DEFAULT_REF_ID,
          });
          // const referScore = new ReferalScore({
          //   score: getRefScoreAccount(accountInitScore),
          //   user_id: referalAppID || process.env.DEFAULT_REF_ID,
          //   type: "account",
          // });
          // referScore.save();
          try {
            userData = await newUser.save();
          } catch (error) {
            console.error("Error saving user", error);
          }
        }
      }
      try {
        const newUserData = dataQuery?.user;
        const { first_name, last_name, username } = newUserData;
        console.log(first_name, last_name, username);
        const updatedUserData = {};
        let updateNeeded = false;
        console.log(
          first_name != userData.first_name,
          first_name,
          userData.first_name
        );
        // Check if first_name differs
        if (first_name != userData.first_name) {
          updatedUserData.first_name = first_name;
          updateNeeded = true;
        }

        // Check if last_name differs
        if (last_name != userData.last_name) {
          updatedUserData.last_name = last_name;
          updateNeeded = true;
        }

        // Check if username differs
        if (username != userData.username) {
          updatedUserData.username = username;
          updateNeeded = true;
        }

        if (updateNeeded) {
          // Update the database with new data
          await User.updateOne({ id: userData.id }, { $set: updatedUserData });
          console.log("User data updated:", updatedUserData);
        }
      } catch (error) {
        console.log("AUTH ERROR CHECK DIFF INFO", error);
        // return res
        //   .status(401)
        //   .json({ message: "Error occur", error: error.message });
      }

      return res.status(200).json({
        message: "Valid user",
        success: true,
        data: userData,
        registration: requireRegister,
      });
    } catch (error) {
      console.log("AUTH ERROR", error);
      return res
        .status(401)
        .json({ message: "Error occur", error: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const { userToken } = req.body;
      console.log({ userToken });
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
        console.log("Not found user: getUser: ", userId);
        return res.status(401).json({ message: "User not found" });
      }
      if (user) {
        await user.save();
        return res.status(200).json({
          message: "Valid user",
          success: true,
          data: {
            ...user.toJSON(),
          },
        });
      }
      return res.status(401).json({
        message: "Not valid user",
        success: false,
      });
    } catch (error) {
      console.log("TAP ERROR", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
  getTotalUser: async (req, res) => {
    try {
      const totalUser = await User.estimatedDocumentCount();

      return res.status(200).json({
        success: true,
        totalUser,
      });
    } catch (error) {
      const err = error?.response?.toJSON();
      console.log("error", error);
      return res.status(401).json({ message: err?.body?.description });
    }
  },
  updateWallet: async (req, res) => {
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
      const connectedUser = await User.findOne({
        "wallet.address": wallet?.address,
      });
      console.log("CONNECTED WALLET USER: ", connectedUser, wallet);
      try {
        await User.updateOne({ id: userId }, { wallet: wallet });
      } catch (error) {
        return res
          .status(401)
          .json({ message: "UPDATE WALLET ERROR: not saved" });
      }
      return res.status(200).json({
        message: "Valid user",
        success: true,
        // data: { ...user.toJSON(), referalMulEarned, ...levelMul },
      });
    } catch (error) {
      console.log("UPDATE WALLET ERROR", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
  getBoostTnxs: async (req, res) => {
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
        console.log("getBoostTnxs - User not found: ", userId);
        return res.status(401).json({ message: "User not found" });
      }

      const walletData = user?.wallet;
      const walletAddress = user?.wallet?.address;

      if (!walletData || !walletAddress) {
        return res
          .status(400)
          .json({ message: "User has no connected wallet" });
      }

      const rawWalletAddress =
        convertToRawAddress(walletAddress)?.toUpperCase();
      // test - debug
      // const rawWalletAddress = convertToRawAddress(
      //   "0QCnqRifzRV72_MxQuEgxIGvv26LOSxoFLfGIQCBJXN1EB1p"
      // ).toUpperCase();

      const transactions = await BoostTnxSchema.find({
        source: rawWalletAddress,
      });

      return res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.log("getBoostTnxs - error: ", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
  isChatedWithBot: async (req, res) => {
    try {
      const { userToken } = req.body;
      console.log("userToken", userToken);
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: "Not a valid token" });
      }
      let userData = null;
      let requireRegister = false;
      const dataQueryRaw = parseTelegramInitData(userToken);
      // const dataQuery = escapeData(dataQueryRaw);
      const dataQuery = dataQueryRaw;
      const userId = parseInt(dataQuery?.user?.id);
      console.log("userId", userId);

      const accountAge = getAccountAge(userId);
      console.log("accountAge", accountAge);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      userData = await User.findOne({ id: userId });
      // const referalData = await Referal.findOne({ to: userId });

      return res.status(200).json({
        message: "Valid user",
        success: true,
        // data: referalData,
      });
    } catch (error) {
      console.log("AUTH ERROR", error);
      return res
        .status(401)
        .json({ message: "Error occur", error: error.message });
    }
  },
};
module.exports = UserController;
