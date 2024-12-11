const BlockedIP = require("../models/BlockedIPModel");
const Transaction = require("../models/TransactionModel");
const Referrals = require("../models/referrals.model");

const createTransaction = (newTransaction) => {
  return new Promise(async (resolve, reject) => {
    const { caller, chainId, hash, type, ipAddress, status } = newTransaction;
    try {
      const existingTransaction = await Transaction.findOne({
        hash: hash,
      });
      if (!existingTransaction) {
        const createTransaction = await Transaction.create({
          caller,
          chainId,
          hash,
          type,
          ipAddress,
          status,
        });
        if (createTransaction) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createTransaction,
          });
        } else {
          resolve({
            status: "FAILED",
            message: "Transaction creation failed",
          });
        }
      } else
        resolve({
          status: "FAILED",
          message: "Transaction is exist",
        });
    } catch (e) {
      reject({
        status: "FAILED",
        message: "Error creating transaction",
        error: e.message,
      });
    }
  });
};

const updateTransaction = (newTransaction) => {
  return new Promise(async (resolve, reject) => {
    const { hash, status } = newTransaction;
    try {
      const existingTransaction = await Transaction.findOne({
        hash: hash,
      });
      if (existingTransaction) {
        const updateTransaction = await Transaction.findOneAndUpdate(
          { hash },
          { status }
        );
        if (updateTransaction) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: updateTransaction,
          });
        } else {
          resolve({
            status: "FAILED",
            message: "Transaction creation failed",
          });
        }
      } else
        resolve({
          status: "FAILED",
          message: "Transaction not exist",
        });
    } catch (e) {
      reject({
        status: "FAILED",
        message: "Error update transaction",
        error: e.message,
      });
    }
  });
};

const getTransaction = (query) => {
  return new Promise(async (resolve, reject) => {
    const { limit, offset, sort } = query;

    try {
      const [totalData, data] = await Promise.all([
        Transaction.find({status: "success"}),
        Transaction.find({status: "success"})
          .skip(Number(offset))
          .limit(Number(limit))
          .sort({ createdAt: Number(sort) }),
      ]);

      if (data && totalData) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          ret: {
            data: data,
            total: totalData.length,
          },
        });
      } else
        resolve({
          status: "FAILED",
          message: "Transaction is not exist",
        });
    } catch (e) {
      reject({
        status: "FAILED",
        message: "Error get transaction",
        error: e.message,
      });
    }
  });
};

const getReferrals = (query) => {
  return new Promise(async (resolve, reject) => {
    const { caller, limit, offset, sort } = query;

    try {
      const [totalData, data] = await Promise.all([
        Referrals.find({
          referralsOwner: caller,
        }),
        Referrals.find({
          referralsOwner: caller,
        })
          .skip(Number(offset))
          .limit(Number(limit))
          .sort({ createdAt: Number(sort) }),
      ]);

      if (data && totalData) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          ret: {
            data: data,
            total: totalData.length,
          },
        });
      } else
        resolve({
          status: "FAILED",
          message: "Referrals is not exist",
        });
    } catch (e) {
      reject({
        status: "FAILED",
        message: "Error get referrals",
        error: e.message,
      });
    }
  });
};

const checkIP = (ipAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isBlocked = await BlockedIP.findOne({ ipAddress: ipAddress });
      if (!isBlocked) {
        resolve({
          status: "OK",
          message: "The ip is not defined",
          ret: {
            blocked: false,
          },
        });
      }

      resolve({
        status: "OK",
        message: "success",
        ret: {
          blocked: true,
        },
      });
    } catch (e) {
      reject({
        status: "FAILED",
        message: "Error creating transaction",
        error: e.message,
      });
    }
  });
};

module.exports = {
  createTransaction,
  updateTransaction,
  getTransaction,
  getReferrals,
  checkIP,
};
