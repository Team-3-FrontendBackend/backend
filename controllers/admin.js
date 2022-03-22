const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const GlobalData = require('../models/globalData');

// globalData
exports.getGlobalData = (req, res, next) => {
  const errors = validationResult(req);

  GlobalData.findOne({ userId: req.userId })
    .then((data) => {
      // output data
      if (!data) {
        const error = new Error('No data found');
        error.statusCode = 404;
        throw error;
      }

      // retrieve data from header
      const headerLogoUrl = data.header.logoUrl;
      const headerBackgroundColor = data.header.backgroundColor;

      // retrieve data from nav
      const navLinks = data.nav.links;

      // retrieve data from footer
      const footerContact = data.footer.contact;
      const footerSocials = data.footer.socialLinks;

      // return data as a json
      res.status(200).json({
        headerLogoUrl: headerLogoUrl,
        headerBackgroundColor: headerBackgroundColor,
        navLinks: navLinks,
        footerContact: footerContact,
        footerSocials: footerSocials,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putGlobalData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  console.log('made it here', req.body);
  return;

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
      return GlobalData.findOne({ userId: req.userId });
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
