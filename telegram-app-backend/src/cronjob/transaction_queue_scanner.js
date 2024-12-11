const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const cron = require("node-cron");
const { TransactionQueue, Transaction, Logger } = require("../models/Tx");
const UserNodeHistory = require("../models/userNodeHistory");
const { delay } = require("../utils");
const { getCurrentTimeInSeconds } = require("../utils/tools");

dotenv.config();

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const scanTransactions = async () => {
  let transactionQueues = await TransactionQueue.find().limit(
    process.env.TRANSACTIONS_NUMBER_PER_REQUEST
  );
  if (transactionQueues.length > 0) {
    for (const transactionQueue of transactionQueues) {
      let traceMessage = [];
      let isNeedRecheck = true;
      const transactionCountByHash = await Transaction.countDocuments({
        hash: transactionQueue.hash,
      });
      if (transactionCountByHash) {
        isNeedRecheck = false;
        traceMessage.push("Transaction is exist!");
      } else {
        try {
          traceMessage.push("Starting scann with TonAPI");
          const { status, data } = await axios.get(
            `${process.env.TONAPI_IO_V2_API_URL}/traces/${transactionQueue.hash}`,
            {
              headers: {
                accept: "application/json",
              },
            }
          );
          if (status == 200) {
            traceMessage.push("Can get transaction data from TonAPI");
            if (data.transaction.success == true) {
              traceMessage.push("Status of Transaction is success");
              let fromInScan = "";
              let toInScan = "";
              let transferAmount = "";
              let message = "";
              if (
                data.transaction.account &&
                data.transaction.account.is_wallet == true &&
                data.transaction.account.is_scam == false
              ) {
                fromInScan = data.transaction.account.address;
              } else {
                traceMessage.push(
                  `Sender not valid: is_wallet ${data.transaction.account.is_wallet} & is_scam ${data.transaction.account.is_scam}`
                );
              }
              if (
                data.transaction.in_msg.decoded_body.actions &&
                data.transaction.in_msg.decoded_body.actions[0] &&
                data.transaction.in_msg.decoded_body.actions[0].msg &&
                data.transaction.in_msg.decoded_body.actions[0].msg
                  .message_internal
              ) {
                if (
                  data.transaction.in_msg.decoded_body.actions[0].msg
                    .sum_type == "MessageInternal"
                ) {
                  toInScan =
                    data.transaction.in_msg.decoded_body.actions[0].msg
                      .message_internal.dest;
                  transferAmount =
                    data.transaction.in_msg.decoded_body.actions[0].msg
                      .message_internal.value.grams;
                  isNeedRecheck = false;
                  if (
                    data.transaction.in_msg.decoded_body.actions[0].msg
                      .message_internal.body.value.sum_type == "TextComment"
                  ) {
                    message =
                      data.transaction.in_msg.decoded_body.actions[0].msg
                        .message_internal.body.value.value.text;
                    let jsonObject;
                    if (isJson(message)) {
                      jsonObject = JSON.parse(message);
                    } else {
                      jsonObject = null;
                    }
                    if (jsonObject) {
                      if (
                        jsonObject?.id &&
                        jsonObject?.nodeTierId &&
                        jsonObject?.qty &&
                        jsonObject?.referral
                      ) {
                        console.log({ jsonObject });
                        const currentTime = getCurrentTimeInSeconds();
                        const obj = {
                          id: jsonObject.id,
                          nodeTierId: jsonObject.nodeTierId,
                          qty: jsonObject.qty,
                          bachi_claim_last_time: currentTime,
                          ton_claim_last_time: currentTime,
                          hash: transactionQueue.hash,
                        };

                        const userNodeHistoryUpdate =
                          await UserNodeHistory.findOneAndUpdate(
                            { id: obj.id, hash: obj.hash },
                            obj,
                            { upsert: true }
                          );
                      }
                    } else {
                      console.log(
                        "The message was not parsed due to invalid JSON, but the program continues running."
                      );
                    }
                  } else {
                    traceMessage.push(
                      "Sum_type not TextComment when getting message"
                    );
                  }
                } else {
                  traceMessage.push(
                    "Sum_type not MessageInternal when getting transfer amount, receiver, message"
                  );
                }
              } else if (
                data.transaction.in_msg.decoded_body.payload &&
                data.transaction.in_msg.decoded_body.payload[0] &&
                data.transaction.in_msg.decoded_body.payload[0].message &&
                data.transaction.in_msg.decoded_body.payload[0].message
                  .message_internal
              ) {
                if (
                  data.transaction.in_msg.decoded_body.payload[0].message
                    .sum_type == "MessageInternal"
                ) {
                  toInScan =
                    data.transaction.in_msg.decoded_body.payload[0].message
                      .message_internal.dest;
                  transferAmount =
                    data.transaction.in_msg.decoded_body.payload[0].message
                      .message_internal.value.grams;
                  isNeedRecheck = false;
                  // if (data.transaction.in_msg.decoded_body.payload[0].msg.message_internal.body.value.sum_type == 'TextComment') {
                  //     message = data.transaction.in_msg.decoded_body.payload[0].msg.message_internal.body.value.value.text;
                  // } else {
                  //     traceMessage.push('Sum_type not TextComment when getting message');
                  // }
                } else {
                  traceMessage.push(
                    "Sum_type not MessageInternal when getting transfer amount, receiver, message"
                  );
                }
              } else {
                traceMessage.push(
                  "Can not get data in_msg field of transaction"
                );
              }

              await Transaction.create({
                hash: transactionQueue.hash,
                from_in_queue: transactionQueue.from,
                to_in_queue: transactionQueue.to,
                from_in_scan: fromInScan,
                to_in_scan: toInScan,
                amount_transfer: transferAmount,
                message: message,
                transaction_time: data.transaction.utime,
              });
              traceMessage.push("Scan this transcation successfully");
            } else {
              traceMessage.push("Status of Transction is not success");
            }
          } else {
            traceMessage.push("Can not get data from tonapi");
          }
        } catch (e) {
          traceMessage.push(e.message);
          console.log(e);
        }
      }
      await Logger.create({
        hash: transactionQueue.hash,
        from: transactionQueue.from,
        to: transactionQueue.to,
        trace_message: JSON.stringify(traceMessage),
        is_need_recheck: isNeedRecheck,
      });
      await TransactionQueue.deleteMany({ hash: transactionQueue.hash });
      await delay(1000);
    }
  } else {
    console.log("No transaction queue.");
  }
};

const connectDb = () => {
  return mongoose.connect(`${process.env.DB_URL}`);
};

connectDb().then(async () => {
  console.log("Connected database successfully!");
  cron.schedule(process.env.CRON_SCAN_TIME, async () => {
    await scanTransactions();
  });
});
