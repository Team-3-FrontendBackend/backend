// import necessary libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
require("dotenv").config();

const port = 3000;
const mongoDbUrl = process.env.MONGODB_URL;

const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: mongoDbUrl,
  collection: "sessions",
});
const csrfProtection = csrf();

const authRoutes = require("./routes/auth");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(authRoutes);

mongoose
  .connect(mongoDbUrl)
  .then((result) => {
    app.listen(port);
    console.log(`Listening on ${port}`);
  })
  .catch((err) => console.log(err));
