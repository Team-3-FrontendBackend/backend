const User = require("../models/user");
const Page = require("../models/page");
const GlobalData = require("../models/globalData");
const user = require("../models/user");

exports.getHomePage = (req, res, next) => {
  const siteName = req.params.siteName;

  User.findOne({ siteName: siteName }).then((user) => {
    GlobalData.findOne({ userId: user._id }).then((data) => {
      
      // retrieve data from header
      const headerLogoUrl = data.header.logoUrl;
      const headerBackgroundColor = data.header.backgroundColor;

      // retrieve data from nav
      const navLinks = data.nav.links;

      // retrieve data from footer
      const footerContact = data.footer.contact;
      const footerSocials = data.footer.socialLinks;

      Page.findOne({ url: siteName, userId: user._id }).then((page) => {
        // error handling when no page is found
        if (!page) {
          const error = new Error("No page found");
          error.statusCode = 404;
          throw error;
        }

        // retrieve content in home page
        const content = page.contentTemplates;

        // retrieve the name of the page
        const name = page.name;

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
      });
    });
  });
  
};



exports.getSubPage = (req, res, next) => {
  const siteName = req.params.siteName;
  const pageUrl = req.params.pageUrl;

  // TODO: retrieve page of a user
  User.findOne({ siteName: siteName }).then((user) => {
    GlobalData.findOne({ userId: user._id}).then((data) => {
      Page.findOne({ url: pageUrl, userId: data.userId }).then((page) => {

        // retrieve data from page
        const pageUrl = page.url;
        const contentTemplates = page.contentTemplates;
        const pageName = page.name;
        const userId = page.userId;

        //return data as json
        res.status(200).json({
          pageUrl: pageUrl,
          contentTemplates: contentTemplates,
          pageName: pageName,
          userId: userId
        })
      })
      //catch error
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    })
  });
};


