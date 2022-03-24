const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/global-data', isAuth, adminController.getGlobalData);

router.put('/global-data', isAuth, adminController.putGlobalData);

router.post('/:siteName', isAuth, adminController.createHome);

router.get('/:siteName', isAuth, adminController.getHome);

router.put('/:siteName', isAuth, adminController.updateHome);

router.post('/:siteName/:pageName', isAuth, adminController.createPage);

router.get('/:siteName/:pageName', isAuth, adminController.getPage);

module.exports = router;
