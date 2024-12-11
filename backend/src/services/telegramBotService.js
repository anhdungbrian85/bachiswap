require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: false });

// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   console.log("Group chat ID: ", chatId);
// });

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Chào mừng bạn đến với bot của chúng tôi!");
// });


module.exports = { telebot: bot };
