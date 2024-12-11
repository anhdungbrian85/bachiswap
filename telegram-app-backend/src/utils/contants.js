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
    chainId: 167009,
    rpcUrls: "https://rpc.hekla.taiko.xyz",
  },
  mainnet: {
    chainId: 167000,
    rpcUrls: "https://rpc.mainnet.taiko.xyz",
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
  NOT_A_VALID_TOKEN: "Not a valid token",
  INVALID_USER_ID: "Invalid user ID",
  NOT_VALID_USER_VERIFY_TASK: "Not valid user VERIFY TASK::",
  NO_TASK_DATA: "No task data",
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
  PROCESSING: "processing",
  COMPLETED: "completed",
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
    WITHDRAW_TON: {
      name: "withdrawTonReward",
      type: "Withdraw Ton",
    },
  },
  QUEST_MANAGER: {},
};

const DEFAULT_REFERRAL_RATE = 10;

const CLAIM_MODE = {
  CLAIM_BACHI: 1,
  CLAIM_TON: 2,
  CLAIM_ALL: 3,
};

const MIN_CLAIM = {
  BACHI: process.env.MIN_CLAIM_BACHI || 0,
  TON: process.env.MIN_CLAIM_TON || BigInt("3000000000"),
};

const MIN_WITHDRAW = {
  BACHI: process.env.MIN_WITHDRAW_BACHI || 0,
  TON: process.env.MIN_CLAIM_TON || BigInt("5000000000"),
};

const TASKS_TYPE = {
  LIMIT_TASK: 1,
  DALLY_TASK: 2,
};

const TASK_GROUPS = {
  TON_MISSIONS: {
    INVITE_YOUR_FIRST_FRIEND: "BACHISWAP_TASK_1",
    RENT_YOUR_FIRST_MINER_BOOSTER: "BACHISWAP_TASK_2",
    INITIAL_BONUS: "BACHISWAP_TASK_3",
  },
  SOCIAL_MISSIONS: {
    INVITE_PARTNER_JOIN_US: "BACHISWAP_TASK_8",
    CLAIM_YOUR_DAILY_REWARDS: "BACHISWAP_TASK_9",
    CONNECT_YOUR_X_ACCOUNT: "BACHISWAP_TASK_10",
    CONNECT_YOUR_DISCORD_ACCOUNT: "BACHISWAP_TASK_11",
    CONNECT_YOUR_DISCORD_ACCOUNT_1: "BACHISWAP_TASK_12",
    CONNECT_YOUR_DISCORD_ACCOUNT_2: "BACHISWAP_TASK_13",
  },
  NODE_MISSIONS: {
    PURCHASE_YOUR_FIRST_BOOSTER: "BACHISWAP_TASK_4",
    FOLLOW_TAIKOXYZ_ON_X: "BACHISWAP_TASK_5",
    SAY_HELLO_TO_DISCORD_SERVER: "BACHISWAP_TASK_6",
    REACHED_ON_DISCORD_SERVER: "BACHISWAP_TASK_7",
  },
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
  DEFAULT_REFERRAL_RATE: DEFAULT_REFERRAL_RATE,
  CLAIM_MODE: CLAIM_MODE,
  MIN_CLAIM: MIN_CLAIM,
  MIN_WITHDRAW: MIN_WITHDRAW,
  TASKS_TYPE: TASKS_TYPE,
  TASK_GROUPS: TASK_GROUPS,
};
