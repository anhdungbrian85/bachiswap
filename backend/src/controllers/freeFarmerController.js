const db = require("../models/index");
const { STATUS, MESSAGE, ERROR_MESSAGE, CHAINS } = require("../utils/contants");
const { freeFarmeSpeed } = require("../utils/tools");
const { ethers } = require("ethers");
// const privateKey = process.env.PRIVATE_KEY;
// const provider = new ethers.JsonRpcProvider(
//   CHAINS[process.env.NODE_ENV].rpcUrls
// );
// const wallet = new ethers.Wallet(privateKey, provider);
const FreeFarmer = db.freeFarmer;
const createFreeFarmer = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    let found = await FreeFarmer.findOne({
      wallet_address: wallet_address,
    });
    if (!found) {
      await FreeFarmer.create({
        wallet_address: wallet_address,
        bachiStartTime: new Date().getTime(),
        taikoStartTime: new Date().getTime(),
        bachiRewardAmount: 0,
        taikoRewardAmount: 0,
      })
        .then((data) => {
          if (!data) {
            res.status(404).send({
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
          res
            .status(500)
            .send({ status: STATUS.FAILED, message: error.message });
        });
    } else {
      return res.status(500).json({
        status: STATUS.FAILED,
        message: "FreeFarmer already exists",
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
const getFarmer = async (req, res) => {
  try {
    let { wallet_address } = req.body;
    if (!wallet_address) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const data = await FreeFarmer.findOne(req.body);

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

const getAllFreeFarmer = async (req, res) => {
  try {
    let { limit, offset, sort } = req.body;
    if (!limit) limit = 1000;
    if (!offset) offset = 0;
    if (!sort) sort = -1;

    const data = await FreeFarmer.find({})
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: Number(sort) });

    return res.status(200).json({
      status: STATUS.OK,
      message: MESSAGE.SUCCESS,
      ret: {
        data: data,
        total: data.length,
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

const claimFreeFarmer = async (req, res) => {
  try {
    const { wallet_address, mode } = req.body;
    if (!wallet_address || !mode) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    let found = await FreeFarmer.findOne({
      wallet_address: wallet_address,
    });
    if (found) {
      let obj = {};
      if (mode == 0) {
        obj.bachiStartTime = new Date().getTime();
        obj.bachiRewardAmount =
          found.bachiRewardAmount +
          ((new Date().getTime() - found.bachiStartTime) / 1000) *
            freeFarmeSpeed.bachi;
      } else if (mode == 1) {
        obj.taikoStartTime = new Date().getTime();
        obj.taikoRewardAmount =
          found.taikoRewardAmount +
          ((new Date().getTime() - found.taikoStartTime) / 1000) *
            freeFarmeSpeed.taiko;
      } else if (mode == 2) {
        obj.bachiStartTime = new Date().getTime();
        obj.bachiRewardAmount =
          found.bachiRewardAmount +
          ((new Date().getTime() - found.bachiStartTime) / 1000) *
            freeFarmeSpeed.bachi;
        obj.taikoStartTime = new Date().getTime();
        obj.taikoRewardAmount =
          found.taikoRewardAmount +
          ((new Date().getTime() - found.taikoStartTime) / 1000) *
            freeFarmeSpeed.taiko;
      }
      await FreeFarmer.findOneAndUpdate(
        {
          wallet_address: wallet_address,
        },
        obj
      )
        .then((data) => {
          if (!data) {
            res.status(404).send({
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
          res
            .status(500)
            .send({ status: STATUS.FAILED, message: error.message });
        });
    } else {
      return res.status(500).json({
        status: STATUS.FAILED,
        message: "FreeFarmer not exists",
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

module.exports = {
  createFreeFarmer,
  getFarmer,
  getAllFreeFarmer,
  claimFreeFarmer,
};
