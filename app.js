// import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 3000;
const mongoDbUrl = process.env.MONGODB_URL;

const User = require('./models/user');

const app = express();

const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');
// const liveRoutes = require('./routes/live');

app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(authRoutes);
// app.use(adminRoutes);
// app.use(liveRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(authRoutes);

mongoose
  .connect(mongoDbUrl)
  .then((result) => {
    app.listen(port);
    console.log(`Listening on ${port}`);
  })
  .catch((err) => console.log(err));
