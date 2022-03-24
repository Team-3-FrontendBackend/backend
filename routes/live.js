const express = require('express');

const liveController = require('../controllers/live');

const router = express.Router();

router.get('/:siteName', liveController.getHomePage);

router.get('/:siteName/:pageName', liveController.getSubPage);

module.exports = router;
