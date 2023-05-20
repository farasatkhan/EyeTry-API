var express = require('express');
var router = express.Router();

var AdminAuthController = require('../controllers/Auth/AdminAuthController');

// This route is only used for testing purposes. Admin cannot register an account.
router.post('/register', AdminAuthController.register);

router.post('/login', AdminAuthController.login);

router.delete('/logout', AdminAuthController.logout);

router.post('/token', AdminAuthController.generateNewAccessToken);

module.exports = router;