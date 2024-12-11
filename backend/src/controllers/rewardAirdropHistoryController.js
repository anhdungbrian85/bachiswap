const db = require("../models/index.js");
const { STATUS, MESSAGE, ERROR_MESSAGE } = require("../utils/contants.js");

const RewardHistory = db.rewardHistory;

const addRewardHistory = async (req, res) => {
  try {
    const { wallet_address, task_id, point } = req.body;

    if (!wallet_address || !task_id || !point) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const filter = { wallet_address: wallet_address, task_id: task_id };
    let found = await RewardHistory.findOne(filter).sort({ createdAt: -1 });
    if (!found) {
      await RewardHistory.create(req.body)
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
      if (task_id == 4) {
        const currentTime = new Date();
        const previousClaimDate = new Date(found.createdAt);
        const currentDay = new Date(currentTime.toDateString());
        const previousDay = new Date(previousClaimDate.toDateString());
        if (currentDay > previousDay) {
          await RewardHistory.create(req.body)
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
            message: "Invalid Time",
          });
        }
      } else {
        return res.status(500).json({
          status: STATUS.FAILED,
          message: "User already exists",
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const updateRewardHistory = async (req, res) => {
  try {
    const { wallet_address, task_id, point } = req.body;

    if (!wallet_address || !task_id || !point) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const filter = { wallet_address: wallet_address, task_id: task_id };
    const update = { point: point };
    let found = await RewardHistory.findOne(filter);
    if (found) {
      await RewardHistory.findOneAndUpdate(filter, update)
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
        message: "User not exists",
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

const getAllRewardHistory = async (req, res) => {
  try {
    let { limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;

    const data = await RewardHistory.find({})
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

const getRewardHistory = async (req, res) => {
  try {
    let { wallet_address, limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;
    if (!wallet_address) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const [totalData, data] = await Promise.all([
      RewardHistory.find({ wallet_address: wallet_address }),
      RewardHistory.find({ wallet_address: wallet_address })
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ createdAt: Number(sort) }),
    ]);

    return res.status(200).json({
      status: STATUS.OK,
      message: MESSAGE.SUCCESS,
      ret: {
        data: data,
        total: totalData.length,
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

const getRewardHistoryByTaskId = async (req, res) => {
  try {
    let { wallet_address, task_id } = req.body;
    if (!wallet_address || !task_id) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const data = await RewardHistory.findOne({
      wallet_address: wallet_address,
      task_id: task_id,
    }).sort({ createdAt: -1 });

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

module.exports = {
  addRewardHistory,
  updateRewardHistory,
  getRewardHistory,
  getAllRewardHistory,
  getRewardHistoryByTaskId,
};
