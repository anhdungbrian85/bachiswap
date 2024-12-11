const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cron = require('node-cron');
const { TransactionQueue, Transaction, LastTimeScan } = require('../models/Tx');
const { delay } = require('../utils');

dotenv.config();

const rescanTransactions = async () => {
    const lastTimeScanSetting = await LastTimeScan.findOne({wallet_address: process.env.RECEIVER_ADDRESS_OF_TRANSFER_TASK});
    let startDate = '';
    let endDate = Math.floor(Date.now() / 1000);
    let nowDate = new Date();
    const startDateTmp = nowDate.setDate(nowDate.getDate() - 1);
    startDate = Math.floor(startDateTmp / 1000)
    if (lastTimeScanSetting) {
        startDate = lastTimeScanSetting.last_value;
    }
    console.log(process.env.RECEIVER_ADDRESS_OF_TRANSFER_TASK);
    const {status, data} = await axios.get(`${process.env.TONAPI_IO_V2_API_URL}/accounts/${encodeURI(process.env.RECEIVER_ADDRESS_OF_TRANSFER_TASK)}/events`, {
        params: {
          'limit': '100'
        },
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'ru-RU,ru;q=0.5'
        }
    });
    if (data.events.length > 0) {
        for (let event of data.events) {
            if (event.actions[0]) {
                if (event.actions[0].status == 'ok' && event.actions[0].type == 'TonTransfer') {
                    let {sender, recipient} = event.actions[0].TonTransfer;
                    if (sender.is_wallet == true && recipient.is_wallet == true && recipient.address == process.env.RECEIVER_ADDRESS_OF_TRANSFER_TASK) {
                        let transaction = await Transaction.findOne({hash: event.event_id});
                        let transactionQueue = await TransactionQueue.findOne({hash: event.event_id});
                        if (transaction || transactionQueue) {
                            continue;
                        }
                        await TransactionQueue.create({
                            hash: event.event_id,
                            from: sender.address,
                            to: recipient.address,
                        });
                        await delay(1000);
                    }
                }
            }
        }
    }
    
}

const connectDb = () => {
    return mongoose.connect(`${process.env.DB_URL}`);
};

connectDb().then(async () => {
    console.log('Connected database successfully!');
    cron.schedule(process.env.CRON_RESCAN_TRANSACTION_TIME, async () => {
        await rescanTransactions();
    });
});
