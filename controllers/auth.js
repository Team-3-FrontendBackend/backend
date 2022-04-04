const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');
const GlobalData = require('../models/globalData');

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this name could not be found.');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 403;
        throw error;
      }
      const token = jwt.sign(
        {
          username: loadedUser.username,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(201).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      // check for errors
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSignup = (req, res, next) => {
  // sign up controller
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  let url = req.body.url;
  const siteName = req.body.siteName;

  // make sure there is always a "/" in front of the url
  if (url.charAt(0) !== '/') {
    url = '/' + req.body.url;
  }

  // make sure the user doesn't already exist
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        const error = new Error('Username already in use');
        error.statusCode = 422;
        throw error;
      }
      // we are good to continue

      // make sure passwords match
      if (password !== confirmPassword) {
        const error = new Error('Passwords do not match!');
        error.statusCode = 401;
        throw error;
      }
      // we are good to continue

      // encrypt password
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      // create user object
      const newUser = new User({
        username: username,
        password: hashedPassword,
        url: url,
        siteName: siteName,
      });
      // save the user
      return newUser.save();
    })
    .then((result) => {
      // get the user so we can create header, nav, and footer info
      return User.findOne({ username: username });
    })
    .then((user) => {
      // some issue finding the user ...
      if (!user) {
        const error = new Error('Network error');
        error.statusCode = 500;
        throw error;
      }
      // create GlobalData object
      const globalData = new GlobalData({
        userId: user._id,
        header: {
          logoUrl: '',
          backgroundColor: '',
        },
        nav: {
          links: [''],
        },
        footer: {
          contact: '',
          socialLinks: {
            facebook: '',
            iBelong: '',
            instagram: '',
          },
        },
      });
      // save GlobalData object
      return globalData.save();
    })
    .then((result) => {
      // successfully create a new user and associated data
      res.status(201).json({ message: 'User created successfully' });
    })
    .catch((err) => {
      // check for errors
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
