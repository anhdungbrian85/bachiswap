const EACH_DAY = "0 0 * * *"; // At 00:00 every day
const EACH_HOUR = "0 * * * *"; // Every 1 hour
const EACH_3_HOUR = "0 */3 * * *"; // Every 3 hours
const EACH_MINUTE = "* * * * *"; // Every 1 minute
const EACH_3_MINUTES = "*/3 * * * *"; // Every 3 minute
const EACH_5_MINUTES = "*/5 * * * *"; // Every 5 minute
const EACH_7_MINUTES = "*/7 * * * *"; // Every 7 minute
const EACH_11_MINUTES = "*/11 * * * *"; // Every 11 minute
const EACH_13_MINUTES = "*/13 * * * *"; // Every 13 minute
const EACH_15_MINUTES = "*/15 * * * *"; // Every 15 minute
const EACH_30_MINUTES = "*/30 * * * *"; // Every 30 minutes
const EACH_SECOND = "*/1 * * * * *"; // Every 1 second
const EACH_3_SECONDS = "*/3 * * * * *"; // Every 3 seconds
const EACH_5_SECONDS = "*/5 * * * * *"; // Every 5 seconds
const EACH_7_SECONDS = "*/7 * * * * *"; // Every 7 seconds
const EACH_11_SECONDS = "*/11 * * * * *"; // Every 11 seconds
const EACH_13_SECONDS = "*/13 * * * * *"; // Every 13 seconds
const EACH_10_SECONDS = "*/10 * * * * *"; // Every 10 seconds
const EACH_15_SECONDS = "*/15 * * * * *"; // Every 15 seconds
const EACH_30_SECONDS = "*/30 * * * * *"; // Every 30 seconds

const CHAINS = {
  testnet: {
    chainId: 17000,
    rpcUrls: "https://ethereum-holesky-rpc.publicnode.com",
  },
  mainnet: {
    chainId: 1,
    rpcUrls: "https://1.rpc.thirdweb.com",
  },
};

const STATUS = {
  FAILED: "FAILED",
  OK: "OK",
};

const MESSAGE = {
  SUCCESS: "SUCCESS",
  NO_INPUT: "No Input",
  NO_ADDRESS: "No address",
  INVALID_ADDRESS: "Invalid Address",
  INVALID_INPUT: "Invalid Input",
  INVALID_AUTHENTICATION: "Invalid Authentication",
  NOT_EXIST_ADDRESS: "Not Exist Address",
  INPUT_ALREADY_EXIST: "Input already exist",
};

const ERROR_MESSAGE = {
  SENDING_MAIL: "Error sending email",
  CAN_NOT_UPDATE: "Cannot update. Maybe data was not found!",
  CAN_NOT_ADD: "Cannot Add.",
};

const CONFIG_QUEUE_SCAN = {
  MAX_TX_queue_ALL_IN_PROCESSING: process.env.MAX_TX_queue_ALL_IN_PROCESSING
    ? parseInt(process.env.MAX_TX_queue_ALL_IN_PROCESSING)
    : 5,
};

const CONFIG_TYPE_NAME = {
  BC_PROCESSING_ALL_QUEUE_TX: "CronJobAzProcessingQueueTx",
};

const CRONJOB_ENABLE = {
  BC_TX_QUEUE_COLLECTOR:
    process.env.IS_ENABLE_JOB_BC_TX_QUEUE_COLLECTOR == "true",
};

const TRANSACTION_STATUS = {
  SUCCESS: "success",
  PENDING: "pending",
  FAILED: "failed",
};

let global_vars = {
  isScanning: true,
};

const CRONJOB_TIME = {
  EACH_MINUTE: EACH_MINUTE,
  EACH_3_MINUTES: EACH_3_MINUTES,
  EACH_5_MINUTES: EACH_5_MINUTES,
  EACH_7_MINUTES: EACH_7_MINUTES,
  EACH_3_SECONDS: EACH_3_SECONDS,
  EACH_DAY: EACH_DAY,
};

CONTRACT_FUNCTIONS = {
  BACHI_TOKEN: {},
  BACHI_NODE: {},
  NODE_MANAGER: {
    BUY: {
      name: "multiBuyNode",
      type: "Buy node",
    },
    WITHDRAW: {
      name: "withdraw",
      type: "withdraw",
    },
  },
  STAKING: {
    CLAIM: {
      name: "claimAllRewards",
      type: "Claim reward",
    },
    WITHDRAW_BACHI: {
      name: "withdrawBachiReward",
      type: "Withdraw Bachi",
    },
    WITHDRAW_TAIKO: {
      name: "withdrawTaikoReward",
      type: "Withdraw Taiko",
    },
  },
  QUEST_MANAGER: {},
};

module.exports = {
  global_vars: global_vars,
  CHAINS: CHAINS,
  STATUS: STATUS,
  MESSAGE: MESSAGE,
  ERROR_MESSAGE: ERROR_MESSAGE,
  CONFIG_QUEUE_SCAN: CONFIG_QUEUE_SCAN,
  TRANSACTION_STATUS: TRANSACTION_STATUS,
  CONFIG_TYPE_NAME: CONFIG_TYPE_NAME,
  CRONJOB_ENABLE: CRONJOB_ENABLE,
  CRONJOB_TIME: CRONJOB_TIME,
  CONTRACT_FUNCTIONS: CONTRACT_FUNCTIONS,
};
