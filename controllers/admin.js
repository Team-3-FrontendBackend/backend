const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const GlobalData = require('../models/globalData');
const Page = require('../models/page');
const User = require('../models/user');

/* Admin page route */

exports.getAdmin = (req, res, next) => {
  // get a list of all the sites
  GlobalData.findOne({ userId: req.userId })
    .then((data) => {
      if (!data) {
        const error = new Error('No data found');
        error.statusCode = 404;
        throw error;
      }

      const url = 'https://cms-societies.herokuapp.com/admin/';

      const urls = [];
      data.nav.links.forEach((link) => {
        urls.push(url + link);
      });
      console.log(urls);
      // if data is found
      res.status(200).json({ links: urls });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/* Global Data */

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

/* Home Page */

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
      // get the global data and update the links
      return GlobalData.findOne({ userId: req.userId });
      // send a response
    })
    .then((data) => {
      // make sure we found data
      if (!data) {
        const error = new Error('No globalData associated with user');
        error.statusCode = 404;
        throw error;
      }
      // update the nav links and save the data object
      const newLinks = [...data.nav.links, url];
      data.nav.links = newLinks;
      return data.save();
    })
    .then((result) => {
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

exports.updateSubPage = (req, res, next) => {
  const updatedContent = req.body.contentTemplates;
  const siteName = req.params.siteName;
  const pageName = req.params.pageName;

  const url = '/'.concat(siteName);

  // find the home page
  User.findOne({ url: url })
    .then((user) => {
      return Page.findOne({ url: pageName, userId: user._id });
    })
    .then((page) => {
      // error when page is not found
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }
      // update the content of the home page
      page.contentTemplates = updatedContent;
      return page.save();
    })
    .then((result) => {
      result
        .status(204)
        .json({
          message: 'Page updated successfully!',
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    });
};

exports.updateHome = (req, res, next) => {
  // content being received
  const url = req.params.siteName;
  const contentTemplates = req.body.contentTemplates;
  const name = req.body.name;

  // find the home page
  Page.findOne({ url: url, userId: req.userId })
    .then((page) => {
      // check to make sure we got a page
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }
      // if we found a page update the content
      page.contentTemplates = contentTemplates;
      page.name = name;

      // save the page object
      return page.save();
    })
    .then((result) => {
      res.status(204).json({ message: 'Page updated successfully' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

/* Sub Pages */

exports.createPage = (req, res, next) => {
  // get important data
  const siteUrl = req.params.siteName;
  const pageUrl = siteUrl + '/' + req.params.pageName;
  const name = req.body.name;
  const contentTemplates = req.body.contentTemplates;

  Page.findOne({ url: pageUrl, userId: req.userId })
    .then((page) => {
      // if the page already exists, respond with error.
      if (page) {
        const error = new Error('Page already exists');
        error.statusCode = 405;
        throw error;
      }
      // page doesn't exist

      // create a Page object
      const subPage = new Page({
        url: pageUrl,
        contentTemplates: contentTemplates,
        name: name,
        userId: mongoose.Types.ObjectId(req.userId),
      });

      // save the page object
      return subPage.save();
    })
    .then((result) => {
      // find the global data
      return GlobalData.findOne({ userId: req.userId });
    })
    .then((data) => {
      // make sure we found data
      if (!data) {
        const error = new Error('No globalData associated with user');
        error.statusCode = 404;
        throw error;
      }
      // update the nav links and save the data object
      const newLinks = [...data.nav.links, pageUrl];
      data.nav.links = newLinks;
      return data.save();
    })
    .then((result) => {
      // send a response
      res.status(201).json({ message: 'Page created successfully' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPage = (req, res, next) => {
  // get necessary data
  const siteUrl = req.params.siteName;
  const pageUrl = siteUrl + '/' + req.params.pageName;

  Page.findOne({ url: pageUrl, userId: req.userId })
    .then((page) => {
      // if no page is found
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }
      // if a page is found
      res.status(200).json({ message: 'page found', page: page });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
