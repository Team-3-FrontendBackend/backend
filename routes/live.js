const express = require('express');

const isAuth = require("../middleware/is-auth");
const liveController = require('../controllers/live');

const router = express.Router();

router.get('/:siteName', liveController.getHomePage);

router.get('/:siteName/:pageUrl', liveController.getSubPage);

module.exports = router;
