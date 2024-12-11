require("dotenv").config();
const {
  verifyTelegramWebAppData,
  parseTelegramInitData,
  isAdmin,
} = require("../utils");
const Task = require("../models/Task");
const User = require("../models/User");
const TaskHistory = require("../models/TaskHistory");
const { MESSAGE, TASK_GROUPS, STATUS } = require("../utils/contants");
const TaskServices = require("../services/TaskServices");

const TaskController = {
  create: async (req, res) => {
    try {
      const { userToken } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
      }
      let userData = null;
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
      }
      userData = await User.findOne({ id: userId });

      if (!userData) {
        return res.status(401).json({
          message: "Not valid user",
          success: false,
        });
      }
      if (!isAdmin(userId)) {
        return res.status(401).json({
          message: "No permission",
          success: false,
        });
      }
      const { code, name, point, target, validTo } = req.body;

      if (!code || !name || !point || !target || !validTo) {
        return res.status(400).json({
          status: STATUS.FAILED,
          message: "Missing required fields",
        });
      }
      console.log("NEW TASK: ", { code, name, point, target, validTo });
      const filter = { code: code };
      let found = await Task.findOne(filter);
      if (!found) {
        await Task.create({
          code: code,
          name: name,
          point: point,
          target,
          valid_to: validTo ? new Date(validTo) : null,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                status: STATUS.FAILED,
                message: ERROR_MESSAGE.CAN_NOT_ADD,
              });
            } else {
              res.send({
                status: STATUS.OK,
                message: MESSAGE.SUCCESS,
                data: data,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .send({ status: STATUS.FAILED, message: error.message });
          });
      } else {
        return res.status(500).json({
          status: STATUS.FAILED,
          message: "code already exists",
        });
      }
    } catch (error) {
      console.log("Create Task ERROR", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
  getList: async (req, res) => {
    try {
      const { userToken } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
      }
      let taskData = await Task.find();
      return res.status(200).json({
        success: true,
        data: { items: taskData, length: taskData.length },
      });
    } catch (error) {
      console.log("Get List Error", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
  getListTaskByUser: async (req, res) => {
    try {
      const { userToken } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
      }

      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: MESSAGE.INVALID_USER_ID });
      }
      const taskList = await TaskHistory.find({ user_id: userId });
      const taskData = taskList.map((task) => ({
        task_code: task.code,
        name: task.name,
        point: task.point,
        target: task.target,
        valid_to: task.valid_to,
        is_finished: task.is_finished || false,
      }));

      return res.status(200).json({
        success: true,
        data: { items: taskData, length: taskData.length },
      });
    } catch (error) {
      console.log("Get List Error", error);
      res.status(500).json({ message: "Error occurred", error: error.message });
    }
  },
  verify: async (req, res) => {
    const { userToken, code } = req.body;
    const isValidToken = await verifyTelegramWebAppData(userToken);
    if (!isValidToken) {
      return res.status(401).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
    }
    let userData = null;
    const dataQuery = parseTelegramInitData(userToken);

    const userId = parseInt(dataQuery?.user?.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: MESSAGE.INVALID_USER_ID });
    }
    userData = await User.findOne({ id: userId });
    if (!userData) {
      return res.status(401).json({
        message: MESSAGE.NOT_VALID_USER_VERIFY_TASK,
        success: false,
      });
    }
    const task = await Task.findOne({ code: code || "" });
    if (!task) {
      return res.status(403).json({
        message: MESSAGE.NO_TASK_DATA,
        success: false,
      });
    }

    if (
      [
        TASK_GROUPS.SOCIAL_MISSIONS.CONNECT_YOUR_DISCORD_ACCOUNT,
        TASK_GROUPS.SOCIAL_MISSIONS.CONNECT_YOUR_DISCORD_ACCOUNT_1,
        TASK_GROUPS.SOCIAL_MISSIONS.CONNECT_YOUR_DISCORD_ACCOUNT_2,
        TASK_GROUPS.SOCIAL_MISSIONS.CONNECT_YOUR_X_ACCOUNT,
      ].includes(code)
    ) {
      return TaskServices.verifyNoCheckTask(res, userData, task);
    } else if (
      [
        TASK_GROUPS.TON_MISSIONS.INVITE_YOUR_FIRST_FRIEND,
        TASK_GROUPS.SOCIAL_MISSIONS.INVITE_PARTNER_JOIN_US,
      ].includes(code)
    ) {
      return TaskServices.verifyNoCheckTask(res, userData, task);
    } else if (
      [TASK_GROUPS.SOCIAL_MISSIONS.CLAIM_YOUR_DAILY_REWARDS].includes(code)
    ) {
      return TaskServices.verifyNoCheckTask(res, userData, task);
    } else if (
      [
        TASK_GROUPS.TON_MISSIONS.RENT_YOUR_FIRST_MINER_BOOSTER,
        TASK_GROUPS.TON_MISSIONS.INITIAL_BONUS,
        TASK_GROUPS.NODE_MISSIONS.PURCHASE_YOUR_FIRST_BOOSTER,
        TASK_GROUPS.NODE_MISSIONS.FOLLOW_TAIKOXYZ_ON_X,
        TASK_GROUPS.NODE_MISSIONS.SAY_HELLO_TO_DISCORD_SERVER,
        TASK_GROUPS.NODE_MISSIONS.REACHED_ON_DISCORD_SERVER,
      ].includes(code)
    ) {
      return TaskServices.verifyNoCheckTask(res, userData, task);
    }
    console.log(userData, task);
    return res.status(200).json({
      success: true,
    });
  },
  checkTaskVerify: async (req, res) => {
    try {
      const { userToken, code } = req.body;
      const isValidToken = await verifyTelegramWebAppData(userToken);
      if (!isValidToken) {
        return res.status(401).json({ message: MESSAGE.NOT_A_VALID_TOKEN });
      }
      const dataQuery = parseTelegramInitData(userToken);
      const userId = parseInt(dataQuery?.user?.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: MESSAGE.INVALID_USER_ID });
      }
      const filter = { user_id: userId, code: code };
      let found = await TaskHistory.findOne(filter);
      if (found) {
        return res.status(200).json({
          success: true,
          isComplete: true,
          message: "Task đã hoàn thành",
          completedTask: found,
        });
      } else {
        return res.status(200).json({
          success: true,
          isComplete: false,
          message: "Task chưa hoàn thành",
        });
      }
    } catch (error) {
      console.log("Get List Error", error);
      res.status(401).json({ message: "Error occur", error: error.message });
    }
  },
};
module.exports = TaskController;
