const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require("body-parser");
const router = require("./src/routers/index");

require("dotenv").config();
require("./src/db/index");

const app = express();
const port = process.env.PORT;

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'BachiSwapTelegramApp', 
    cookie: { maxAge: 60000 }}));

app.use(bodyParser.json());
app.use(cors());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
