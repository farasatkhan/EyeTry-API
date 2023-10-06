var express = require('express');
var router = express.Router();

var { authenticateToken } = require('../controllers/Auth/AuthController');
var OrderController = require('../controllers/Products/v1/OrdersController');

router.post('/checkout', authenticateToken, OrderController.checkout);

module.exports = router;