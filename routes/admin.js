const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, adminController.getGlobalData);

// put or post route

module.exports = router;
