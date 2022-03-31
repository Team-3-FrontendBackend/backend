const User = require('../models/user');
const Page = require('../models/page');
const GlobalData = require('../models/globalData');
const user = require('../models/user');

exports.getHomePage = (req, res, next) => {
  const siteName = req.params.siteName;
  const url = '/'.concat(siteName);

  let headerLogoUrl;
  let headerBackgroundColor;
  let navLinks;
  let footerContact;
  let footerSocials;
  let content;
  let name;

  User.findOne({ url: url })
    .then((user) => {
      return GlobalData.findOne({ userId: user._id });
    })
    .then((globalData) => {
      // retrieve globalData from header
      headerLogoUrl = globalData.header.logoUrl;
      headerBackgroundColor = globalData.header.backgroundColor;

      // retrieve globalData from nav
      navLinks = globalData.nav.links;

      // retrieve globalData from footer
      footerContact = globalData.footer.contact;
      footerSocials = globalData.footer.socialLinks;

      return Page.findOne({ url: siteName });
    })
    .then((page) => {
      // error handling when no page is found
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }

      // retrieve content in home page
      content = page.contentTemplates;

      // retrieve the name of the page
      name = page.name;

      // return data as a json
      res.status(200).json({
        headerLogoUrl: headerLogoUrl,
        headerBackgroundColor: headerBackgroundColor,
        navLinks: navLinks,
        footerContact: footerContact,
        footerSocials: footerSocials,
        content: content,
        name: name,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSubPage = (req, res, next) => {
  const siteName = req.params.siteName;
  const pageUrl = siteName + '/' + req.params.pageUrl;

  const url = '/'.concat(siteName);

  let headerLogoUrl;
  let headerBackgroundColor;
  let navLinks;
  let footerContact;
  let footerSocials;

  // TODO: retrieve page of a user
  User.findOne({ url: url })
    .then((user) => {
      if (!user) {
        const error = new Error('No user found');
        error.statusCode = 404;
        throw error;
      }
      return GlobalData.findOne({ userId: user._id });
    })
    .then((data) => {
      // retrieve globalData from header
      headerLogoUrl = data.header.logoUrl;
      headerBackgroundColor = data.header.backgroundColor;

      // retrieve globalData from nav
      navLinks = data.nav.links;

      // retrieve globalData from footer
      footerContact = data.footer.contact;
      footerSocials = data.footer.socialLinks;

      return Page.findOne({ userId: data.userId });
    })
    .then((page) => {
      if (!page) {
        const error = new Error('No page found');
        error.statusCode = 404;
        throw error;
      }
      // retrieve data from page
      const url = page.url;
      const contentTemplates = page.contentTemplates;
      const pageName = page.name;
      const userId = page.userId;

      //return data as json
      res.status(200).json({
        headerLogoUrl: headerLogoUrl,
        headerBackgroundColor: headerBackgroundColor,
        navLinks: navLinks,
        footerContact: footerContact,
        footerSocials: footerSocials,
        pageURL: url,
        contentTemplates: contentTemplates,
        pageName: pageName,
        userId: userId,
      });
    })
    //catch error
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
