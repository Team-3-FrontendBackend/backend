const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/global-data', isAuth, adminController.getGlobalData);

router.put('/global-data', isAuth, adminController.putGlobalData);

router.post('/:siteName', isAuth, adminController.createHome);

router.get('/:siteName', isAuth, adminController.getHome);

module.exports = router;
