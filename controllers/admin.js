const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const GlobalData = require('../models/globalData');
const Page = require('../models/page');

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
  // get the body information
  const header = {
    logoUrl: req.body.header.logoUrl,
    backgroundColor: req.body.header.backgroundColor,
  };
  const footer = {
    contact: req.body.footer.contact,
    socialLinks: req.body.footer.socialLinks,
  };
  const nav = req.body.nav;

  // find and update the object
  GlobalData.findOne({ userId: req.userId })
    .then((data) => {
      if (!data) {
        const error = new Error('No data found');
        error.statusCode = 404;
        throw error;
      }
      data.header = header;
      data.nav = nav;
      data.footer = footer;
      return data.save();
    })
    .then((result) => {
      res.status(204).json({
        message: 'Global Data updated successfully!',
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createHome = (req, res, next) => {
  // get important data
  const url = req.params.siteName;
  const name = req.body.name;

  Page.findOne({ url: url, userId: req.userId })
    .then((page) => {
      // if the home page already exists, respond with error.
      if (page) {
        const error = new Error('Home page already exists');
        error.statusCode = 405;
        throw error;
      }
      // home page doesn't exist

      // create a Page object
      const homePage = new Page({
        url: url,
        contentTemplates: [],
        name: name,
        userId: mongoose.Types.ObjectId(req.userId),
      });
      // save the page object
      return homePage.save();
    })
    .then((result) => {
      // send a response
      res.status(201).json({ message: 'Home page created successfully' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getHome = (req, res, next) => {
  // get necessary data
  const url = req.params.siteName;

  Page.findOne({ url: url, userId: req.userId })
    .then((page) => {
      // if no page is found
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }
      // if a home page is found
      res.status(200).json({ message: 'Home page found', page: page });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
