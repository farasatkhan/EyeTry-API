var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/Users/UsersController');
var { authenticateToken } = require('../controllers/Auth/AuthController');

router.get('/profile', authenticateToken, UsersController.profile);

module.exports = router;