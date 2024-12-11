const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const cron = require("node-cron");
const WithdrawHistory = require("../models/withdrawHistory");
const { delay } = require("../utils");
const {
  CHAINS,
  CONFIG_QUEUE_SCAN,
  TRANSACTION_STATUS,
  CONFIG_TYPE_NAME,
  CRONJOB_ENABLE,
  CRONJOB_TIME,
  CONTRACT_FUNCTIONS,
  CLAIM_MODE,
} = require("../utils/contants");
const { convertToUTCTime } = require("../utils/tools");
const miningConfig = require("../utils/miningConfig.json");
const TonWeb = require("tonweb");
const TonMnemonic = require("tonweb-mnemonic");
dotenv.config();

const TON_CENTER_BASE_URL = process.env.TON_CENTER_BASE_URL;
const TON_CENTER_API_KEY = process.env.TON_CENTER_API_KEY;
// Transfer withdraw wallet phase
const mnemonic = process.env.MNEMONIC_PHRASE;
const tokenAddress = miningConfig.bachiToken;

// const tonweb = new TonWeb();
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(`https://toncenter.com/api/v2/jsonRPC`, {
    apiKey: TON_CENTER_API_KEY,
  })
);

let global_vars = {};
let keyPair = null;

const waitForTransaction = async (
  seqno,
  wallet,
  queueData,
  walletAddress,
  payload
) => {
  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await delay(1500);
    currentSeqno = (await wallet.methods.seqno().call()) || 0;
  }
  console.log("transaction confirmed!");
  const transactions = await tonweb.getTransactions(walletAddress, 5);
  const transaction = transactions[0];

  if (
    transaction &&
    transaction.out_msgs &&
    transaction.out_msgs.length > 0
  ) {
    console.log("Update tx WithdrawHistory");
    await WithdrawHistory.updateOne({ _id: queueData._id }, { status: true });
  } else {
    console.error("Transaction not found or not confirmed yet.");
  }
};

const scanWithdrawHistorys = async () => {
  // if (global_vars.is_check_withdraw_history_all) return;
  global_vars.is_check_withdraw_history_all = true;
  try {
    console.log(
      `${
        CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX
      } - Start find and update status of ${
        CONFIG_QUEUE_SCAN.MAX_TX_queue_ALL_IN_PROCESSING
      } TXs in check_withdraw_history_all at ${convertToUTCTime(new Date())}`
    );

    const isValid = await TonMnemonic.validateMnemonic(mnemonic.split(" "));
    if (isValid) {
      keyPair = await TonMnemonic.mnemonicToKeyPair(mnemonic.split(" "));
    }

    let queue_data = await WithdrawHistory.find({
      status: false,
    }).limit(CONFIG_QUEUE_SCAN.MAX_TX_queue_ALL_IN_PROCESSING);

    if (!queue_data || queue_data.length === 0) {
      return;
    }

    let records_length = queue_data.length;
    console.log(
      `${
        CONFIG_TYPE_NAME.BC_PROCESSING_ALL_QUEUE_TX
      } - Start processing ${records_length} TXs in check_withdraw_history_all at ${convertToUTCTime(
        new Date()
      )}`
    );

    if (keyPair) {
      const secretKey = keyPair.secretKey;
      const publicKey = keyPair.publicKey;
      const WalletClass = tonweb.wallet.all["v3R2"];
      const wallet = new WalletClass(tonweb.provider, {
        publicKey,
      });
      // Fetch the jetton wallet address for the source wallet
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        { address: tokenAddress }
      );

      for (const queueData of queue_data) {
        const seqno = (await wallet.methods.seqno().call()) || 0;

        // wallet
        const walletAddress = await wallet.getAddress();
        const balance = await tonweb.getBalance(walletAddress);
        console.log(
          "Wallet Address:",
          walletAddress.toString(true, true, false)
        );
        console.log("Wallet Balance:", balance);

        // token
        const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
          new TonWeb.utils.Address(walletAddress)
        );
        const jettonWallet = new TonWeb.token.jetton.JettonWallet(
          tonweb.provider,
          {
            address: jettonWalletAddress,
          }
        );
        const data = await jettonWallet.getData();
        const jettonBalance = data.balance.toString();
        console.log(
          "Jetton Wallet Address:",
          jettonWalletAddress.toString(true, true, true)
        );
        console.log(
          "Jetton owner address:",
          data.ownerAddress.toString(true, true, true)
        );
        console.log("Jetton balance:", jettonBalance);

        if (queueData.mode == CLAIM_MODE.CLAIM_BACHI) {
          const nanoTONAmount = BigInt(queueData.bachi_amount);
          if (nanoTONAmount > BigInt(jettonBalance)) {
            console.log("Not enough balance");
            continue;
          }

          const payload = await jettonWallet.createTransferBody({
            jettonAmount: nanoTONAmount,
            toAddress: new TonWeb.utils.Address(queueData.wallet),
            responseAddress: new TonWeb.utils.Address(
              walletAddress.toString(true, true, false)
            ),
            forwardAmount: TonWeb.utils.toNano("0.01"),
            forwardPayload: new TextEncoder().encode("transfer bachi"),
          });

          const transfer = wallet.methods.transfer({
            secretKey: secretKey,
            toAddress: jettonWalletAddress,
            amount: TonWeb.utils.toNano("0.05"),
            seqno: seqno,
            payload: payload,
            sendMode: 3,
          });

          await transfer.send();
          console.log("Bachi transfer complete!");
          await waitForTransaction(
            seqno,
            wallet,
            queueData,
            walletAddress,
            payload
          );
        } else if (queueData.mode == CLAIM_MODE.CLAIM_TON) {
          const nanoTONAmount = BigInt(queueData.ton_amount);
          const payload = "transfer ton";
          if (nanoTONAmount > BigInt(balance)) {
            console.log("Not enough balance");
            continue;
          }

          const transfer = wallet.methods.transfer({
            secretKey: secretKey,
            toAddress: queueData.wallet,
            amount: nanoTONAmount,
            seqno: seqno,
            sendMode: 3,
            payload: payload,
          });

          await transfer.send();
          console.log("TON transfer complete!");
          await waitForTransaction(
            seqno,
            wallet,
            queueData,
            walletAddress,
            payload
          );
        }

        continue;
      }
    }
  } catch (error) {
    console.log({ error });
    console.log("check_withdraw_history_all - " + error.message);
    global_vars.is_check_withdraw_history_all = false;
  }
};

const connectDb = () => {
  return mongoose.connect(`${process.env.DB_URL}`);
};

connectDb().then(async () => {
  console.log("Connected database successfully!");
  cron.schedule(
    CRONJOB_TIME.EACH_MINUTE,
    async () => {
      await scanWithdrawHistorys();
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );
});
