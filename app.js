// import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

const authRoutes = require('./routes/auth');

const mongoDbUrl = process.env.MONGODB_URL;

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
