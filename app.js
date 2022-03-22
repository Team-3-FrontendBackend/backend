// import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoDbUrl = process.env.MONGODB_URL;

const User = require('./models/user');

const app = express();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const isAuth = require('./middleware/is-auth');
// const liveRoutes = require('./routes/live');

app.use(bodyParser.json()); // application/json
// app.use(bodyParser.urlencoded({ extended: false }));

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
app.use('/admin', adminRoutes);
// app.use(liveRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose
  .connect(mongoDbUrl)
  .then((result) => {
    app.listen(port);
    console.log(`Listening on ${port}`);
  })
  .catch((err) => console.log(err));
