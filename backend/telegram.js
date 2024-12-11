require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TelegramStrategy = require("passport-telegram").Strategy;
const mongoose = require("mongoose");
const db = require("./src/models");
const Users = db.users;
const Tasks = db.tasks;
const RewardHistory = db.rewardHistory;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the Twitter strategy within Passport
passport.use(
  new TelegramStrategy(
    {
      clientID: process.env.TELEGRAM_CLIENT_ID,
      clientSecret: process.env.TELEGRAM_CLIENT_SECRET,
      callbackURL: `${process.env.API_TELEGRAM_BASE_URL}/auth/telegram/callback`,
      scope: ["identify", "email", "guilds", "guilds.join"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      // Save the user profile or any other relevant information
      console.log({ profile });
      return cb(null, profile);
    }
  )
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", async (req, res) => {
  res.send('<a href="/auth/telegram">Link with telegram</a>');
});

app.get(
  "/auth/telegram",
  (req, res, next) => {
    const { wallet, task_id } = req.query;
    req.session.wallet = wallet;
    req.session.task_id = task_id;
    next();
  },
  passport.authenticate("telegram")
);

app.get(
  "/auth/telegram/callback",
  passport.authenticate("telegram", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${process.env.REDIRECT_URL}/airdrop`);
  }
);

app.get("/profile", (req, res) => {
  const username = req?.user?.username || null;
  if (!req.isAuthenticated()) {
    return res.redirect(`${process.env.REDIRECT_URL}`);
  }
  // Display user profile information
  res.send({
    status: "OK",
    message: "SUCCESS",
    ret: {
      username: username,
    },
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Connect database
const connectDb = () => {
  return mongoose.connect(`${process.env.MONGODB_URL}`);
};

const PORT = process.env.PORT_TELEGRAM || 3002;
connectDb().then(async () => {
  app.listen(PORT, () => {
    console.log(`BachiSwap app listening on port ${PORT}`);
  });
});
