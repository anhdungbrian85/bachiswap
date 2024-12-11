const db = require("../models/index.js");
const { STATUS, MESSAGE, ERROR_MESSAGE } = require("../utils/contants.js");

const ConnectWalletHistory = db.connectWalletHistory;
const PlatformAnalysis = db.platformAnalysis;

const addWalletdHistory = async (req, res) => {
  try {
    const { wallet_address, ipAddress } = req.body;
    if (!wallet_address || !ipAddress) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    let found = await ConnectWalletHistory.findOne({
      wallet_address: wallet_address,
    });
    if (!found) {
      await ConnectWalletHistory.create({
        wallet_address: wallet_address,
        connectTime: new Date().getTime(),
        ipAddress: ipAddress,
      })
        .then((data) => {
          if (!data) {
            res.status(400).send({
              status: STATUS.FAILED,
              message: ERROR_MESSAGE.CAN_NOT_ADD,
            });
          } else {
            res.send({
              status: STATUS.OK,
              message: MESSAGE.SUCCESS,
              data: data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({
            status: STATUS.FAILED,
            message: error.message,
          });
        });
    } else {
      return res.send({
        status: STATUS.FAILED,
        message: "ConnecWalletHistory already exists",
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getAllUserWallet = async (req, res) => {
  try {
    let { limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;

    const data = await ConnectWalletHistory.find({})
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: Number(sort) });

    return res.status(200).json({
      status: STATUS.OK,
      message: MESSAGE.SUCCESS,
      ret: {
        data: data,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getCoutAllWallet = async (req, res) => {
  try {
    const count = await ConnectWalletHistory.countDocuments({});

    return res.status(200).json({
      status: "OK",
      message: "Count fetched successfully",
      ret: {
        addressCount: count,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getPlatform = async (req, res) => {
  try {
    const { field } = req.body;
    if (!field) {
      return res.status(400).json({
        status: "FAILED",
        message: "Field is required",
      });
    }
    const validFields = [
      "totalNode",
      "freeFarmer",
      "totalBalance",
      "totalUserWallet",
      "userByNode",
      "totalreferral",
    ];
    if (!validFields.includes(field)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid field",
      });
    }
    const data = await PlatformAnalysis.find({}, { [field]: 1, _id: 0 }).sort({
      createdAt: 1,
    }); 

    const values = data.map((item) => item[field]);

    return res.status(200).json({
      status: "OK",
      message: "Data fetched successfully",
      ret: {
        field: field,
        data: values,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
module.exports = {
  addWalletdHistory,
  getAllUserWallet,
  getCoutAllWallet,
  getPlatform,
};
