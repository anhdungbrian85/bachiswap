const mongoose = require('mongoose');

const transactionQueueSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
});

const transactionSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    from_in_queue: {
        type: String
    },
    to_in_queue: {
        type: String
    },
    from_in_scan: {
        type: String
    },
    to_in_scan: {
        type: String
    },
    amount_transfer: {
        type: String
    },
    message: {
        type: String
    },
    is_sync: {
        type: Boolean,
        default: false
    },
    transaction_time: {
        type: String
    }
});

const LastTimeScanSchema = new mongoose.Schema({
    wallet_address: {
        type: String,
        required: true,
        unique: true
    },
    last_value: {
        type: String
    }
});

const loggerSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    trace_message: {
        type: String
    },
    is_need_recheck: {
        type: Boolean
    }
});

const TransactionQueue = mongoose.model("TransactionQueue", transactionQueueSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const Logger = mongoose.model("Logger", loggerSchema);
const LastTimeScan = mongoose.model("LastTimeScan", LastTimeScanSchema);

module.exports = { TransactionQueue, Transaction, Logger, LastTimeScan }
