require("dotenv").config();
const { ethers } = require("ethers");
const mongoose = require("mongoose");
const cron = require("node-cron");
const {
  node_manager_contract,
} = require("../contracts/node_manager_contract.js");
const {
  bachi_token_contract,
} = require("../contracts/bachi_token_contract.js");
const { bachi_node_contract } = require("../contracts/bachi_node_contract.js");
const { staking_contract } = require("../contracts/staking_contract.js");
const {
  quest_manager_contract,
} = require("../contracts/quest_manager_contract.js");
const db = require("../models/index.js");
const {
  CHAINS,
  CONFIG_QUEUE_SCAN,
  TRANSACTION_STATUS,
  CONFIG_TYPE_NAME,
  CRONJOB_ENABLE,
  CRONJOB_TIME,
  CONTRACT_FUNCTIONS,
} = require("../utils/contants.js");
const { convertToUTCTime } = require("../utils/tools.js");

const Transactions = db.transactions;
const TransactionQueue = db.transactionQueue;

const CONNECTION_STRING = `${process.env.MONGODB_URL}`;

const connectDb = () => {
  return mongoose.connect(CONNECTION_STRING);
};

let global_vars = {};
let bachiTokenContract = null;
let bachiNodeContract = null;
let nodeManagerContract = null;
let stakingContract = null;
let questManagerContract = null;
let provider = null;
let chainId = CHAINS[process.env.NODE_ENV].chainId;

const check_TX_queue = async () => {
  if (global_vars.is_check_TX_all) return;
  global_vars.is_check_TX_all = true;
  try {
    console.log(
      `${
        CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX
      } - Start find and update status of ${
        CONFIG_QUEUE_SCAN.MAX_TX_queue_ALL_IN_PROCESSING
      } TXs in check_TX_all at ${convertToUTCTime(new Date())}`
    );

    let tx_data = await TransactionQueue.find({
      status: TRANSACTION_STATUS.PENDING,tx_data
    }).limit(CONFIG_QUEUE_SCAN.MAX_TX_queue_ALL_IN_PROCESSING);

    if (!tx_data || tx_data.length === 0) {
      return;
    }

    let records_length = tx_data.length;
    console.log(
      `${
        CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX
      } - Start processing ${records_length} TXs in check_TX_all at ${convertToUTCTime(
        new Date()
      )}`
    );

    for (const queueData of tx_data) {
      let hash = queueData.hash;
      if (!hash) continue;
      let found_TX = await Transactions.findOne({
        hash: hash,
      });
      if (!found_TX) {
        console.log(
          `${CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX} - CREATE DATA IN Transactions DB`
        );
        const transaction = await provider.getTransaction(hash);
        if (transaction) {
          if (transaction.to == bachi_token_contract.CONTRACT_ADDRESS) {
            const { args, name } =
              nodeManagerContract.interface.parseTransaction({
                data: transaction.data,
              });
          } else if (transaction.to == bachi_node_contract.CONTRACT_ADDRESS) {
            const { args, name } =
              nodeManagerContract.interface.parseTransaction({
                data: transaction.data,
              });
          } else if (transaction.to == node_manager_contract.CONTRACT_ADDRESS) {
            const { args, name } =
              nodeManagerContract.interface.parseTransaction({
                data: transaction.data,
              });
            if (name == CONTRACT_FUNCTIONS.NODE_MANAGER.BUY.name) {
              const obj = {};
              obj.caller = transaction.from;
              obj.chainId = chainId;
              obj.hash = hash;
              obj.type = CONTRACT_FUNCTIONS.NODE_MANAGER.BUY.type;
              obj.ipAddress = queueData.ipAddress;
              const receipt = await provider.getTransactionReceipt(hash);
              if (receipt && receipt.status == 1) {
                obj.status = TRANSACTION_STATUS.SUCCESS;
                await Transactions.create(obj);
                await TransactionQueue.deleteMany({
                  hash: hash,
                });
              } else {
                obj.status = TRANSACTION_STATUS.PENDING;
                await Transactions.create(obj);
              }
            } else if (name == CONTRACT_FUNCTIONS.NODE_MANAGER.WITHDRAW) {
            }
          } else if (transaction.to == staking_contract.CONTRACT_ADDRESS) {
            const { args, name } =
              nodeManagerContract.interface.parseTransaction({
                data: transaction.data,
              });
          } else if (
            transaction.to == quest_manager_contract.CONTRACT_ADDRESS
          ) {
            const { args } = nodeManagerContract.interface.parseTransaction({
              data: transaction.data,
            });
          }
        }
      } else {
        const receipt = await provider.getTransactionReceipt(hash);
        if (receipt && receipt.status == 1) {
          console.log(
            `${CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX} - UPDATE DATA IN Transactions DB`
          );
          await Transactions.findOneAndUpdate(
            { hash: queueData.hash },
            {
              status: TRANSACTION_STATUS.SUCCESS,
            }
          );
          await TransactionQueue.deleteMany({
            hash: hash,
          });
        }
      }

      continue;
    }
  } catch (error) {
    console.log("check_TX_all - " + error.message);
    global_vars.is_check_TX_all = false;
  }
  global_vars.is_check_TX_all = false;
};

connectDb().then(async () => {
  provider = new ethers.JsonRpcProvider(CHAINS[process.env.NODE_ENV].rpcUrls);

  bachiTokenContract = new ethers.Contract(
    bachi_token_contract.CONTRACT_ADDRESS,
    bachi_token_contract.CONTRACT_ABI,
    provider
  );

  bachiNodeContract = new ethers.Contract(
    bachi_node_contract.CONTRACT_ADDRESS,
    bachi_node_contract.CONTRACT_ABI,
    provider
  );

  nodeManagerContract = new ethers.Contract(
    node_manager_contract.CONTRACT_ADDRESS,
    node_manager_contract.CONTRACT_ABI,
    provider
  );

  stakingContract = new ethers.Contract(
    staking_contract.CONTRACT_ADDRESS,
    staking_contract.CONTRACT_ABI,
    provider
  );

  questManagerContract = new ethers.Contract(
    quest_manager_contract.CONTRACT_ADDRESS,
    quest_manager_contract.CONTRACT_ABI,
    provider
  );

  await provider.ready;

  if (CRONJOB_ENABLE.BC_TX_QUEUE_COLLECTOR) {
    cron.schedule(
      CRONJOB_TIME.EACH_MINUTE,
      async () => {
        await check_TX_queue();
      },
      {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh",
      }
    );
  }
});
