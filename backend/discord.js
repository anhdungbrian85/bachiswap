require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
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
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.API_DISCORD_BASE_URL}/auth/discord/callback`,
      scope: ["identify", "email", "guilds", "guilds.join"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      // Save the user profile or any other relevant information
      const { wallet, task_id } = req.session;
      if ((wallet, task_id)) {
        const task = await Tasks.findOne({ task_id: task_id });
        if (task) {
          const existingUser = await Users.findOne({
            wallet_address: wallet,
          });
          if (!existingUser) {
            await Users.create({
              wallet_address: wallet,
              discord_username: profile.username,
              point: task.reward_point,
            });
          } else {
            if (!existingUser.discord_username) {
              let point =
                Number(existingUser.point) + Number(task.reward_point);
              await Users.findOneAndUpdate(
                {
                  wallet_address: wallet,
                },
                {
                  discord_username: profile.username,
                  point: point,
                }
              );
            }
          }
          const history = await RewardHistory.findOne({
            wallet_address: wallet,
            task_id: task_id,
          });
          if (!history) {
            const newHistory = await RewardHistory.create({
              wallet_address: wallet,
              task_id: task_id,
              point: task.reward_point,
            });
          }
        }
      }
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
  res.send('<a href="/auth/discord">Link with Discord</a>');
});

app.get(
  "/auth/discord",
  (req, res, next) => {
    const { wallet, task_id } = req.query;
    req.session.wallet = wallet;
    req.session.task_id = task_id;
    next();
  },
  passport.authenticate("discord")
);

app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
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

const PORT = process.env.PORT_DISCORD || 3002;
connectDb().then(async () => {
  app.listen(PORT, () => {
    console.log(`BachiSwap app listening on port ${PORT}`);
  });
});
