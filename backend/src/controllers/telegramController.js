require("dotenv").config();
const db = require("../models/index.js");
const { telebot } = require("../services/telegramBotService.js");
const { STATUS, MESSAGE, ERROR_MESSAGE } = require("../utils/contants.js");
const crypto = require("crypto");

const Users = db.users;
const Tasks = db.tasks;
const RewardHistory = db.rewardHistory;
const group_chat_id = process.env.GROUP_CHAT_ID;

const verifJoinGroup = async (req, res) => {
  try {
    const { wallet_address } = req.body;

    if (!wallet_address) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const user = await Users.findOne({ wallet_address: wallet_address });
    if (!user?.telegram_id) {
      res.send({
        status: STATUS.OK,
        message: "Invalid telegram id",
        ret: {
          data: null,
        },
      });
    }
    const chatMember = await telebot
      .getChatMember(group_chat_id, user?.telegram_id)
      .catch(() => {
        res.send({
          status: STATUS.OK,
          message: "Member not join",
          ret: {
            data: null,
          },
        });
      });
    if (chatMember && !chatMember?.is_bot) {
      res.send({
        status: STATUS.OK,
        message: MESSAGE.SUCCESS,
        ret: {
          data: chatMember,
        },
      });
    } else {
      res.send({
        status: STATUS.OK,
        message: "Member is bot",
        ret: {
          data: null,
        },
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

function verifyTelegramAuth(data) {
  const secret = crypto
    .createHash("sha256")
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const hash = data.hash;
  delete data.hash;

  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

const verifyTelegramAuthMiddleware = async (req, res, next) => {
  try {
    const {
      id,
      first_name,
      last_name,
      username,
      auth_date,
      hash,
      wallet,
      task_id,
    } = req.query;

    const isValid = verifyTelegramAuth({
      id,
      first_name,
      last_name,
      username,
      auth_date,
      hash,
    });

    if (!isValid) {
      return res.status(401).send("Unauthorized: Invalid hash");
    }

    if (wallet && task_id) {
      const task = await Tasks.findOne({ task_id: task_id });
      if (task) {
        const existingUser = await Users.findOne({ wallet_address: wallet });

        if (!existingUser) {
          await Users.create({
            wallet_address: wallet,
            telegram_id: id,
            point: task.reward_point,
          });
        } else {
          if (!existingUser.telegram_id) {
            const point =
              Number(existingUser.point) + Number(task.reward_point);
            await Users.findOneAndUpdate(
              { wallet_address: wallet },
              { telegram_id: id, point: point }
            );
          }
        }

        const history = await RewardHistory.findOne({
          wallet_address: wallet,
          task_id: task_id,
        });

        if (!history) {
          await RewardHistory.create({
            wallet_address: wallet,
            task_id: task_id,
            point: task.reward_point,
          });
        }
      }
    }

    next();
  } catch (e) {
    return res.status(500).json({
      status: "FAILED",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const callback = async (req, res) => {
  res.redirect(`${process.env.REDIRECT_URL}/airdrop`);
};

module.exports = {
  verifJoinGroup,
  callback,
  verifyTelegramAuthMiddleware,
};
