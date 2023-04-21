var express = require('express');
var router = express.Router();

var UsersController = require('../controllers/Users/UsersController');
var { authenticateToken } = require('../controllers/Auth/AuthController');

router.get('/profile', authenticateToken, UsersController.profile);

router.post('/update_info', authenticateToken, UsersController.updatePersonalInformation);

router.post('/delete_account', authenticateToken, UsersController.deleteAccount);

module.exports = router;