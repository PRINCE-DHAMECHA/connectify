require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const axios = require("axios");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const { setupLogging } = require("./utils/logging");
const { userRoutes } = require("./proxies/usersRoutes");
const { connectionRoutes } = require("./proxies/connectionRoutes");
const { setupProxies } = require("./proxies/proxy");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();
const logStream = fs.createWriteStream("server.log", { flags: "a" });

setupLogging(app);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100,
  })
);
app.use(compression());
app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  logStream.write(logMessage);
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "cbebcubsjhcbehbvhbfhbcsbcjebcbyuvbdhfjshf",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const displayName = profile.displayName;
        const email = profile.emails[0].value;
        const image = profile.photos[0].value;
        const response = await axios.post("http://localhost:5001/user/signIn", {
          profile: { googleId, displayName, email, image },
        });
        if (response.status === 200 || response.status === 201) {
          return done(null, response.data.resUser);
        } else {
          return done(response.msg, null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/login",
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173/login");
  });
});
setupProxies(app, userRoutes, "http://localhost:5001/");
setupProxies(app, connectionRoutes, "http://localhost:5002/");
const PORT = process.env.PORT;
try {
  app.listen(PORT, () => {
    console.log(`Gateway up and running on port no ${PORT}`);
  });
} catch (error) {
  console.log(error);
}
