const db = require("../models/index.js");
const { STATUS, MESSAGE, ERROR_MESSAGE } = require("../utils/contants.js");

const Tasks = db.tasks;

const addAirdropTask = async (req, res) => {
  try {
    const { task_id, task_code, reward_point } = req.body;

    if (!task_id || !task_code || !reward_point) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const filter = { task_id: task_id };

    let found = await Tasks.findOne(filter);
    if (!found) {
      await Tasks.create(req.body)
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
        message: "Id already exists",
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

const updateAirdropTask = async (req, res) => {
  try {
    const { task_id, task_code, reward_point } = req.body;

    if (!task_id || !reward_point) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const filter = { task_id: task_id };
    const update = { reward_point: reward_point };
    if (task_code) update.task_code = task_code;
    let found = await Tasks.findOne(filter);
    if (found) {
      await Tasks.findOneAndUpdate(filter, update)
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
        message: "Id not exists",
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

const updateAirdropTaskByCode = async (req, res) => {
    try {
      const { task_code, reward_point } = req.body;
  
      if (!task_code || !reward_point) {
        return res.status(400).json({
          status: STATUS.FAILED,
          message: "Missing required fields",
        });
      }
  
      const filter = { task_code: task_code };
      const update = { reward_point: reward_point };
      let found = await Tasks.findOne(filter);
      if (found) {
        await Tasks.findOneAndUpdate(filter, update)
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
          message: "Code not exists",
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

const getAllAirdropTask = async (req, res) => {
  try {
    let { limit, offset, sort } = req.body;
    if (!limit) limit = 15;
    if (!offset) offset = 0;
    if (!sort) sort = -1;

    const data = await Tasks.find({})
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: Number(sort) });

    return res.status(200).json({
      status: STATUS.OK,
      message: MESSAGE.SUCCESS,
      ret: {
        data: data,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getAirdropTaskById = async (req, res) => {
  try {
    let { task_id } = req.body;
    if (!task_id) {
      return res.status(400).json({
        status: STATUS.FAILED,
        message: "Missing required fields",
      });
    }

    const data = await Tasks.findOne({
        task_id: task_id,
    });

    return res.status(200).json({
      status: STATUS.OK,
      message: MESSAGE.SUCCESS,
      ret: {
        data: data,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: STATUS.FAILED,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getAirdropTaskByCode = async (req, res) => {
    try {
      let { task_code } = req.body;
      if (!task_code) {
        return res.status(400).json({
          status: STATUS.FAILED,
          message: "Missing required fields",
        });
      }
  
      const data = await Tasks.findOne({
        task_code: task_code,
      });
  
      return res.status(200).json({
        status: STATUS.OK,
        message: MESSAGE.SUCCESS,
        ret: {
          data: data,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: STATUS.FAILED,
        message: "Internal Server Error",
        error: e.message,
      });
    }
  };

module.exports = {
  addAirdropTask,
  updateAirdropTask,
  getAirdropTaskById,
  getAllAirdropTask,
  getAirdropTaskByCode,
  updateAirdropTaskByCode
};
