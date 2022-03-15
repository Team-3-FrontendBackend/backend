const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

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
