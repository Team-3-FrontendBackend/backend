const express = require('express');

const liveController = require('../controllers/live');

const router = express.Router();

router.get('/edit/:siteName', liveController.getHomePage);

router.get('/edit/:siteName/:pageName', liveController.getHomePage);

module.exports = router;