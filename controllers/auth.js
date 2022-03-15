const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.status(200).json({ message: 'login success' });
};

exports.getSignup = (req, res, next) => {
  res.status(200).json({ message: 'signup success' });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this name could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          username: loadedUser.username,
          userId: loadedUser._id.toString(),
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSignup = (req, res, next) => {
  console.log(req.body.username);
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const url = req.body.url;
  const siteName = req.body.siteName;

  if (password !== confirmPassword) {
    return res.status(403).json({ message: 'passwords do not match' });
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
      res.status(201).json({ message: 'User created successfully' });
    });
};
