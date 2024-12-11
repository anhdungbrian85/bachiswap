const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const WebSocket = require("ws");
const { BoostTnxSchema, MissedBoostTnxSchema } = require("../models/BoostTnx");
const { delay } = require("../utils");
const mingingConfig = require("../utils/miningConfig.json")

require("dotenv").config();

const TON_CENTER_BASE_URL = process.env.TON_CENTER_BASE_URL;
const TON_CENTER_API_KEY = process.env.TON_CENTER_API_KEY;
const TONAPI_IO_RPC_URL = process.env.TONAPI_IO_RPC_URL;
const TONAPI_IO_API_KEY = process.env.TONAPI_IO_API_KEY;

const boostReceiver = mingingConfig?.boosterReceiver;

const BATCH_SIZE = 3;
const BATCH_INTERVAL = 3000; // ms

const eventQueue = [];

const client = axios.create({
  baseURL: TON_CENTER_BASE_URL,
  headers: {
    accept: "application/json",
    "X-Api-Key": TON_CENTER_API_KEY,
  },
});

setInterval(() => {
  // log every 5 mins only
  if (Math.floor(Date.now() / 1000) % 300 === 0) {
    console.log(
      new Date(Date.now()),
      " setInterval Queue.length ",
      eventQueue.length
    );
  }

  if (eventQueue.length > 0) {
    handleBatch();
  } else {
    handleMissedTnx();
  }
}, BATCH_INTERVAL);

try {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB");
      connect();
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
} catch (error) {
  console.log("error boost tnx: ", error);
}

function sendRequest(ws) {
  console.log(
    "Send request to ws ... ",
    boostReceiver,
  );

  ws.send(
    JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "subscribe_trace",
      params: [boostReceiver],
    })
  );
}

const MAX_RETRIES = 3;

async function handleBatch() {
  console.log("handleBatch...");

  for (let i = 0; i < BATCH_SIZE; i++) {
    if (eventQueue.length === 0) break;

    const data = eventQueue.shift();
    const hash = extractHash(data);

    if (!hash) return;

    try {
      const response = await fetchTransaction(hash);
      await processTransaction(response, hash);
    } catch (error) {
      console.error("Error processing transaction:", error);
      await saveMissedTransaction(hash);
    }
  }
}

function extractHash(data) {
  const hashFound = data.slice(-76, -4);
  return hashFound.toString("utf8").includes('"hash"')
    ? hashFound.slice(-64)
    : null;
}

async function fetchTransaction(hash) {
  const params = { hash: hash };
  let response = await client.get("/transactions", { params });
  let tryTime = 1;

  while (
    response.status === 200 &&
    response.data.transactions.length === 0 &&
    tryTime < MAX_RETRIES
  ) {
    await delay(2000);
    response = await client.get("/transactions", { params });
    tryTime++;
  }

  if (tryTime >= MAX_RETRIES) {
    console.log("Transaction not found after maximum retries");
    throw new Error("Transaction not found after maximum retries");
  }

  return response;
}

async function processTransaction(response, hash) {
  const { transactions, address_book } = response.data;
  if (transactions.length > 0 && transactions[0].out_msgs[0]) {
    const {
      source,
      destination,
      value,
      created_at,
      message_content: { decoded },
    } = transactions[0].out_msgs[0];
    console.log({decoded})
    const data = {
      hash,
      source,
      destination,
      source_user_friendly: address_book[source]?.user_friendly,
      destination_user_friendly: address_book[destination]?.user_friendly,
      value,
      created_at,
      comment: decoded?.comment,
    };
    const transaction = new BoostTnxSchema(data);
    await transaction.save();
    console.log("Transaction saved successfully", transaction);
  }
}

async function saveMissedTransaction(hash) {
  const transaction = new MissedBoostTnxSchema({ hash });
  await transaction.save();
  console.log("Missed transaction saved", transaction);
}

function startPing(ws) {
  let countDownReconnect = 1;

  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      if (countDownReconnect > 60) {
        console.log("= Attempting to refresh WebSocket...");
        ws.close();
      }

      ws.ping();

      console.log("= ping ws.readyState " + ws.readyState);
      console.log("= countDownReconnect " + countDownReconnect);

      countDownReconnect++;
    }
  }, 60000);
}

async function reconnect() {
  console.log("=Attempting to reconnect to WebSocket...");
  setTimeout(connect, 5000);
}

async function connect() {
  console.log("Initialize wsListener ...");

  let wsListener = new WebSocket(
    `${TONAPI_IO_RPC_URL}?token=${TONAPI_IO_API_KEY}`
  );

  wsListener.on("open", function open() {
    console.log("wsListener is open...");
    sendRequest(wsListener);
    startPing(wsListener);
  });

  wsListener.on("message", async (data) => {
    console.log("Get new message from ws...");

    eventQueue.push(data);
    console.log("eventQueue length", eventQueue.length);

    if (eventQueue.length >= BATCH_SIZE) {
      await handleBatch();
    }
  });

  wsListener.on("close", function close() {
    console.log("WebSocket is closed");
    reconnect();
  });

  wsListener.on("error", function error(err) {
    console.log("error boost tnx: ");
    console.log(err);
    reconnect();
  });

  // wsListener.on("ping", function ping(data) {
  //   console.log("ping");
  //   console.log(data.toString());
  // });

  wsListener.on("pong", function ping(data) {
    console.log("pong");
    console.log(data.toString());
  });
}

async function handleMissedTnx() {
  console.log("handleMissedTnx...");

  const firstMissedTx = await MissedBoostTnxSchema.findOne({
    tryTime: { $eq: 0 },
  });
  console.log({ firstMissedTx });

  if (!firstMissedTx) {
    return;
  }

  const foundItem = await BoostTnxSchema.findOne({ hash: firstMissedTx?.hash });
  console.log({ foundItem });

  if (foundItem) {
    try {
      const deletedDoc = await MissedBoostTnxSchema.deleteOne({
        hash: firstMissedTx?.hash,
      });

      console.log("Document is deleted! ", deletedDoc);
    } catch (error) {
      console.log("Error when deleted Missed Document!");
      console.log(error.message);
    }
    return;
  }

  const result = await getTnxInfo(firstMissedTx);

  if (!!result) {
    try {
      const deletedDoc = await MissedBoostTnxSchema.deleteOne({
        hash: firstMissedTx?.hash,
      });

      console.log("Document is deleted! ", deletedDoc);
    } catch (error) {
      console.log("Error when deleted Missed Document!");
      console.log(error.message);
    }
    return;
  }
}

async function getTnxInfo(missedTx) {
  let result = false;
  try {
    const params = { hash: missedTx.hash };
    console.log("params");
    console.log(params);

    let response = await client.get("/transactions", { params });

    console.log("response?.data");
    console.log(response?.data);

    let tryTime = 1;

    while (
      response?.status === 200 &&
      response?.data?.transactions?.length === 0
    ) {
      if (tryTime > 3) {
        console.log("TON_CENTER Error...");

        const currTryTime = missedTx.tryTime || 0;

        missedTx.tryTime = currTryTime + 1;

        const missedTnxSaved = await missedTx.save();

        console.log("TON_CENTER_BASE_URL missedTx saved ", missedTnxSaved);

        break;
      }

      await delay(2000);

      response = await client.get("/transactions", { params });
      tryTime++;

      console.log(tryTime + " response data: ");
      console.log(response?.data);
    }

    const {
      status,
      data: { transactions, address_book },
    } = response;

    if (status === 200 && !!transactions?.[0]?.out_msgs?.[0]) {
      try {
        const {
          source,
          destination,
          value,
          created_at,
          message_content: { decoded },
        } = transactions?.[0]?.out_msgs?.[0];

        console.log("decoded", decoded);
        console.log(
          "message_content",
          transactions?.[0]?.out_msgs?.[0]?.message_content
        );

        const data = {
          hash: missedTx.hash,
          source,
          destination,
          source_user_friendly: address_book?.[source]?.user_friendly,
          destination_user_friendly: address_book?.[destination]?.user_friendly,
          value,
          created_at,
          comment: decoded?.comment,
        };

        const transaction = new BoostTnxSchema(data);
        const savedTnx = await transaction.save();

        console.log("Transaction saved successfully ", savedTnx);
        result = true;
      } catch (error) {
        console.error("Error writing to MongoDB:", error?.message ?? error);

        const currTryTime = missedTx.tryTime || 0;

        missedTx.tryTime = currTryTime + 1;

        const missedTnxSaved = await missedTx.save();

        console.log(
          "Error writing to MongoDB missedTx updated ",
          missedTnxSaved
        );
      }
    }
    return result;
  } catch (error) {
    console.error("hash Error :", error?.message ?? error);

    const transaction = new MissedBoostTnxSchema({ hash: hash });
    const missedTnx = await transaction.save();
    console.log("hash Tnx saved ", missedTnx);

    return result;
  }
}
