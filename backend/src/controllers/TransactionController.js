const TransactionServices = require("../services/TransactionService");
const db = require("../models/index.js");
const {
  STATUS,
  MESSAGE,
  ERROR_MESSAGE,
  TRANSACTION_STATUS,
} = require("../utils/contants.js");
const UserNodeLinks = db.userNodeLinks;
const TransactionQueue = db.transactionQueue;

const createTransaction = async (req, res) => {
  try {
    const { caller, chainId, hash, type, ipAddress, status } = req.body;

    if (!caller || !chainId || !hash || !type || !ipAddress || !status) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }

    try {
      const response = await TransactionServices.createTransaction(req.body);
      if (response.status === "FAILED") {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { hash, status } = req.body;

    if (!hash || !status) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }

    try {
      const response = await TransactionServices.updateTransaction(req.body);
      if (response.status === "FAILED") {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    let { limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;

    try {
      const response = await TransactionServices.getTransaction({
        limit,
        offset,
        sort,
      });
      if (response.status === "FAILED") {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getReferrals = async (req, res) => {
  try {
    let { caller, limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;
    if (!caller) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }

    try {
      const response = await TransactionServices.getReferrals({
        caller,
        limit,
        offset,
        sort,
      });
      if (response.status === "FAILED") {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const checkIP = async (req, res) => {
  try {
    const { ip: ipAddress } = req.query;
    console.log({ ipAddress });
    if (!ipAddress) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }
    try {
      const response = await TransactionServices.checkIP(ipAddress);
      if (response.status === "FAILED") {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getUserBuyNodeHistory = async (req, res) => {
  try {
    let { caller, nodeTierId } = req.body;
    if (!caller) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const filter = { caller: caller };
    if (nodeTierId) filter.nodeTierId = nodeTierId;

    const data = await UserNodeLinks.find(filter);

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

const getTotalUserBuyNode = async (req, res) => {
  try {
    const filter = {};
    const data = await UserNodeLinks.aggregate([
      { $match: filter },
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

const getTotalNodeBuy = async (req, res) => {
  try {
    let { caller, nodeTierId } = req.body;
    const filter = {};
    if (caller) filter.caller = caller;
    if (nodeTierId) filter.nodeTierId = nodeTierId;

    const data = await UserNodeLinks.find(filter);

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

const createTransactionQueue = async (req, res) => {
  try {
    const { hash, ipAddress } = req.body;

    if (!hash || !ipAddress) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }

    let found = await TransactionQueue.findOne({
      hash: hash,
      ipAddress: ipAddress,
      status: TRANSACTION_STATUS.PENDING,
    });
    if (!found) {
      await TransactionQueue.create({
        hash: hash,
        ipAddress: ipAddress,
        status: TRANSACTION_STATUS.PENDING,
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
        message: "Tx already exists",
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  getTransaction,
  getReferrals,
  checkIP,
  getUserBuyNodeHistory,
  getTotalNodeBuy,
  createTransactionQueue,
  getTotalUserBuyNode,
};
