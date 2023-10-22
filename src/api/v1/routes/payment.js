var express = require('express');
var router = express.Router();

var { authenticateToken } = require('../controllers/Auth/AuthController');
var PaymentController = require('../controllers/Products/v1/PaymentController');

router.post('/process_payment',  PaymentController.processPayment);
router.get('/stripe_api_key', PaymentController.sendstripeApiKey);


module.exports = router;