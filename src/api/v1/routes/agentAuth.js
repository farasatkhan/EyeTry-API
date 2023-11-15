var express = require('express');
var router = express.Router();

var CustomerSupportAuthController = require('../controllers/Auth/CustomerSupportAuthController')


router.post('/register', CustomerSupportAuthController.register);

router.post('/login', CustomerSupportAuthController.login);

router.delete('/logout', CustomerSupportAuthController.logout);

router.post('/token', CustomerSupportAuthController.generateNewAccessToken);

router.post('/verify_token', CustomerSupportAuthController.verifyToken);

module.exports = router;