const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const GlobalData = require('../models/globalData');

//nav bar

exports.getData = (req, res, next) => {
  console.log('data');
  res.status(200).json({ message: 'Data' });
};

exports.postGlobalData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const headerLogoUrl = req.body.header.logoUrl;
  const headerBackgroundColor = req.body.header.backgroundColor;
  const navLinks = req.body.nav.links;
  const footerContact = req.body.footer.contact;
  const footerFacebookLink = req.body.footer.socialLinks.facebook;
  const footerIbelongLink = req.body.footer.socialLinks.iBelong;
  const footerInstagramLink = req.body.footer.socialLinks.instagram;

  let userId;

  const globalData = new GlobalData({
    header: { logoUrl: headerLogoUrl, backgroundColor: headerBackgroundColor },
    nav: { links: navLinks },
    footer: {
      contact: footerContact,
      socialLinks: {
        facebook: footerFacebookLink,
        iBelong: footerIbelongLink,
        instagaram: footerInstagramLink,
      },
    },
    userId: req.userId,
  });
  globalData
    .save()
    .then((result) => {
      return GlobalData.findById(req.userId);
    })
    .then((user) => {
      userId = user;
      user.posts.push(globalData);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
