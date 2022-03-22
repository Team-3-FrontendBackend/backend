const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/test', isAuth, adminController.getData);

router.get('/', isAuth, adminController.getGlobalData);

module.exports = router;
