const express = require("express");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");
require("./crons/Transaction_cronjob");
require("./crons/admin_cronjob");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route
routes(app);

app.get("/", async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

//Connect database
const connectDb = () => {
  return mongoose.connect(`${process.env.MONGODB_URL}`);
};

const PORT = process.env.PORT || 3001;
connectDb().then(async () => {
  app.listen(PORT, () => {
    console.log(`BachiSwap app listening on port ${PORT}`);
  });
});
