const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

/* home page */
// router.get('/edit/:siteName', adminController.getHomePage);

// router.post('/edit/:siteName', adminController.addHomePage);

// router.put('/edit/:siteName', adminController.updateHomePage);

// router.delete('/edit/:siteName', adminController.deleteHomePage);

/* pages */
// router.get('/edit/:siteName/:pageName', adminController.getPage);

// router.post('/edit/:siteName/:pageName', adminController.addPage);

// router.put('/edit/:siteName/:pageName', adminController.updatePage);

// router.delete('/edit/:siteName/:pageName', adminController.deletePage);

/* header */
// router.get('/header', adminController.getHeader);

// router.post('/header', adminController.addHeader);

// router.put('/header', adminController.updateHeader);

// router.delete('/header', adminController.deleteHeader);

/* nav */
// router.get('/nav', adminController.getNav);

// router.post('/nav', adminController.addNav);

// router.put('/nav', adminController.updateNav);

// router.delete('/nav', adminController.deleteNav);

/* footer */
// router.get('/footer', adminController.getFooter);

// router.post('/footer', adminController.addFooter);

// router.put('/footer', adminController.updateFooter);

// router.delete('/footer', adminController.deleteFooter);

module.exports = router;
