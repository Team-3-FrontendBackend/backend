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
  const url = req.body.url;
  const siteName = req.body.siteName;

  if (password !== confirmPassword) {
    const error = new Error('Passwords do not match!');
    error.statusCode = 401;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        username: username,
        password: hashedPassword,
        url: url,
        siteName: siteName,
      });
      return newUser.save();
    })
    .then((result) => {
      return User.findOne({ username: username });
    })
    .then((user) => {
      if (!user) {
        const error = new Error('Network error');
        error.statusCode = 500;
        throw error;
      }
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
      return globalData.save();
    })
    .then((result) => {
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
