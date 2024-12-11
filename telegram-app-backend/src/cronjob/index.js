const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { TraceObserver, WebsocketStreamProvider } = require('@ton-api/streaming');
const { TransactionQueue, Transaction } = require('../models/Tx');

dotenv.config();

const wsProvider = new WebsocketStreamProvider(
    `${process.env.TONAPI_IO_RPC_URL}?token=${process.env.TONAPI_IO_API_KEY}`
);

const main = async () => {
    console.log(wsProvider);
    try {
        await wsProvider.open();
    } catch (error) {
        console.log(error);
    }

    const traceObserver = new TraceObserver(wsProvider);

    const connectDb = () => {
        return mongoose.connect(`${process.env.DB_URL}`);
    };

    try {
        await connectDb();
        console.log('Connected database successfully!');
        traceObserver.subscribe(process.env.RECEIVER_ADDRESS_OF_TRANSFER_TASK, async (event) => {
            console.log('Subscribe to new traces appearing on the account', event.hash);
            if (event.hash) {
                try {
                    await TransactionQueue.create({
                        hash: event.hash,
                        from: (event.accounts && event.accounts[1]) ? event.accounts[1] : '',
                        to: (event.accounts && event.accounts[0]) ? event.accounts[0] : ''
                    });
                    console.log(`Added ${event.hash} successfully!`);
                } catch (e) {
                    console.log('Has an error:', e);
                }
            }
        });
    } catch (error) {
        console.log("error connectDb: ", error);
    }
};

main();
